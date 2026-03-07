"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard Error:", error);
    }, [error]);

    return (
        <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-6 text-center px-4">
            <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    We encountered an error loading your dashboard data. Our team has been notified.
                </p>
            </div>
            <Button onClick={() => reset()} className="bg-indigo-600 hover:bg-indigo-700">
                Try again
            </Button>
        </div>
    );
}
