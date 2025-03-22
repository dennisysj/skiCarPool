import { SearchIcon } from "lucide-react";
import React from "react";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

export const DepthFrame = (): JSX.Element => {
  // Navigation links data
  const navLinks = [
    { title: "Find a Ride", active: false },
    { title: "Offer a Ride", active: false },
    { title: "My Trips", active: false },
  ];

  // Tab data
  const tabItems = [
    { value: "find", label: "Find a Ride", active: true },
    { value: "offer", label: "Offer a Ride", active: false },
    { value: "trips", label: "My Trips", active: false },
    { value: "profile", label: "Profile", active: false },
  ];

  // Popular destinations data
  const destinations = [
    { name: "Tahoe City", image: "..//depth-7--frame-0.png" },
    { name: "Truckee", image: "..//depth-7--frame-0-1.png" },
    {
      name: "Northstar California Resort",
      image: "..//depth-7--frame-0-2.png",
    },
    { name: "Reno", image: "..//depth-7--frame-0-3.png" },
  ];

  // Featured rides data
  const featuredRides = [
    {
      time: "Today, 8:00 AM",
      route: "San Francisco to Northstar",
      seats: "2 seats available",
      image: "..//depth-6--frame-1.png",
    },
    {
      time: "Today, 8:00 AM",
      route: "San Francisco to Northstar",
      seats: "2 seats available",
      image: "..//depth-6--frame-1-1.png",
    },
  ];

  return (
    <div className="flex flex-col min-h-[800px] items-start bg-[#f7f9fc]">
      <header className="flex items-center justify-between px-10 py-3 w-full border-b border-[#e5e8ea]">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 overflow-hidden">
            {/* Logo placeholder */}
            <div className="w-[15px] h-3" />
          </div>
          <h1 className="font-bold text-[#0c141c] text-lg">Ski Share</h1>
        </div>

        <div className="flex items-center justify-end gap-8 flex-1">
          <nav className="flex items-center gap-9">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="font-medium text-[#0c141c] text-sm"
              >
                {link.title}
              </a>
            ))}
          </nav>
          <Avatar className="w-10 h-10 rounded-[20px]">
            <img
              src="..//depth-4--frame-1.png"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </Avatar>
        </div>
      </header>

      <main className="flex justify-center px-40 py-5 w-full flex-1">
        <div className="flex flex-col max-w-[960px] w-[960px] items-start py-5">
          <Tabs defaultValue="find" className="w-full">
            <TabsList className="flex w-full justify-between px-4 border-b border-[#d1dbe8] bg-transparent h-auto">
              {tabItems.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`flex-1 pt-4 pb-[13px] border-b-[3px] border-[#e5e8ea] rounded-none data-[state=active]:border-[#197fe5] data-[state=active]:shadow-none ${
                    tab.active ? "text-[#0c141c]" : "text-[#4f7296]"
                  } font-bold text-sm`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="find" className="w-full mt-0">
              <section className="flex items-start gap-8 px-4 py-10 w-full">
                <div
                  className="flex-1 min-w-[400px] h-[279px] rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: "url(..//depth-6--frame-0.png)" }}
                />

                <div className="flex flex-col min-w-[400px] h-[279px] items-start justify-center gap-8">
                  <div className="w-[400px] h-[120px] text-center">
                    <h2 className="font-extrabold text-[#0c141c] text-5xl tracking-[-2.00px] leading-[60px]">
                      Find a ride to the mountain
                    </h2>
                  </div>

                  <div className="flex w-full h-16 items-center rounded-xl bg-[#e8edf2]">
                    <div className="pl-4 flex items-center h-full">
                      <SearchIcon className="h-5 w-5 text-[#4f7296]" />
                    </div>
                    <Input
                      className="flex-1 border-none bg-transparent h-full text-[#4f7296] text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter your destination"
                    />
                    <div className="pr-2">
                      <Button className="min-w-[84px] h-12 bg-[#197fe5] text-[#f7f9fc] font-bold text-base rounded-xl">
                        SearchIcon
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="pt-5 pb-2 px-4 w-full">
                <h3 className="font-bold text-[#0c141c] text-2xl">
                  Popular destinations
                </h3>
              </section>

              <section className="flex gap-3 p-4 w-full">
                <div className="flex items-start gap-3 w-full">
                  {destinations.map((destination, index) => (
                    <Card
                      key={index}
                      className="w-[223px] border-none bg-transparent"
                    >
                      <CardContent className="p-0 pb-3 flex flex-col gap-3">
                        <div
                          className="w-full h-[125px] rounded-xl bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${destination.image})`,
                          }}
                        />
                        <p className="font-medium text-[#0c141c] text-base">
                          {destination.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="pt-5 pb-2 px-4 w-full">
                <h3 className="font-bold text-[#0c141c] text-2xl">
                  Featured rides
                </h3>
              </section>

              {featuredRides.map((ride, index) => (
                <section key={index} className="p-4 w-full">
                  <div className="flex items-start justify-between w-full rounded-xl">
                    <div className="w-[608px] h-[171px] flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="font-normal text-[#4f7296] text-sm">
                          {ride.time}
                        </p>
                        <h4 className="font-bold text-[#0c141c] text-base leading-5">
                          {ride.route}
                        </h4>
                        <p className="font-normal text-[#4f7296] text-sm">
                          {ride.seats}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-fit h-8 px-4 bg-[#e8edf2] border-none text-[#0c141c] font-medium text-sm rounded-xl"
                      >
                        Request Ride
                      </Button>
                    </div>
                    <div
                      className="flex-1 h-[171px] rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${ride.image})` }}
                    />
                  </div>
                </section>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
