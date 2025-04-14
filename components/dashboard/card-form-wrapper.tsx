"use client";

import { CardForm } from "./card-form";
import { CardPreview } from "./card-preview";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Card } from "@/components/ui/card";

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

            router.refresh();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="space-y-4 sm:space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Business Card Form</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Create your professional business card</p>
                </div>

                <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10">
                    <div className="order-2 lg:order-1">
                        <div className="sticky top-4">
                            <CardPreview />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <CardForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                    </div>
                </div>
            </div>
        </Card>
    );
}