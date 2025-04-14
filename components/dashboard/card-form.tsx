"use client";

import { useState } from "react";
import { Building, Mail, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCardStore } from "@/lib/store/card-store";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { FormData } from "@/lib/store/card-store";

interface CardFormProps {
    onSubmit: (data: FormData) => Promise<void>;
    isSubmitting: boolean;
}

export function CardForm({ onSubmit, isSubmitting }: CardFormProps) {
    const { formData, setFormData, username, isGenerating, setIsGenerating } = useCardStore();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { toast } = useToast();

    const validateForm = (data: FormData): boolean => {
        if (!data.fullName?.trim()) {
            toast({ title: "Error", description: "Full name is required", variant: "destructive" });
            return false;
        }
        if (!data.position?.trim()) {
            toast({ title: "Error", description: "Position is required", variant: "destructive" });
            return false;
        }
        if (!data.phone?.trim()) {
            toast({ title: "Error", description: "Phone number is required", variant: "destructive" });
            return false;
        }
        if (!data.email?.trim()) {
            toast({ title: "Error", description: "Email is required", variant: "destructive" });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
            return false;
        }
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value.trim() } as FormData;

        if (name === 'email') {
            const username = value.split('@')[0].toLowerCase();
            setFormData({ ...updatedData, username } as FormData);
        } else {
            setFormData(updatedData);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Error",
                    description: "Image size should be less than 5MB",
                    variant: "destructive"
                });
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Error",
                    description: "Please upload a valid image file",
                    variant: "destructive"
                });
                return;
            }

            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    if (base64String && base64String.startsWith('data:image/')) {
                        setFormData({ ...formData, image: base64String });
                        setImagePreview(base64String);
                        console.log('Image processed successfully');
                    } else {
                        throw new Error('Invalid image format');
                    }
                };
                reader.onerror = () => {
                    throw new Error('Failed to read image file');
                };
                reader.readAsDataURL(file);
                setImageFile(file);
            } catch (error) {
                console.error('Image processing error:', error);
                toast({
                    title: "Error",
                    description: "Failed to process the image. Please try again.",
                    variant: "destructive"
                });
                removeImage();
            }
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, image: null });
        const input = document.getElementById('image') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm(formData)) {
            return;
        }

        setIsGenerating(true);
        try {
            // Create a clean data object for submission
            const submissionData: FormData = {
                fullName: formData.fullName.trim(),
                position: formData.position.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                image: formData.image // This should be the base64 string
            };

            console.log('Submitting form with image:', !!submissionData.image);
            await onSubmit(submissionData);
            console.log('Form submitted successfully');

            // Reset form after successful submission
            setFormData({
                fullName: '',
                position: '',
                phone: '',
                email: '',
                image: null
            });
            setImageFile(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Form submission error:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to generate business card. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-full md:max-w-lg lg:max-w-2xl mx-auto px-4 md:px-0 space-y-4 sm:space-y-5 md:space-y-6">
            <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {/* Full Name Field */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                    <Label
                        htmlFor="fullName"
                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        </div>
                        <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            className="pl-7 sm:pl-9 h-8 sm:h-9 md:h-10 text-xs sm:text-sm bg-background"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Position Field */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                    <Label
                        htmlFor="position"
                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Position <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                            <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        </div>
                        <Input
                            id="position"
                            name="position"
                            placeholder="Enter your position"
                            className="pl-7 sm:pl-9 h-8 sm:h-9 md:h-10 text-xs sm:text-sm bg-background"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                    <Label
                        htmlFor="phone"
                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        </div>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="+234 000 0000 000"
                            className="pl-7 sm:pl-9 h-8 sm:h-9 md:h-10 text-xs sm:text-sm bg-background"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="youremail@accessbankplc.com"
                            className="pl-7 sm:pl-9 h-8 sm:h-9 md:h-10 text-xs sm:text-sm bg-background"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Profile Image Field */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                    <Label
                        htmlFor="image"
                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Profile Image
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start">
                        <div className="flex-1 flex items-center gap-2 sm:gap-3 w-full">
                            <div className="relative flex-1">
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer text-xs sm:text-sm h-8 sm:h-9 md:h-10 file:mr-2 sm:file:mr-3 md:file:mr-4 file:py-1 sm:file:py-1.5 md:file:py-2 file:px-2 sm:file:px-3 md:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 w-full"
                                />
                            </div>
                            {imagePreview && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0"
                                    onClick={removeImage}
                                >
                                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                            )}
                        </div>
                        {imagePreview && (
                            <div className="sm:ml-0 relative w-16 h-16 sm:w-18 md:w-20 sm:h-18 md:h-20 rounded-lg overflow-hidden border flex-shrink-0">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* QR Code Info */}
                <div className="rounded-lg bg-secondary/50 p-2.5 sm:p-3 md:p-4 text-xs sm:text-sm space-y-1 sm:space-y-1.5">
                    <p className="font-medium text-secondary-foreground">QR Code Information:</p>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1">
                        <p>• Generated using QR Code Monkey API</p>
                        <p>• Links to: {process.env.NEXT_PUBLIC_APP_URL}/{username}</p>
                        <p>• Includes Access Bank logo in center</p>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-8 sm:h-9 md:h-10 text-xs sm:text-sm font-medium mt-1 sm:mt-2"
                    disabled={isSubmitting || isGenerating}
                >
                    {isSubmitting || isGenerating ? (
                        <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <span className="h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                            Creating...
                        </span>
                    ) : (
                        "Generate Business Card"
                    )}
                </Button>
            </div>
        </form>
    );
}