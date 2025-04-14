import { CardFormWrapper } from "@/components/dashboard/card-form-wrapper";
import { BusinessCardsTable } from "@/components/dashboard/business-cards-table";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default async function DashboardPage() {
    return (
        <div className="min-h-screen bg-white p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-500">Manage your business cards</p>
                </div>

                <CardFormWrapper />

                <div>
                    <h2 className="text-xl font-semibold mb-4">Your Business Cards</h2>
                    <Suspense fallback={<TableSkeleton />}>
                        <BusinessCardsTable />
                    </Suspense>
                </div>
            </div>
        </div>
    );
} 