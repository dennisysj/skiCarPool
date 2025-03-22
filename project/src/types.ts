export interface RideData {
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
  requestStatus?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface BookingData {
  id: string;
  ride_id: string;
  passenger_id: string;
  status: "confirmed" | "pending" | "cancelled";
  passenger_count: number;
  created_at: string;
  ride?: RideData;
  profiles?: UserProfile;
} 