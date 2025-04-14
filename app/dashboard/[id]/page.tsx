import { notFound } from "next/navigation";
import { getBusinessCard } from "@/app/actions/get-business-card";
import { BusinessCardDisplay } from "@/components/business-card/business-card-display";

interface BusinessCardPageProps {
    params: {
        id: string;
    };
}

export default async function BusinessCardPage({ params }: BusinessCardPageProps) {
    const businessCard = await getBusinessCard(params.id);

    if (!businessCard) {
        notFound();
    }

    return <BusinessCardDisplay businessCard={businessCard} />;
} 