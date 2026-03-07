"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Zap, Star, TrendingUp, Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const discoveryItems = [
    {
        id: "welcome-dm",
        title: "Welcome DM Sequence",
        description: "Automatically welcome every new member with a personalized message the moment they join.",
        icon: Zap,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        badge: "Most Popular",
        badgeColor: "bg-indigo-100 text-indigo-700",
        payload: {
            name: "Welcome DM Sequence",
            messageText: "Hey {{first_name}}! Welcome to the community. Reply if you need anything to get started.",
            triggerType: "membership.activated",
            delayHours: 0,
            isActive: true,
        },
    },
    {
        id: "seven-day-onboarding",
        title: "7-Day Onboarding Series",
        description: "A 7-step drip sequence that guides new members through your community features over their first week.",
        icon: Star,
        color: "text-amber-600",
        bg: "bg-amber-50",
        badge: "Recommended",
        badgeColor: "bg-amber-100 text-amber-700",
        payload: {
            name: "7-Day Onboarding Series",
            messageText: "Welcome to week one! Over the next 7 days, we'll guide you through the essentials so you get fast wins.",
            triggerType: "membership.activated",
            delayHours: 24,
            isActive: true,
        },
    },
    {
        id: "churn-prevention",
        title: "Churn Prevention Alert",
        description: "Identify and re-engage members who haven't been active in 14 days before they cancel.",
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50",
        badge: "New",
        badgeColor: "bg-green-100 text-green-700",
        payload: {
            name: "Churn Prevention Alert",
            messageText: "Hey {{first_name}}, we noticed you have been quiet lately. Want a personalized plan to get momentum back this week?",
            triggerType: "member.inactive",
            delayHours: 336,
            isActive: true,
        },
    },
    {
        id: "win-back",
        title: "Win-back Campaign",
        description: "Automatically reach out to inactive members with a special offer to re-activate their membership.",
        icon: Users,
        color: "text-rose-600",
        bg: "bg-rose-50",
        badge: "Pro",
        badgeColor: "bg-rose-100 text-rose-700",
        payload: {
            name: "Win-back Campaign",
            messageText: "We'd love to have you back, {{first_name}}. Rejoin this week and we will unlock a bonus resource just for returning members.",
            triggerType: "member.inactive",
            delayHours: 720,
            isActive: true,
        },
    },
];

export default function DiscoverPage() {
    const router = useRouter();
    const [creatingId, setCreatingId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleUseTemplate = async (item: (typeof discoveryItems)[number]) => {
        setCreatingId(item.id);
        setError("");

        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item.payload),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data?.campaign) {
                setError(data?.error || "Failed to apply template. Please try again.");
                setCreatingId(null);
                return;
            }

            router.push(
                `/app/campaigns?created=1&template=${encodeURIComponent(item.title)}&campaignId=${encodeURIComponent(data.campaign.id)}`
            );
        } catch {
            setError("Network error while applying template.");
            setCreatingId(null);
        }
    };

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
                {error ? <p className="text-sm font-semibold text-red-600 mt-3">{error}</p> : null}
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
                            <Button
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-colors shadow-lg shadow-indigo-100"
                                onClick={() => handleUseTemplate(item)}
                                disabled={creatingId === item.id}
                            >
                                {creatingId === item.id ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Applying Template...
                                    </>
                                ) : (
                                    "Use This Template"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
