'use client';

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileDown, RotateCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { BusinessCard } from "@/types/business-card";
import { generateBusinessCardPDF } from "@/lib/pdf-generator";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 5;

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

export function BusinessCardsTable() {
    const [businessCards, setBusinessCards] = useState<BusinessCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingCard, setDeletingCard] = useState<string | null>(null);
    const { toast: uiToast } = useToast();

    const totalPages = Math.ceil(businessCards.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCards = businessCards.slice(startIndex, endIndex);

    const fetchBusinessCards = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/business-cards');
            if (!response.ok) {
                throw new Error('Failed to fetch business cards');
            }
            const data = await response.json();
            setBusinessCards(data);
            setCurrentPage(1); // Reset to first page when fetching new data
        } catch (error) {
            console.error('Error fetching business cards:', error);
            uiToast({
                title: "Error",
                description: "Failed to fetch business cards. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinessCards();
    }, []);

    const handleDownloadPDF = async (card: BusinessCard) => {
        try {
            setGeneratingPDF(card.id);
            const qrCodeUrl = generateQRCodeUrl(card);
            const pdfBlob = await generateBusinessCardPDF(card, qrCodeUrl);

            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${card.fullName.replace(/\s+/g, '-').toLowerCase()}-business-card.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('PDF generated successfully');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setGeneratingPDF(null);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        try {
            setDeletingCard(cardId);
            const response = await fetch(`/api/business-cards?id=${cardId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete business card');
            }

            toast.success('Business card deleted successfully');
            await fetchBusinessCards(); // Refresh the list
        } catch (error) {
            console.error('Error deleting business card:', error);
            toast.error('Failed to delete business card');
        } finally {
            setDeletingCard(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                <h2 className="text-xl font-semibold">Your Business Cards</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchBusinessCards}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                    <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[120px]">Name</TableHead>
                            <TableHead className="min-w-[120px]">Position</TableHead>
                            <TableHead className="min-w-[180px]">Email</TableHead>
                            <TableHead className="min-w-[120px]">Phone</TableHead>
                            <TableHead className="min-w-[180px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentCards.map((card) => (
                            <TableRow key={card.id}>
                                <TableCell className="font-medium">{card.fullName}</TableCell>
                                <TableCell>{card.position}</TableCell>
                                <TableCell className="break-all">{card.email}</TableCell>
                                <TableCell>{card.phone}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="h-8 w-8 p-0"
                                        >
                                            <Link href={`/dashboard/${card.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleDownloadPDF(card)}
                                            disabled={generatingPDF === card.id}
                                        >
                                            <FileDown className={`h-4 w-4 ${generatingPDF === card.id ? 'animate-spin' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="h-8 w-8 p-0"
                                        >
                                            <Link href={`/api/business-cards/vcard/${card.username}`}>
                                                <Download className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Business Card</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this business card? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        onClick={() => handleDeleteCard(card.id)}
                                                        disabled={deletingCard === card.id}
                                                    >
                                                        {deletingCard === card.id ? (
                                                            <span className="flex items-center gap-2">
                                                                <span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                                                                Deleting...
                                                            </span>
                                                        ) : (
                                                            "Delete"
                                                        )}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {businessCards.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No business cards found. Create your first one above!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
                {currentCards.map((card) => (
                    <div key={card.id} className="rounded-lg border bg-card p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h3 className="font-medium">{card.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{card.position}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-8 w-8 p-0"
                                >
                                    <Link href={`/dashboard/${card.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleDownloadPDF(card)}
                                    disabled={generatingPDF === card.id}
                                >
                                    <FileDown className={`h-4 w-4 ${generatingPDF === card.id ? 'animate-spin' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-8 w-8 p-0"
                                >
                                    <Link href={`/api/business-cards/vcard/${card.username}`}>
                                        <Download className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Business Card</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this business card? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={() => handleDeleteCard(card.id)}
                                                disabled={deletingCard === card.id}
                                            >
                                                {deletingCard === card.id ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                                                        Deleting...
                                                    </span>
                                                ) : (
                                                    "Delete"
                                                )}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm break-all">
                                <span className="text-muted-foreground">Email:</span> {card.email}
                            </p>
                            <p className="text-sm">
                                <span className="text-muted-foreground">Phone:</span> {card.phone}
                            </p>
                        </div>
                    </div>
                ))}
                {businessCards.length === 0 && !isLoading && (
                    <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
                        No business cards found. Create your first one above!
                    </div>
                )}
            </div>

            {/* Pagination */}
            {businessCards.length > 0 && (
                <Pagination className="justify-center">
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                                <span>Previous</span>
                            </Button>
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <span>Next</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
} 