import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-700">Loading your workspace...</h2>
            <p className="text-sm text-slate-500">Fetching your community automations and members</p>
        </div>
    );
}
