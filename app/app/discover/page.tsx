import React from "react";
import { Compass, Zap, Star, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const discoveryItems = [
    {
        title: "Welcome DM Sequence",
        description: "Automatically welcome every new member with a personalized message the moment they join.",
        icon: Zap,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        badge: "Most Popular",
        badgeColor: "bg-indigo-100 text-indigo-700",
    },
    {
        title: "7-Day Onboarding Series",
        description: "A 7-step drip sequence that guides new members through your community features over their first week.",
        icon: Star,
        color: "text-amber-600",
        bg: "bg-amber-50",
        badge: "Recommended",
        badgeColor: "bg-amber-100 text-amber-700",
    },
    {
        title: "Churn Prevention Alert",
        description: "Identify and re-engage members who haven't been active in 14 days before they cancel.",
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50",
        badge: "New",
        badgeColor: "bg-green-100 text-green-700",
    },
    {
        title: "Win-back Campaign",
        description: "Automatically reach out to inactive members with a special offer to re-activate their membership.",
        icon: Users,
        color: "text-rose-600",
        bg: "bg-rose-50",
        badge: "Pro",
        badgeColor: "bg-rose-100 text-rose-700",
    },
];

export default function DiscoverPage() {
    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Compass className="h-8 w-8 text-indigo-600" />
                    Discover Automations
                </h1>
                <p className="text-slate-500 mt-2">
                    Pre-built automation templates to supercharge your community growth.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {discoveryItems.map((item) => (
                    <Card
                        key={item.title}
                        className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    >
                        <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className={`${item.bg} p-3 rounded-2xl`}>
                                    <item.icon className={`h-6 w-6 ${item.color}`} />
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.badgeColor}`}>
                                    {item.badge}
                                </span>
                            </div>
                            <CardTitle className="text-lg font-black text-slate-900 mt-4">
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">{item.description}</p>
                            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-colors shadow-lg shadow-indigo-100">
                                Use This Template
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
