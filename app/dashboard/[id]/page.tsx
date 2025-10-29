import { notFound } from "next/navigation";
import { getBusinessCard } from "@/app/actions/get-business-card";
import { BusinessCardDisplay } from "@/components/business-card/business-card-display";

interface BusinessCardPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function BusinessCardPage({ params }: BusinessCardPageProps) {
    const { id } = await params;
    const businessCard = await getBusinessCard(id);

    if (!businessCard) {
        notFound();
    }

    return <BusinessCardDisplay businessCard={businessCard} />;
} 