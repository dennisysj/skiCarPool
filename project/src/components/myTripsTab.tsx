import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Calendar, Car, MapPin, Clock, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { fetchMyTrips } from "../lib/api"

// Define interface for trip data - using the one from api.ts
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
  requestStatus?: string;
}

// Component to display trip data
const TripCard = ({ tripData }: { tripData: TripData }) => {
  const { destination, price, departure_time, return_time, available_seats, pickup_zone, status, car_model, ski_resort } = tripData;

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Determine badge styling based on status
  const getBadgeStyle = () => {
    switch (status) {
      case "rider":
        return "bg-sky-100 text-sky-700 hover:bg-sky-200";
      case "driver":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
      case "completed":
        return "bg-slate-100 text-slate-700 hover:bg-slate-200";
      default:
        return "bg-sky-100 text-sky-700 hover:bg-sky-200";
    }
  };

  return (
    <Card className={`border-sky-100 ${status === "completed" ? "opacity-75" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{destination}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" /> {formatDate(departure_time)}
            </CardDescription>
          </div>
          <Badge className={getBadgeStyle()}>
            {status === "rider" ? "Rider" : status === "driver" ? "Driver" : "Completed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 relative rounded-md overflow-hidden shrink-0">
            <img src="/placeholder.svg" alt="Car" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-2 text-slate-500" />
              <span>{car_model || "Vehicle"}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-slate-500" />
              <span>{pickup_zone || departure_location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-slate-500" />
              <span>Depart: {formatTime(departure_time)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-slate-500" />
              <span>Return: {return_time ? formatTime(return_time) : "N/A"}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Users className="h-4 w-4 mr-2 text-slate-500" />
              <span>Price: ${price} · {available_seats} seats available</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {status === "rider" ? (
          <>
            <Button variant="outline" size="sm">Message Driver</Button>
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600">View Details</Button>
          </>
        ) : status === "driver" ? (
          <>
            <Button variant="outline" size="sm">Edit Trip</Button>
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600">View Details</Button>
          </>
        ) : (
          <div className="ml-auto">
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export function MyTripsTab() {
  const { user, token } = useAuth();
  const [trips, setTrips] = useState<{
    upcoming: TripData[],
    offered: TripData[],
    past: TripData[]
  }>({
    upcoming: [],
    offered: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      if (!user || !token) {
        console.log('User not authenticated, using mock data');
        // Use mock data when not authenticated
        setTrips({
          upcoming: mockTrips.filter(trip => trip.tripType === "upcoming"),
          offered: mockTrips.filter(trip => trip.tripType === "offered"),
          past: mockTrips.filter(trip => trip.tripType === "past")
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const tripsData = await fetchMyTrips(token);
        setTrips(tripsData);
        console.log("Successfully loaded trip data:", tripsData);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips data. Please try again later.');

        // For demo purposes: fall back to mock data when API fails
        setTrips({
          upcoming: mockTrips.filter(trip => trip.tripType === "upcoming"),
          offered: mockTrips.filter(trip => trip.tripType === "offered"),
          past: mockTrips.filter(trip => trip.tripType === "past")
        });
        console.log("Using fallback mock data due to fetch error");
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [user, token]);

  if (loading) {
    return <div className="flex justify-center py-12">Loading your trips...</div>;
  }

  if (error && (!trips.upcoming.length && !trips.offered.length && !trips.past.length)) {
    return <div className="text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">My Trips</h2>
        <p className="text-slate-600">Manage your upcoming and past trips</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-200">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="offered">Offered</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 pt-4">
          {trips.upcoming.length > 0 ? (
            trips.upcoming.map(trip => <TripCard key={trip.id} tripData={trip} />)
          ) : (
            <div className="text-center py-8 text-slate-500">You have no upcoming trips scheduled.</div>
          )}
        </TabsContent>

        <TabsContent value="offered" className="space-y-4 pt-4">
          {trips.offered.length > 0 ? (
            trips.offered.map(trip => <TripCard key={trip.id} tripData={trip} />)
          ) : (
            <div className="text-center py-8 text-slate-500">You haven't offered any trips yet.</div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 pt-4">
          {trips.past.length > 0 ? (
            trips.past.map(trip => <TripCard key={trip.id} tripData={trip} />)
          ) : (
            <div className="text-center py-8 text-slate-500">You have no past trip history.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data for testing when API is unavailable
const mockTrips: TripData[] = [
  {
    id: "1",
    driver_id: "user1",
    departure_location: "Downtown",
    destination: "Whistler Blackcomb",
    ski_resort: "Whistler Blackcomb",
    pickup_zone: "Downtown",
    price: 35,
    departure_time: "2025-03-15T07:00:00Z",
    return_time: "2025-03-15T17:00:00Z",
    available_seats: 3,
    car_model: "Toyota 4Runner",
    created_at: "2025-02-15T07:00:00Z",
    tripType: "upcoming",
    status: "rider"
  },
  {
    id: "2",
    driver_id: "user2",
    departure_location: "North Side",
    destination: "Park City",
    ski_resort: "Park City",
    pickup_zone: "North Side",
    price: 30,
    departure_time: "2025-03-22T06:30:00Z",
    return_time: "2025-03-22T16:30:00Z",
    available_seats: 2,
    car_model: "Subaru Outback",
    created_at: "2025-02-22T06:30:00Z",
    tripType: "upcoming",
    status: "rider"
  },
  {
    id: "3",
    driver_id: "current-user",
    departure_location: "Downtown",
    destination: "Aspen Snowmass",
    ski_resort: "Aspen Snowmass",
    pickup_zone: "Downtown",
    price: 40,
    departure_time: "2025-03-18T06:00:00Z",
    return_time: "2025-03-18T17:30:00Z",
    available_seats: 3,
    car_model: "Jeep Wrangler",
    created_at: "2025-02-18T06:00:00Z",
    tripType: "offered",
    status: "driver"
  },
  {
    id: "4",
    driver_id: "current-user",
    departure_location: "Downtown",
    destination: "Vail",
    ski_resort: "Vail",
    pickup_zone: "Downtown",
    price: 45,
    departure_time: "2025-02-28T06:00:00Z",
    return_time: "2025-02-28T18:00:00Z",
    available_seats: 2,
    car_model: "Jeep Grand Cherokee",
    created_at: "2025-01-28T06:00:00Z",
    tripType: "past",
    status: "completed"
  }
];

