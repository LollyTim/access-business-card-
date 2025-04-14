"use client";

import { useEffect } from "react";
import { AccessLogo } from "@/components/access-logo";
import { useCardStore } from "@/lib/store/card-store";
import { generateQRCodeUrl } from "@/lib/qr-code-api";
import logo from "../../public/access.png"

export function CardPreview() {
    const { formData, username, setUsername, qrCodeUrl, setQrCodeUrl } = useCardStore();

    useEffect(() => {
        if (!formData.email) return;

        try {
            // Extract username from email
            const atIndex = formData.email.indexOf("@");
            if (atIndex > 0) {
                const extractedUsername = formData.email.substring(0, atIndex).toLowerCase();
                setUsername(extractedUsername);

                // Generate QR code URL with Access Bank branding
                const qrData = `${process.env.NEXT_PUBLIC_APP_URL}/${extractedUsername}`;
                const url = generateQRCodeUrl({
                    data: qrData,
                    size: 360,
                    "config": {
                        "body": "pointed",
                        "eye": "frame14",
                        "eyeBall": "ball14",
                        "erf1": [],
                        "erf2": ["fh"],
                        "erf3": ["fv"],
                        "brf1": [],
                        "brf2": ["fh"],
                        "brf3": ["fv"],
                        "bodyColor": "#000000",
                        "bgColor": "#FFFFFF",
                        "eye1Color": "#000000",
                        "eye2Color": "#000000",
                        "eye3Color": "#000000",
                        "eyeBall1Color": "#000000",
                        "eyeBall2Color": "#000000",
                        "eyeBall3Color": "#000000",
                        "gradientOnEyes": false,
                        "logoMode": "clean",
                        "logo": "https://asset.brandfetch.io/idPXJmyni4/idSLulezX4.png",
                    },
                    file: "svg"
                });

                setQrCodeUrl(url);
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
            setQrCodeUrl("");
        }
    }, [formData.email, setUsername, setQrCodeUrl]);

    // Constants as per requirements
    const address = "Head Office: 14/15 Prince Alana Abiodun, Oniru Street, Oniru Estate, Victoria Island. Lagos, Nigeria";
    const website = "www.accessbankplc.com";

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            {/* Front of the card */}
            <div className="relative h-[368px] w-full max-w-[552px] overflow-hidden rounded-lg bg-white p-8 shadow-md">
                {/* Access Bank Logo */}
                <div className="z-50 w-full justify-end items-end flex">
                    <img src={"/access-logo.png"} width={200} alt="dgdggd" />
                </div>

                <div className="">
                    <h3 className="text-2xl font-bold text-[#FF5722]">{formData.fullName || "Your Name"}</h3>
                    <p className="text-lg font-medium text-black">{formData.position || "Your Position"}</p>

                    <div className="mt-6 text-base">
                        <p className="mb-1 w-[320px] font-semibold text-black">{address}</p>

                        <div className="flex items-start">
                            <span className="mr-2 font-bold text-[#FF5722]">M</span>
                            <span className="font-semibold">{formData.phone || "+234 XXX XXX XXXX"}</span>
                        </div>

                        <div className="flex items-start">
                            <span className="mr-2 font-bold text-[#FF5722]">E</span>
                            <span className="font-semibold">{formData.email || "your.email@accessbankplc.com"}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-[#FF5722]">{website}</span>
                    </div>
                </div>

                {/* QR Code */}
                <div className="absolute bottom-24 right-8 h-[160px] w-[160px] overflow-hidden rounded-md">
                    {qrCodeUrl ? (
                        <img
                            src={qrCodeUrl}
                            alt={`QR Code for ${username || 'user'}`}
                            className="h-full w-full object-contain p-2"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            QR Code
                        </div>
                    )}
                </div>
            </div>

            {/* Back of the card */}
            <div className="relative h-[368px] w-[550px] max-w-[550px] overflow-hidden rounded-lg bg-white shadow-md">
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
                <div
                    className="absolute bottom-8 right-12 text-[1.5rem] font-bold text-[#FF5722]"
                    style={{ fontFamily: "var(--font-helvetica-neue, Helvetica Neue, sans-serif)" }}
                >
                    more than banking
                </div>
            </div>
        </div>
    );
}