import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: '',
  });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Log authentication state for debugging
    const authState = user ? 'Authenticated' : 'Not authenticated';
    console.log('HomePage - Auth State:', authState);
    if (user) {
      console.log('HomePage - User info:', user);
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, [user]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for rides:', searchData);
    setShowResults(true);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Debug info */}
      {import.meta.env.DEV && false && (
        <div className="w-full bg-yellow-100 p-2 mb-4">
          <p>Auth state: {user ? 'Logged in' : 'Not logged in'}</p>
          {user && <p>User email: {user.email}</p>}
        </div>
      )}

      {/* Hero Section */}
      <div className="w-full bg-[#f7f9fc] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-[#0c141c] mb-4">
                Find your next ski trip companion
              </h1>
              <p className="text-lg text-[#4f7296] mb-6">
                Connect with fellow ski enthusiasts and share rides to your favorite slopes
              </p>
              {!isUserLoggedIn && (
                <div className="flex gap-4">
                  <Button onClick={() => navigate('/login')} className="bg-[#197fe5]">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1">
              <img
                src="/depth-6--frame-0.png"
                alt="Ski resort"
                className="rounded-xl w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Find Rides Section */}
      <div className="w-full bg-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Find Rides</h2>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium mb-1">
                    From
                  </label>
                  <Input
                    id="origin"
                    name="origin"
                    type="text"
                    value={searchData.origin}
                    onChange={handleSearchChange}
                    placeholder="e.g. Vancouver"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium mb-1">
                    To
                  </label>
                  <Input
                    id="destination"
                    name="destination"
                    type="text"
                    value={searchData.destination}
                    onChange={handleSearchChange}
                    placeholder="e.g. Whistler"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Date
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={searchData.date}
                    onChange={handleSearchChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button type="submit" className="px-8">
                  Search Rides
                </Button>
              </div>
            </form>
          </div>

          {showResults && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Available Rides</h3>

              {/* We'll just show some dummy rides for now */}
              <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{searchData.origin} to {searchData.destination}</h4>
                    <p className="text-sm text-gray-600">{searchData.date} · Departure: 7:00 AM · Return: 5:30 PM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$25 per seat</p>
                    <p className="text-sm text-gray-600">3 seats available</p>
                  </div>
                </div>
                <div className="flex items-center text-sm gap-4">
                  <div className="flex items-center">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Driver"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>John D. · 4.8 ★</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Toyota 4Runner</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="w-full bg-sky-500 hover:bg-sky-600 text-white hover:text-white">
                    Book Now!
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{searchData.origin} to {searchData.destination}</h4>
                    <p className="text-sm text-gray-600">{searchData.date} · Departure: 9:30 AM · Return: 6:00 PM</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$30 per seat</p>
                    <p className="text-sm text-gray-600">2 seats available</p>
                  </div>
                </div>
                <div className="flex items-center text-sm gap-4">
                  <div className="flex items-center">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Driver"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>Sarah M. · 4.9 ★</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Subaru Outback</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="w-full bg-sky-500 hover:bg-sky-600 text-white hover:text-white">
                    Book Now!
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}