import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Navbar } from './Navbar';
import { useEffect } from 'react';

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Layout rendered - Auth state:', user ? 'Authenticated' : 'Not authenticated');
    if (user) {
      console.log('User information:', user);
    }
  }, [user]);

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/login');
    }
  };

  // Debugging section - show authentication status on page
  const isAuthenticated = !!user;

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f9fc]">
      {/* Debug info for development */}
      {import.meta.env.DEV && (
        <div className="bg-yellow-100 px-4 py-1 text-sm">
          <h4>Simulated Authentication</h4>
          <p>Auth Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
          {isAuthenticated && <p>User: {user.email}</p>}
          <p className="text-xs">Using localStorage for authentication simulation</p>
        </div>
      )}
      
      <header className="flex items-center justify-between px-10 py-3 border-b border-[#e5e8ea]">
        <Link to="/" className="font-bold text-[#0c141c] text-lg">
          Ski Share
        </Link>

        <div>
          {user ? (
            <Button onClick={handleAuthClick} variant="outline">
              Sign Out
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button onClick={() => navigate('/login')} variant="outline">
                Log In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </header>
      
      {/* Always show navbar */}
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}