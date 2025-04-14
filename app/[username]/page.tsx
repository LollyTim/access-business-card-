import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Metadata } from "next";

interface PageProps {
    params: {
        username: string;
    };
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const businessCard = await getBusinessCard(params.username);
    return {
        title: `${businessCard.fullName} - Access Bank Business Card`,
        description: `${businessCard.position} at Access Bank`,
    };
}

async function getBusinessCard(username: string) {
    const businessCard = await prisma.businessCard.findUnique({
        where: { username }
    });

    if (!businessCard) {
        notFound();
    }

    return businessCard;
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
}

export default async function ProfilePage({ params }: PageProps) {
    const businessCard = await getBusinessCard(params.username);
    const initials = getInitials(businessCard.fullName);

    return (
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
            <div className="flex flex-col items-center">

                <div className="flex justify-center mb-24">
                    <img
                        src="/access-logo.png"
                        alt="Access Bank"
                        className="h-12 w-44"
                    />
                </div>
                <div className="relative w-full max-w-sm bg-white rounded-xl shadow-md">
                    {/* Header with Access Logo */}
                    <div className="p-6 pt-8 mt-10">


                        {/* Profile Avatar - Positioned to overlap the top edge */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Avatar className="h-32 w-32 border-8 border-gray-100 shadow-sm">
                                {businessCard.imageUrl ? (
                                    <AvatarImage
                                        src={businessCard.imageUrl}
                                        alt={businessCard.fullName}
                                        className="object-cover"
                                    />
                                ) : (
                                    <AvatarFallback className="bg-[#FF5722] text-white text-4xl">
                                        {initials}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </div>

                        {/* Profile Name and Title */}
                        <div className="flex flex-col items-center mb-4">
                            <h1 className="text-[#FF5722] text-xl font-semibold text-center">
                                {businessCard.fullName}
                            </h1>
                            <p className="text-zinc-700 text-lg text-center">
                                {businessCard.position}
                            </p>
                        </div>

                        {/* Contact Details - Each with individual backgrounds */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-start gap-3 bg-zinc-100 p-3 rounded-lg">
                                <MapPin className="h-6 w-6 text-[#FF5722] mt-1 flex-shrink-0" />
                                <div>

                                    <p className="text-gray-600 text-sm">
                                        <span className="text-black text-sm font-semibold">Head Office:</span> 14/15 Prince Alaba Abiodun, Oniru Street, Oniru Estate, Victoria Island, Lagos, Nigeria
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-zinc-100 p-3 rounded-lg">
                                <Phone className="h-6 w-6 text-[#FF5722] flex-shrink-0" />
                                <div className="flex flex-row gap-1">
                                    <p className="text-black text-sm font-semibold">Mobile:</p>
                                    <a href={`tel:${businessCard.phone}`} className="text-gray-600 text-sm">
                                        {businessCard.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-zinc-100 p-3 rounded-lg">
                                <Mail className="h-6 w-6 text-[#FF5722] flex-shrink-0" />
                                <div>
                                    <p className="text-black text-sm font-semibold">Email Address:</p>
                                    <a href={`mailto:${businessCard.email}`} className="text-gray-600 text-sm">
                                        {businessCard.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Save Contact Button */}
                        <Button
                            className="w-[70%] mx-auto py-2 px-8 mt-6 bg-black/90 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2"
                            asChild
                        >
                            <a href={`/api/business-cards/vcard/${businessCard.username}`} download>
                                <UserPlus className="h-4 w-4" />
                                <span>Save contact</span>
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Website Link - Below the card */}
                <div className="mt-3">
                    <a
                        href="https://www.accessbankplc.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF5722] text-sm hover:underline"
                    >
                        www.accessbankplc.com
                    </a>
                </div>
            </div>
        </div>
    );
}