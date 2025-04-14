import { prisma } from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileDown } from "lucide-react";
import Link from "next/link";

export async function BusinessCardsTable() {
    const businessCards = await prisma.businessCard.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
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
                    {businessCards.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No business cards found. Create your first one above!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
} 