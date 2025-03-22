import { RideData } from '../types/index';

const API_URL = 'http://localhost:3000/api';

// Generic fetch helper with better error handling
export async function fetchApi(url: string, options: RequestInit = {}) {
  try {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    
    // Set default headers if not provided
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for auth
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      // Enhanced error message - include the server's error message or a default
      throw new Error(data.error || data.message || `API request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    // Generic error message for server connection issues
    if (!(error instanceof Error) || !error.message.includes('API request failed')) {
      throw new Error('Could not connect to server. Please check your connection and try again.');
    }
    throw error;
  }
}

// Fetch available rides
export async function fetchRides(filters?: { 
  departure_location?: string, 
  destination?: string, 
  from_date?: string, 
  to_date?: string, 
  min_seats?: number 
}) {
  let queryParams = '';
  
  if (filters) {
    const params = new URLSearchParams();
    if (filters.departure_location) params.append('departure_location', filters.departure_location);
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.from_date) params.append('from_date', filters.from_date);
    if (filters.to_date) params.append('to_date', filters.to_date);
    if (filters.min_seats) params.append('min_seats', filters.min_seats.toString());
    queryParams = `?${params.toString()}`;
  }
  
  return fetchApi(`${API_URL}/rides${queryParams}`);
}

// Fetch a specific ride by ID
export async function fetchRide(id: string) {
  return fetchApi(`${API_URL}/rides/${id}`);
}

// Create a new ride
export async function createRide(rideData: any) {
  return fetchApi(`${API_URL}/rides`, {
    method: 'POST',
    body: JSON.stringify(rideData),
  });
}

// Fetch trips (rides where user is driver or passenger)
export async function fetchMyTrips() {
  try {
    // First try the authenticated endpoint
    return await fetchApi(`${API_URL}/my-trips`);
  } catch (error) {
    console.log('Falling back to mock trips data');
    // Fall back to the mock data endpoint if we have auth issues
    return fetchApi(`${API_URL}/my-trips/mock`);
  }
}

// Book a ride (create a ride request)
export async function bookRide(rideId: string, passengerCount: number) {
  return fetchApi(`${API_URL}/ride-requests`, {
    method: 'POST',
    body: JSON.stringify({ ride_id: rideId, passenger_count: passengerCount }),
  });
}

// Cancel a booking (delete a ride request)
export async function cancelBooking(requestId: string) {
  return fetchApi(`${API_URL}/ride-requests/${requestId}`, {
    method: 'DELETE',
  });
}

// Update a ride
export async function updateRide(id: string, rideData: any) {
  return fetchApi(`${API_URL}/rides/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rideData),
  });
}

// Cancel a ride (delete a ride)
export async function cancelRide(id: string) {
  return fetchApi(`${API_URL}/rides/${id}`, {
    method: 'DELETE',
  });
} 