import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface TripData {
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
  // Frontend state properties
  tripType?: "upcoming" | "offered" | "past";
  status?: "rider" | "driver" | "completed";
}

// Get all rides (for Find Ride page)
export const fetchRides = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, String(value));
      }
    });
    
    const response = await fetch(`${API_URL}/api/rides?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rides: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching rides:', error);
    throw error;
  }
};

// Get rides for logged in user (My Trips page)
export const fetchMyTrips = async (token: string) => {
  try {
    // Get trips where user is the driver
    const driverResponse = await fetch(`${API_URL}/api/rides/driver/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!driverResponse.ok) {
      throw new Error(`Failed to fetch driver trips: ${driverResponse.status}`);
    }
    
    const driverTrips = await driverResponse.json();
    
    // Get trips where user is a rider (has made requests)
    const riderResponse = await fetch(`${API_URL}/api/requests/rider/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!riderResponse.ok) {
      throw new Error(`Failed to fetch rider trips: ${riderResponse.status}`);
    }
    
    const riderTrips = await riderResponse.json();
    
    // Process and categorize the trips
    const processed = {
      upcoming: [],
      offered: [],
      past: []
    };
    
    // Process driver trips
    driverTrips.forEach((trip: TripData) => {
      const departureDate = new Date(trip.departure_time);
      const now = new Date();
      
      // Add driver status
      const processedTrip = {
        ...trip,
        status: 'driver',
        tripType: departureDate > now ? 'offered' : 'past'
      };
      
      if (departureDate > now) {
        processed.offered.push(processedTrip);
      } else {
        processed.past.push(processedTrip);
      }
    });
    
    // Process rider trips
    riderTrips.forEach((request: any) => {
      const trip = request.ride;
      const departureDate = new Date(trip.departure_time);
      const now = new Date();
      
      // Add rider status
      const processedTrip = {
        ...trip,
        status: 'rider',
        tripType: departureDate > now ? 'upcoming' : 'past',
        requestStatus: request.status
      };
      
      if (departureDate > now) {
        processed.upcoming.push(processedTrip);
      } else {
        processed.past.push(processedTrip);
      }
    });
    
    return processed;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
};

// Get a specific ride by ID
export const fetchRideById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/api/rides/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ride: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ride ${id}:`, error);
    throw error;
  }
}; 