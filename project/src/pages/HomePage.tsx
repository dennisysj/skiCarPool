import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Clock, Users, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { fetchRides } from '../lib/api';
import { RideData } from '../types/index';
import { useToast } from '../components/ui/use-toast';

// Mock data for when API fails
const mockRides: RideData[] = [
  {
    id: 'm1',
    departure_location: 'Vancouver',
    destination: 'Whistler',
    departure_time: '2025-01-15T08:00:00Z',
    return_time: '2025-01-15T18:00:00Z',
    available_seats: 3,
    price: 30,
    driver_id: 'mock-driver-1',
    ski_resort: 'Whistler Blackcomb',
    pickup_zone: 'Downtown',
    description: 'Early morning trip to Whistler. Will stop for coffee on the way.',
    created_at: '2024-03-01T12:00:00Z',
    profiles: {
      username: 'johndoe',
      full_name: 'John Doe',
      avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: 'm2',
    departure_location: 'Seattle',
    destination: 'Crystal Mountain',
    departure_time: '2025-01-20T07:30:00Z',
    return_time: '2025-01-20T17:00:00Z',
    available_seats: 2,
    price: 25,
    driver_id: 'mock-driver-2',
    ski_resort: 'Crystal Mountain Resort',
    pickup_zone: 'Capitol Hill',
    description: 'Day trip to Crystal. I have room for skis and boards.',
    created_at: '2024-03-02T10:00:00Z',
    profiles: {
      username: 'sarahsmith',
      full_name: 'Sarah Smith',
      avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  }
];

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [searchData, setSearchData] = useState({
    departure_location: '',
    destination: '',
    from_date: '',
    to_date: '',
    min_seats: ''
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
      // Convert min_seats from string to number
      const searchParams = {
        ...searchData,
        min_seats: searchData.min_seats ? parseInt(searchData.min_seats) : undefined
      };
      
      const results = await fetchRides(searchParams);
      setSearchResults(results);
      setShowResults(true);
      console.log('Search results:', results);
      
      if (results.length === 0) {
        setError('No rides found matching your criteria. Try different search terms.');
      }
    } catch (err) {
      console.error('Error searching for rides:', err);
      setError('Failed to search for rides. Please try again later.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for rides. Please try again later."
      });
      
      // For demo purposes: use mock data when API fails
      console.log("Using mock data due to API error");
      setSearchResults(mockRides);
      setShowResults(true);
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
    // Navigate to ride details page
    console.log(`View ride with ID: ${rideId}`);
    // navigate(`/rides/${rideId}`);
  };

  const handleBookRide = async (rideId: string) => {
    if (!isUserLoggedIn) {
      toast({
        title: "Login required",
        description: "Please log in to book a ride",
        variant: "destructive" 
      });
      navigate('/login');
      return;
    }
    
    try {
      console.log(`Booking ride with ID: ${rideId}`);
      // In a real implementation, we would call the API here
      // await bookRide(rideId, 1);
      
      // For demo purposes
      toast({
        title: "Booking requested",
        description: "Your booking request has been submitted. Wait for the driver to confirm."
      });
    } catch (err) {
      console.error('Error booking ride:', err);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "Failed to book this ride. Please try again later."
      });
    }
  };

  return (
    <div className="flex flex-col items-center">

      {/* Hero Section */}
      <div className="w-full py-10 relative">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Using the Grouse Mountain JPEG image from public directory */}
          <img
            src="/grouse-mountain-2.jpeg"
            alt="Grouse Mountain view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/70"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">
                Find your next ski trip companion
              </h1>
              <p className="text-lg text-white opacity-90 mb-6">
                Connect with fellow ski enthusiasts and share rides to your favorite slopes
              </p>
              {!isUserLoggedIn && (
                <div className="flex gap-4">
                  <Button onClick={() => navigate('/login')} className="bg-white text-blue-700 hover:bg-gray-100">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d177087.53693213698!2d-123.2103550787545!3d49.36090397714666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54866f8566eb3e37%3A0x4d63448ce84b46f6!2sGrouse%20Mountain!5e0!3m2!1sen!2sca!4v1742683037083!5m2!1sen!2sca"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Find Rides Section */}
      <div className="w-full bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Find Rides</h2>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
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
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="to_date" className="block text-sm font-medium mb-1">
                    Return Date (Optional)
                  </label>
                  <Input
                    id="to_date"
                    name="to_date"
                    type="date"
                    value={searchData.to_date}
                    onChange={handleSearchChange}
                  />
                </div>
                <div>
                  <label htmlFor="min_seats" className="block text-sm font-medium mb-1">
                    Minimum Seats
                  </label>
                  <Input
                    id="min_seats"
                    name="min_seats"
                    type="number"
                    min="1"
                    max="10"
                    value={searchData.min_seats}
                    onChange={handleSearchChange}
                    placeholder="1"
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
              
              {!loading && searchResults.length === 0 && !error && (
                <p className="text-center py-8 text-slate-500">No rides found matching your criteria. Try different search terms.</p>
              )}
              
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
                    handleSearchSubmit(new Event('submit') as any);
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
                    handleSearchSubmit(new Event('submit') as any);
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
                    handleSearchSubmit(new Event('submit') as any);
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