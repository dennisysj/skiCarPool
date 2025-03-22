import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Calendar, Car, MapPin, Clock, Users } from "lucide-react"

export function MyTripsTab() {
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
          <Card className="border-sky-100">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Whistler Blackcomb</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" /> March 15, 2025
                  </CardDescription>
                </div>
                <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200">Rider</Badge>
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
                    <span>Toyota 4Runner</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Downtown</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Depart: 7:00 AM</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Return: 5:00 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Message Driver
              </Button>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                View Details
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-sky-100">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Park City</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" /> March 22, 2025
                  </CardDescription>
                </div>
                <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200">Rider</Badge>
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
                    <span>Subaru Outback</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                    <span>North Side</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Depart: 6:30 AM</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Return: 4:30 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Message Driver
              </Button>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                View Details
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="offered" className="space-y-4 pt-4">
          <Card className="border-sky-100">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Aspen Snowmass</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" /> March 18, 2025
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Driver</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 relative rounded-md overflow-hidden shrink-0">
                  <img src="/placeholder.svg" alt="Car" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-slate-500" />
                    <span>3 riders joined</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Downtown</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Depart: 6:00 AM</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Return: 5:30 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit Trip
              </Button>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                View Details
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-4 pt-4">
          <Card className="border-sky-100 opacity-75">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Vail</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" /> February 28, 2025
                  </CardDescription>
                </div>
                <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">Completed</Badge>
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
                    <span>Jeep Grand Cherokee</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                    <span>East Side</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Depart: 7:30 AM</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Return: 6:00 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

