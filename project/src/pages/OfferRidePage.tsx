import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function OfferRidePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seats: 1,
    price: 0,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Check if user is logged in
  React.useEffect(() => {
    if (!user) {
      // Redirect to login page if not logged in
      alert('Please log in to offer a ride');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seats' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // This would be replaced with an actual API call
      console.log('Submitting ride offer:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      // Reset form after submission
      setFormData({
        origin: '',
        destination: '',
        date: '',
        time: '',
        seats: 1,
        price: 0,
        description: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit ride offer');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Ride Offered Successfully!</h2>
        <p className="text-center mb-6">Your ride has been posted and is now available for others to join.</p>
        <div className="flex justify-center">
          <Button onClick={() => {
            setSuccess(false);
          }}>
            Offer Another Ride
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Offer a Ride</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium mb-1">
              Origin
            </label>
            <Input
              id="origin"
              name="origin"
              type="text"
              value={formData.origin}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="e.g. Vancouver"
            />
          </div>
          
          <div>
            <label htmlFor="destination" className="block text-sm font-medium mb-1">
              Destination
            </label>
            <Input
              id="destination"
              name="destination"
              type="text"
              value={formData.destination}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="e.g. Whistler"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1">
              Time
            </label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="seats" className="block text-sm font-medium mb-1">
              Available Seats
            </label>
            <Input
              id="seats"
              name="seats"
              type="number"
              min="1"
              max="10"
              value={formData.seats}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price per Seat ($)
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Additional Information
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional details about your trip, vehicle, etc."
            disabled={loading}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Offer Ride'}
        </Button>
      </form>
    </div>
  );
}