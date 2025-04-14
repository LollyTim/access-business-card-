import { CardFormWrapper } from "@/components/dashboard/card-form-wrapper";
import { BusinessCardsTable } from "@/components/dashboard/business-cards-table";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default async function DashboardPage() {
    return (
        <div className="min-h-screen bg-white px-4 py-6 sm:p-6 md:p-8">
            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-500">Manage your business cards</p>
                </div>

                <CardFormWrapper />

                <div className="space-y-3 sm:space-y-4">
                    <Suspense fallback={<TableSkeleton />}>
                        <BusinessCardsTable />
                    </Suspense>
                </div>
            </div>
        </div>
    );
} 