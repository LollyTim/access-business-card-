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
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Business Cards</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchBusinessCards}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                >
                    <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Downloads</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {businessCards.map((card) => (
                            <TableRow key={card.id}>
                                <TableCell className="font-medium">{card.fullName}</TableCell>
                                <TableCell>{card.position}</TableCell>
                                <TableCell>{card.email}</TableCell>
                                <TableCell>{card.phone}</TableCell>
                                <TableCell>{card.downloads}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link href={`/dashboard/${card.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link href={`/api/business-cards/pdf/${card.username}`}>
                                            <FileDown className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link href={`/api/business-cards/vcard/${card.username}`}>
                                            <Download className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {businessCards.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No business cards found. Create your first one above!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 