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
        <div className="rounded-lg bg-gray-50 p-8">
            <h2 className="mb-1 text-center text-2xl font-bold">Business Card Form</h2>
            <p className="mb-8 text-center text-sm text-gray-500">Create a new card form</p>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Live Preview Card */}
                <CardPreview />
                {/* Form Fields */}
                <CardForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
} 