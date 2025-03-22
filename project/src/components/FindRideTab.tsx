import React from "react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "../lib/utils";

const formSchema = z.object({
    searchType: z.enum(["resort", "pickup"]),
    resort: z.string().optional(),
    pickupZone: z.string().optional(),
    date: z.date(),
});

export function FindRideTab() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searchType: "resort",
            date: new Date(),
        },
    });

    const searchType = form.watch("searchType");

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-slate-800">Find a Ride</h2>
                <p className="text-slate-600">Search for available rides to your favorite ski resorts</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="searchType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Search by</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select search type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="resort">Resort + Date</SelectItem>
                                        <SelectItem value="pickup">Pickup Zone + Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    {searchType === "resort" ? (
                        <FormField
                            control={form.control}
                            name="resort"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ski Resort</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Select a resort" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="whistler">Whistler Blackcomb</SelectItem>
                                            <SelectItem value="vail">Vail</SelectItem>
                                            <SelectItem value="park-city">Park City</SelectItem>
                                            <SelectItem value="aspen">Aspen Snowmass</SelectItem>
                                            <SelectItem value="jackson-hole">Jackson Hole</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            control={form.control}
                            name="pickupZone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pickup Zone</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Select a pickup zone" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="downtown">Downtown</SelectItem>
                                            <SelectItem value="north">North Side</SelectItem>
                                            <SelectItem value="south">South Side</SelectItem>
                                            <SelectItem value="east">East Side</SelectItem>
                                            <SelectItem value="west">West Side</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn("pl-3 text-left font-normal bg-white", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
                        <Search className="mr-2 h-4 w-4" /> Search Rides
                    </Button>
                </form>
            </Form>
        </div>
    );
} 