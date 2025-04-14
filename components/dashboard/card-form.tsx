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
        <form onSubmit={handleSubmit} className="w-full min-w-[280px] mx-auto space-y-4">
            <div className="grid gap-4">
                {/* Full Name Field */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="fullName"
                        className="text-[13px] font-medium leading-none"
                    >
                        Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            className="pl-8 h-9 text-[13px] bg-background max-w-full w-[300px] sm:w-full"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Position Field */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="position"
                        className="text-[13px] font-medium leading-none"
                    >
                        Position <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                            <Building className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <Input
                            id="position"
                            name="position"
                            placeholder="Enter your position"
                            className="pl-8 h-9 text-[13px] bg-background max-w-full w-[300px] sm:w-full"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="phone"
                        className="text-[13px] font-medium leading-none"
                    >
                        Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="+234 000 0000 000"
                            className="pl-8 h-9 text-[13px] bg-background max-w-full w-[300px] sm:w-full"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="email"
                        className="text-[13px] font-medium leading-none"
                    >
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="youremail@accessbankplc.com"
                            className="pl-8 h-9 text-[13px] bg-backgroundmax-w-full w-[300px] sm:w-full"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Profile Image Field */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="image"
                        className="text-[13px] font-medium leading-none"
                    >
                        Profile Image
                    </Label>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 w-full">
                            <div className="relative flex-1">
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer text-[13px] h-9 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80 sm:w-full w-[300px]"
                                />
                            </div>
                            {imagePreview && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-9 w-9 shrink-0"
                                    onClick={removeImage}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>
                        {imagePreview && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>



                {/* Submit Button */}
                <Button
                    type="submit"
                    className="sm:w-full w-[300px] h-9 text-[13px] font-medium mt-2"
                    disabled={isSubmitting || isGenerating}
                >
                    {isSubmitting || isGenerating ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-3.5 w-3.5 border-2 border-current border-r-transparent rounded-full animate-spin" />
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