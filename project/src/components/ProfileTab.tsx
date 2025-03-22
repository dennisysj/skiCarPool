import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    bio: z.string().optional(),
    profilePicture: z.any().optional(),
})

export function ProfileTab() {
    const [avatarSrc, setAvatarSrc] = useState<string>("/placeholder.svg");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "John Snow",
            email: "john.snow@example.com",
            phone: "(555) 123-4567",
            bio: "Avid skier and snowboarder. I love fresh powder days and meeting new people on the slopes!",
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a preview URL for the selected image
            const imageUrl = URL.createObjectURL(file);
            setAvatarSrc(imageUrl);

            // Update the form value
            form.setValue("profilePicture", file);
        }
    };

    const handlePhotoButtonClick = () => {
        // Trigger the hidden file input
        fileInputRef.current?.click();
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted with values:", values);

        // In a real app, you would upload the image to your backend here
        if (values.profilePicture instanceof File) {
            // Example of how you might handle file upload in a real application:
            console.log("Would upload file:", values.profilePicture.name);

            // Create a FormData object to send the file
            // const formData = new FormData();
            // formData.append("profilePicture", values.profilePicture);
            // fetch('/api/upload-profile-image', {
            //   method: 'POST',
            //   body: formData
            // });
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-slate-800">Profile</h2>
                <p className="text-slate-600">Manage your personal information</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src={avatarSrc} alt="Profile" />
                        <AvatarFallback className="text-3xl bg-sky-200 text-sky-700">JS</AvatarFallback>
                    </Avatar>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handlePhotoButtonClick}
                    >
                        <Upload className="h-4 w-4 mr-2" /> Change Photo
                    </Button>

                    <div className="text-center space-y-1">
                        <h3 className="font-semibold text-lg">John Snow</h3>
                        <p className="text-sm text-slate-500">Member since January 2025</p>
                    </div>
                </div>

                <div className="md:w-2/3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="bg-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" className="bg-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-white" />
                                            </FormControl>
                                            <FormDescription>Used for trip coordination</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className="resize-none bg-white" rows={4} />
                                        </FormControl>
                                        <FormDescription>
                                            Tell others about yourself and your skiing/snowboarding preferences
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="bg-sky-500 hover:bg-sky-600">
                                <Save className="h-4 w-4 mr-2" /> Save Changes
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
} 