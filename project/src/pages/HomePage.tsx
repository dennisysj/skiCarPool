import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { fetchRides } from '../lib/api';
import { Calendar, MapPin, Clock, Users, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Navbar } from '../components/Navbar';

// Interface for ride data
interface RideData {
  id: string;
  departure_location: string;
  destination: string;
  departure_time: string;
  return_time?: string;
  available_seats: number;
  price: number;
  driver_id: string;
  ski_resort: string;
  pickup_zone: string;
  car_make?: string;
  car_model?: string;
  car_photo_url?: string;
  gear_space?: string;
  description?: string;
  created_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [searchData, setSearchData] = useState({
    departure_location: '',
    destination: '',
    from_date: '',
  });
  const [searchResults, setSearchResults] = useState<RideData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('Searching for rides:', searchData);
    
    try {
      const results = await fetchRides(searchData);
      setSearchResults(results);
      setShowResults(true);
      console.log('Search results:', results);
      
      if (results.length === 0) {
        setError('No rides found matching your criteria. Try different search terms.');
      }
    } catch (err) {
      console.error('Error searching for rides:', err);
      setError('Failed to search for rides. Please try again later.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewRide = (rideId: string) => {
    // In a real app, navigate to ride details page
    console.log(`View ride with ID: ${rideId}`);
  };

  const handleBookRide = (rideId: string) => {
    if (!isUserLoggedIn) {
      navigate('/login');
      return;
    }
    
    // In a real app, navigate to booking page or show booking modal
    console.log(`Book ride with ID: ${rideId}`);
  };

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      
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
                  <label htmlFor="departure_location" className="block text-sm font-medium mb-1">
                    From
                  </label>
                  <Input
                    id="departure_location"
                    name="departure_location"
                    type="text"
                    value={searchData.departure_location}
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
                  <label htmlFor="from_date" className="block text-sm font-medium mb-1">
                    Date
                  </label>
                  <Input
                    id="from_date"
                    name="from_date"
                    type="date"
                    value={searchData.from_date}
                    onChange={handleSearchChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button type="submit" className="px-8" disabled={loading}>
                  {loading ? 'Searching...' : 'Search Rides'}
                </Button>
              </div>
            </form>
          </div>

          {showResults && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Available Rides</h3>
              
              {error && <p className="text-red-500 mb-4">{error}</p>}
              
              {!loading && searchResults.length > 0 && searchResults.map(ride => (
                <Card key={ride.id} className="border-sky-100 mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{ride.destination}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" /> {formatDate(ride.departure_time)}
                        </CardDescription>
                      </div>
                      <Badge className="bg-sky-100 text-sky-700">
                        ${ride.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 relative rounded-md overflow-hidden shrink-0">
                        <img 
                          src={ride.car_photo_url || "/placeholder.svg"} 
                          alt="Car" 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-slate-500" />
                          <span>{ride.car_model || ride.car_make || "Vehicle"}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                          <span>{ride.pickup_zone || ride.departure_location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-slate-500" />
                          <span>Depart: {formatTime(ride.departure_time)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-slate-500" />
                          <span>Return: {ride.return_time ? formatTime(ride.return_time) : "N/A"}</span>
                        </div>
                        <div className="flex items-center col-span-2">
                          <Users className="h-4 w-4 mr-2 text-slate-500" />
                          <span>
                            Driver: {ride.profiles?.full_name || ride.profiles?.username || "Anonymous"} · 
                            {ride.available_seats} seats available
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewRide(ride.id)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-sky-500 hover:bg-sky-600"
                      onClick={() => handleBookRide(ride.id)}
                    >
                      Book Now!
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {loading && (
                <div className="text-center py-8">
                  <p>Searching for rides...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Featured Destinations Section */}
      <div className="w-full bg-[#f7f9fc] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="/whistler.jpg"
                alt="Whistler"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">Whistler Blackcomb</h3>
                <p className="text-sm text-gray-600 mb-4">North America's largest ski resort with over 8,000 acres of terrain.</p>
                <Button variant="outline" className="w-full" onClick={() => {
                  setSearchData({...searchData, destination: 'Whistler'});
                  // Auto-search when clicking on a featured destination
                  setTimeout(() => {
                    const searchButton = document.querySelector('[type="submit"]');
                    if (searchButton) {
                      (searchButton as HTMLButtonElement).click();
                    }
                  }, 100);
                }}>
                  Find Rides
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="/cypress.jpg"
                alt="Cypress Mountain"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">Cypress Mountain</h3>
                <p className="text-sm text-gray-600 mb-4">Vancouver's largest ski area, just 30 minutes from downtown.</p>
                <Button variant="outline" className="w-full" onClick={() => {
                  setSearchData({...searchData, destination: 'Cypress'});
                  setTimeout(() => {
                    const searchButton = document.querySelector('[type="submit"]');
                    if (searchButton) {
                      (searchButton as HTMLButtonElement).click();
                    }
                  }, 100);
                }}>
                  Find Rides
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src="/grouse.jpg"
                alt="Grouse Mountain"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">Grouse Mountain</h3>
                <p className="text-sm text-gray-600 mb-4">Known as the Peak of Vancouver with stunning city views.</p>
                <Button variant="outline" className="w-full" onClick={() => {
                  setSearchData({...searchData, destination: 'Grouse'});
                  setTimeout(() => {
                    const searchButton = document.querySelector('[type="submit"]');
                    if (searchButton) {
                      (searchButton as HTMLButtonElement).click();
                    }
                  }, 100);
                }}>
                  Find Rides
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}