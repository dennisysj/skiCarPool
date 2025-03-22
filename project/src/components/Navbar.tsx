import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
    
  };

  return (
    <nav className="w-full border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-8">
              <NavItem 
                to="/" 
                label="Find a Ride" 
                isActive={isActive('/')} 
              />
              <NavItem 
                to="/offer-ride" 
                label="Offer a Ride" 
                isActive={isActive('/offer-ride')} 
              />
              <NavItem 
                to="/my-trips" 
                label="My Trips" 
                isActive={isActive('/my-trips')} 
              />
              <NavItem 
                to="/profile" 
                label="Profile" 
                isActive={isActive('/profile')} 
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

function NavItem({ to, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center px-1 pt-1 pb-2 text-sm font-medium ${
        isActive 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
      }`}
    >
      {label}
    </Link>
  );
} 