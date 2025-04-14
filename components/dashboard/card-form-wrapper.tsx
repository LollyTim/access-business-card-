"use client";

import { CardForm } from "./card-form";
import { CardPreview } from "./card-preview";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface BusinessCardFormData {
    fullName: string;
    position: string;
    phone: string;
    email: string;
    image: string | null;
}

export function CardFormWrapper() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: BusinessCardFormData) => {
        try {
            setIsSubmitting(true);
            const response = await fetch("/api/business-cards", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Failed to create business card");
            }

            toast({
                title: "Success!",
                description: "Your business card has been created.",
            });

            // Refresh the table data
            router.refresh();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive",
            });
            throw error; // Re-throw to be handled by the form component
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-lg bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            <h2 className="mb-1 text-center text-lg sm:text-xl md:text-2xl font-bold">Business Card Form</h2>
            <p className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 text-center text-xs sm:text-sm text-gray-500">Create a new card form</p>

            <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10">
                {/* Live Preview Card */}
                <div className="order-2 lg:order-1 flex justify-center items-start">
                    <div className="w-full max-w-md">
                        <CardPreview />
                    </div>
                </div>
                {/* Form Fields */}
                <div className="order-1 lg:order-2">
                    <CardForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
}