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
import { Button } from "@/components/ui/button";
import { Download, Eye, FileDown, RotateCw } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { BusinessCard } from "@/types/business-card";

export function BusinessCardsTable() {
    const [businessCards, setBusinessCards] = useState<BusinessCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchBusinessCards = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/business-cards');
            if (!response.ok) {
                throw new Error('Failed to fetch business cards');
            }
            const data = await response.json();
            setBusinessCards(data);
        } catch (error) {
            console.error('Error fetching business cards:', error);
            toast({
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
            <div className="hidden sm:block rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[120px]">Name</TableHead>
                            <TableHead className="min-w-[120px]">Position</TableHead>
                            <TableHead className="min-w-[180px]">Email</TableHead>
                            <TableHead className="min-w-[120px]">Phone</TableHead>
                            <TableHead className="min-w-[140px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {businessCards.map((card) => (
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
                                            asChild
                                            className="h-8 w-8 p-0"
                                        >
                                            <Link href={`/api/business-cards/pdf/${card.username}`}>
                                                <FileDown className="h-4 w-4" />
                                            </Link>
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
                {businessCards.map((card) => (
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
                                    asChild
                                    className="h-8 w-8 p-0"
                                >
                                    <Link href={`/api/business-cards/pdf/${card.username}`}>
                                        <FileDown className="h-4 w-4" />
                                    </Link>
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
        </div>
    );
} 