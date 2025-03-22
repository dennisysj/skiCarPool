import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Calendar, Car, MapPin, Clock, Users } from "lucide-react"
import { useState, useEffect } from "react"

// Define interface for trip data
interface TripData {
  id: string;
  name: string;
  age: number;
  carType: string;
  destination: string;
  price: number;
  date: string;
  departureTime: string;
  returnTime: string;
  seats: number;
  pickupLocation: string;
  tripType: "upcoming" | "offered" | "past";
  status: "rider" | "driver" | "completed";
}

// Component to fetch and display trip data
const TripCard = ({ tripData }: { tripData: TripData }) => {
  const { name, carType, destination, price, date, departureTime, returnTime, seats, pickupLocation, status } = tripData;

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
              <Calendar className="h-4 w-4 mr-1" /> {date}
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
              <span>{carType}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-slate-500" />
              <span>{pickupLocation}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-slate-500" />
              <span>Depart: {departureTime}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-slate-500" />
              <span>Return: {returnTime}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Users className="h-4 w-4 mr-2 text-slate-500" />
              <span>Price: ${price} · {seats} seats available</span>
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
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600">View Details</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export function MyTripsTab() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Fetch from our JSON file in public/api folder
        const response = await fetch('/api/trips.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch trips: ${response.status}`);
        }

        const data = await response.json();
        setTrips(data);
        console.log("Successfully loaded trip data:", data);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips data. Please try again later.');

        // For demo purposes: fall back to mock data when API fails
        setTrips(mockTrips);
        console.log("Using fallback mock data due to fetch error");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Filter trips by type
  const upcomingTrips = trips.filter(trip => trip.tripType === "upcoming");
  const offeredTrips = trips.filter(trip => trip.tripType === "offered");
  const pastTrips = trips.filter(trip => trip.tripType === "past");

  if (loading) {
    return <div className="flex justify-center py-12">Loading your trips...</div>;
  }

  if (error && trips.length === 0) {
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
          {upcomingTrips.length > 0 ? (
            upcomingTrips.map(trip => <TripCard key={trip.id} tripData={trip} />)
          ) : (
            <div className="text-center py-8 text-slate-500">You have no upcoming trips scheduled.</div>
          )}
        </TabsContent>

        <TabsContent value="offered" className="space-y-4 pt-4">
          {offeredTrips.length > 0 ? (
            offeredTrips.map(trip => <TripCard key={trip.id} tripData={trip} />)
          ) : (
            <div className="text-center py-8 text-slate-500">You haven't offered any trips yet.</div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 pt-4">
          {pastTrips.length > 0 ? (
            pastTrips.map(trip => <TripCard key={trip.id} tripData={trip} />)
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
    name: "John Doe",
    age: 28,
    carType: "Toyota 4Runner",
    destination: "Whistler Blackcomb",
    price: 35,
    date: "March 15, 2025",
    departureTime: "7:00 AM",
    returnTime: "5:00 PM",
    seats: 3,
    pickupLocation: "Downtown",
    tripType: "upcoming",
    status: "rider"
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 32,
    carType: "Subaru Outback",
    destination: "Park City",
    price: 30,
    date: "March 22, 2025",
    departureTime: "6:30 AM",
    returnTime: "4:30 PM",
    seats: 2,
    pickupLocation: "North Side",
    tripType: "upcoming",
    status: "rider"
  },
  {
    id: "3",
    name: "Your Name",
    age: 30,
    carType: "Jeep Wrangler",
    destination: "Aspen Snowmass",
    price: 40,
    date: "March 18, 2025",
    departureTime: "6:00 AM",
    returnTime: "5:30 PM",
    seats: 3,
    pickupLocation: "Downtown",
    tripType: "offered",
    status: "driver"
  },
  {
    id: "4",
    name: "Your Name",
    age: 30,
    carType: "Jeep Grand Cherokee",
    destination: "Vail",
    price: 45,
    date: "February 28, 2025",
    departureTime: "7:30 AM",
    returnTime: "6:00 PM",
    seats: 4,
    pickupLocation: "East Side",
    tripType: "past",
    status: "completed"
  }
];

