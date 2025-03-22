import { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider } from '@supabase/supabase-js';

// This is a simulated AuthContext that uses only localStorage
// No actual authentication calls are made

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

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    setLoading(false);
  }, []);

  // Simple simulated sign in - just store in localStorage
  const signIn = async (email: string, password: string) => {
    console.log('Simulated sign in for:', email);
    
    // Create a fake user object with the email
    const fakeUser = {
      id: 'fake-id-' + Date.now(),
      email: email,
      user_metadata: {
        full_name: email.split('@')[0],
        avatar_url: null
      },
      created_at: new Date().toISOString()
    };
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(fakeUser));
    localStorage.setItem('token', 'fake-token-' + Date.now());
    
    // Update state
    setUser(fakeUser as unknown as User);
    console.log('User signed in successfully (simulated)');
  };

  const signInWithProvider = async (provider: Provider) => {
    console.log(`Simulated sign in with ${provider}`);
    
    // Create a fake user with the provider name
    const fakeUser = {
      id: `fake-${provider}-id-${Date.now()}`,
      email: `${provider.toLowerCase()}.user@example.com`,
      user_metadata: {
        full_name: `${provider} User`,
        avatar_url: null
      },
      created_at: new Date().toISOString()
    };
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(fakeUser));
    localStorage.setItem('token', `fake-${provider}-token-${Date.now()}`);
    
    // Update state
    setUser(fakeUser as unknown as User);
    console.log(`User signed in successfully via ${provider} (simulated)`);
  };

  const signUp = async (email: string, password: string, fullName?: string, username?: string) => {
    console.log('Simulated sign up for:', email);
    
    // Create a fake user object with the email and optional name
    const fakeUser = {
      id: 'fake-id-' + Date.now(),
      email: email,
      user_metadata: {
        full_name: fullName || email.split('@')[0],
        username: username || email.split('@')[0],
        avatar_url: null
      },
      created_at: new Date().toISOString()
    };
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(fakeUser));
    localStorage.setItem('token', 'fake-token-' + Date.now());
    
    // Update state
    setUser(fakeUser as unknown as User);
    console.log('User signed up and logged in successfully (simulated)');
  };

  const signOut = async () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Update state
    setUser(null);
    console.log('User signed out successfully (simulated)');
  };

  const loginWithoutConfirmation = async (email: string) => {
    // Just use the regular signIn since we're simulating anyway
    await signIn(email, 'fake-password');
    return true;
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