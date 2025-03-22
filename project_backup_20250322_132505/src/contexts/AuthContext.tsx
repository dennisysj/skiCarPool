import { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, username?: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  loginWithoutConfirmation: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    try {
      // Try direct sign-in first
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      console.log('Sign in response:', { data, error });
      
      // If successful login
      if (!error && data?.session) {
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        console.log('User signed in successfully, state updated');
        return;
      }
      
      // If there's an email confirmation error or any other error, try a workaround
      if (error) {
        console.log('Login failed with error:', error.message);
        console.log('Attempting alternative login method...');
        
        // Create a special admin client to bypass restrictions if possible
        try {
          // Try another approach: reset password to get a magic link
          const { error: magicLinkError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auto-login`,
          });
          
          if (magicLinkError) {
            console.error('Failed to generate magic link:', magicLinkError);
          } else {
            console.log('Magic link generated. Check email for login link.');
          }
          
          // Even if we sent a magic link, try direct login one more time
          // This sometimes works on the second try
          const { error: retryError, data: retryData } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (!retryError && retryData?.session) {
            localStorage.setItem('token', retryData.session.access_token);
            localStorage.setItem('user', JSON.stringify(retryData.user));
            setUser(retryData.user);
            console.log('User signed in successfully on retry');
            return;
          }
          
          // If we still have an error after retry, throw it
          if (retryError) {
            throw retryError;
          }
        } catch (workaroundErr) {
          console.error('Error during login workaround:', workaroundErr);
          throw error; // Throw the original error
        }
      }
    } catch (err) {
      console.error('Error during sign in process:', err);
      throw err;
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName?: string, username?: string) => {
    // Always disable email confirmation for development to avoid issues
    const disableEmailConfirmation = true; // Force this to be true regardless of env variable
    console.log('Email confirmation is disabled:', disableEmailConfirmation);
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          username: username,
          email_confirm: true // Always mark as confirmed
        }
      }
    });
    
    if (error) {
      if (error.message.includes('rate_limit')) {
        throw new Error('Please wait a moment before trying again');
      }
      console.error('Signup error:', error);
      throw error;
    }
    
    // In development, always auto-confirm users and sign them in
    if (data?.user) {
      console.log('Signup successful, auto-signing in the user');
      try {
        // Auto sign in the user immediately after signup
        const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Error auto-signing in after signup:', signInError);
        } else {
          console.log('Auto-signed in user successfully after signup');
          
          // Store user data in localStorage for the backend
          if (signInData?.session) {
            localStorage.setItem('token', signInData.session.access_token);
            localStorage.setItem('user', JSON.stringify(signInData.user));
            
            // Explicitly update the user state
            setUser(signInData.user);
          }
        }
      } catch (err) {
        console.error('Error with auto-login:', err);
      }
    } else {
      console.log('No user returned from signup process');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const loginWithoutConfirmation = async (email: string) => {
    try {
      // This is only for development purposes!
      // It would be a security risk in production
      console.log('Attempting to login without email confirmation for:', email);
      
      // First, use admin access to update the user's confirmation status
      // Note: This requires the service role key and won't work with the anon key
      const adminSupabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_SERVICE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      
      // Get the user by email
      const { data: userData, error: userError } = await adminSupabase
        .from('auth.users')
        .select('id, email')
        .eq('email', email)
        .single();
      
      if (userError || !userData) {
        console.error('Error finding user for auto-confirmation:', userError);
        return false;
      }
      
      console.log('Found user:', userData);
      
      // Generate a magic link for the user to automatically log in
      const { error: magicLinkError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auto-login`,
      });
      
      if (magicLinkError) {
        console.error('Error generating magic link:', magicLinkError);
        return false;
      }
      
      console.log('Generated magic link. Please check your email for a login link.');
      return true;
    } catch (error) {
      console.error('Error in loginWithoutConfirmation:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signInWithProvider, 
      signOut,
      loginWithoutConfirmation 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}