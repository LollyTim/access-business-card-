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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="fullName" className="required">Full Name</Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Full name"
                        className="pl-10"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="position" className="required">Position</Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        id="position"
                        name="position"
                        placeholder="Your Position"
                        className="pl-10"
                        value={formData.position}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="required">Phone</Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="+234 000 0000 000"
                        className="pl-10"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="required">Email</Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="youremail@accessbankplc.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Profile Image (Optional)</Label>
                <div className="flex items-center gap-4">
                    <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="cursor-pointer"
                    />
                    {imagePreview && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={removeImage}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {imagePreview && (
                    <div className="mt-2">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>

            <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-700">
                <p className="font-medium">QR Code Information:</p>
                <p>• Generated using QR Code Monkey API</p>
                <p>• Links to: {process.env.NEXT_PUBLIC_APP_URL}/{username}</p>
                <p>• Includes Access Bank logo in center</p>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isGenerating}
            >
                {isSubmitting || isGenerating ? "Creating..." : "Generate Business Card"}
            </Button>
        </form>
    );
} 