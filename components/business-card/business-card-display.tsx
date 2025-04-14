'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileDown } from "lucide-react";
import { BusinessCard } from "@/types/business-card";
import { generateBusinessCardPDF } from "@/lib/pdf-generator";
import { useState } from "react";
import { toast } from "sonner";

function generateQRCodeUrl(businessCard: BusinessCard) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const cardUrl = `${baseUrl}/${businessCard.username}`;

    const config = {
        body: "pointed",
        eye: "frame14",
        eyeBall: "ball14",
        erf1: [],
        erf2: ["fh"],
        erf3: ["fv"],
        brf1: [],
        brf2: ["fh"],
        brf3: ["fv"],
        bodyColor: "#000000",
        bgColor: "#FFFFFF",
        eye1Color: "#000000",
        eye2Color: "#000000",
        eye3Color: "#000000",
        eyeBall1Color: "#000000",
        eyeBall2Color: "#000000",
        eyeBall3Color: "#000000",
        gradientOnEyes: false,
        logoMode: "clean",
        logo: "https://asset.brandfetch.io/idPXJmyni4/idSLulezX4.png",
    };

    const params = new URLSearchParams({
        data: cardUrl,
        size: "360",
        config: JSON.stringify(config),
        file: "svg"
    });

    return `/api/qr-code?${params.toString()}`;
}

interface BusinessCardDisplayProps {
    businessCard: BusinessCard;
}

export function BusinessCardDisplay({ businessCard }: BusinessCardDisplayProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const qrCodeUrl = generateQRCodeUrl(businessCard);
    const address = "Head Office: 14/15 Prince Alana Abiodun, Oniru Street, Oniru Estate, Victoria Island. Lagos, Nigeria";
    const website = "www.accessbankplc.com";

    const handleDownloadPDF = async () => {
        try {
            setIsGenerating(true);
            const pdfBlob = await generateBusinessCardPDF(businessCard, qrCodeUrl);

            // Create a download link
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${businessCard.fullName.replace(/\s+/g, '-').toLowerCase()}-business-card.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('PDF generated successfully');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-white p-4 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Business Card Details</h1>
                    <Link href="/dashboard">
                        <Button variant="outline" className="w-full sm:w-auto">Back to Dashboard</Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-6 sm:gap-8 rounded-lg bg-white p-4 sm:p-6 md:p-8 shadow-lg">
                    {/* Business Card Preview */}
                    <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
                        {/* Front of the card */}
                        <div className="relative w-full aspect-[1.53/1] max-w-[552px] overflow-hidden rounded-lg bg-white p-4 sm:p-6 md:p-8 shadow-md">
                            {/* Access Bank Logo */}
                            <div className="z-50 w-full justify-end items-end flex">
                                <img src="/access-logo.png" className="w-32 sm:w-40 md:w-48" alt="Access Bank Logo" />
                            </div>

                            <div className="mt-2 sm:mt-4">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FF5722]">{businessCard.fullName}</h3>
                                <p className="text-base sm:text-lg font-medium text-black">{businessCard.position}</p>

                                <div className="mt-4 sm:mt-6 text-sm sm:text-base">
                                    <p className="mb-1 max-w-[320px] font-semibold text-black">{address}</p>

                                    <div className="flex items-start">
                                        <span className="mr-2 font-bold text-[#FF5722]">M</span>
                                        <span className="font-semibold">{businessCard.phone}</span>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="mr-2 font-bold text-[#FF5722]">E</span>
                                        <span className="font-semibold break-all">{businessCard.email}</span>
                                    </div>
                                </div>

                                <div className="text-right mt-2 sm:mt-4">
                                    <span className="text-[#FF5722] text-sm sm:text-base">{website}</span>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] md:h-[160px] md:w-[160px] overflow-hidden rounded-md">
                                <img
                                    src={qrCodeUrl}
                                    alt={`QR Code for ${businessCard.username}`}
                                    className="h-full w-full object-contain p-2"
                                />
                            </div>
                        </div>

                        {/* Back of the card */}
                        <div className="relative w-full aspect-[1.53/1] max-w-[552px] overflow-hidden rounded-lg bg-white shadow-md">
                            {/* Blue section */}
                            <div
                                className="absolute bottom-0 left-0 top-0 w-[65%] bg-[#0039CB]"
                                style={{ clipPath: "polygon(0 0, 78% 0, 0 100%)" }}
                            ></div>

                            {/* Orange diagonal stripe */}
                            <div
                                className="absolute bottom-0 left-0 right-0 top-0 bg-[#FF5722]"
                                style={{
                                    clipPath: "polygon(50% 0, 60% 0, 10% 100%, 0 100%)",
                                    width: "100%"
                                }}
                            ></div>

                            {/* "more than banking" text */}
                            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 text-base sm:text-lg md:text-2xl font-bold text-[#FF5722]">
                                more than banking
                            </div>
                        </div>
                    </div>

                    {/* Download Options */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                        <Button
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base"
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                        >
                            <FileDown className="h-4 w-4" />
                            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
                        </Button>

                        <Link href={`/api/business-cards/vcard/${businessCard.username}`} className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-sm sm:text-base">
                                <FileDown className="h-4 w-4" />
                                Download vCard
                            </Button>
                        </Link>
                    </div>

                    {/* Card Details */}
                    <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:p-6 text-sm sm:text-base">
                        <h2 className="text-base sm:text-lg font-semibold">Card Information</h2>
                        <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                            <p><strong>Name:</strong> {businessCard.fullName}</p>
                            <p><strong>Position:</strong> {businessCard.position}</p>
                            <p><strong>Email:</strong> <span className="break-all">{businessCard.email}</span></p>
                            <p><strong>Phone:</strong> {businessCard.phone}</p>
                            <p><strong>Username:</strong> {businessCard.username}</p>
                            <p><strong>Created:</strong> {new Date(businessCard.createdAt).toLocaleDateString()}</p>
                            <p><strong>Last Updated:</strong> {new Date(businessCard.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 