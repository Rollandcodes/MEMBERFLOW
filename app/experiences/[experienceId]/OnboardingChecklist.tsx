"use client";

import { useState } from "react";
import { CheckCircle2, Circle, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

const CHECKLIST_ITEMS = [
    {
        id: "joined",
        label: "Welcome! You've joined the community",
        description: "You're officially part of the crew.",
        defaultChecked: true,
    },
    {
        id: "dm",
        label: "Check your DMs for a welcome message",
        description: "We sent you a welcome message — give it a read!",
        defaultChecked: false,
    },
    {
        id: "introduce",
        label: "Introduce yourself in the community",
        description: "Say hi to fellow members and make connections.",
        defaultChecked: false,
    },
    {
        id: "profile",
        label: "Complete your profile",
        description: "Add a bio and photo so others can recognize you.",
        defaultChecked: false,
    },
];

interface OnboardingChecklistProps {
    userId: string | null;
    experienceId: string;
}

export default function OnboardingChecklist({
    userId,
    experienceId,
}: OnboardingChecklistProps) {
    const [checked, setChecked] = useState<Record<string, boolean>>(
        Object.fromEntries(
            CHECKLIST_ITEMS.map((item) => [item.id, item.defaultChecked])
        )
    );

    const allChecked = CHECKLIST_ITEMS.every((item) => checked[item.id]);
    const completedCount = CHECKLIST_ITEMS.filter((item) => checked[item.id]).length;
    const progressPct = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

    const toggle = (id: string) => {
        // First item (joined) can't be unchecked
        if (id === "joined") return;
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="px-8 py-6">
            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Progress
                    </span>
                    <span className="text-xs font-black text-indigo-600">
                        {completedCount}/{CHECKLIST_ITEMS.length} complete
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* All-done banner */}
            {allChecked && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl px-5 py-4 mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <PartyPopper className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                    <div>
                        <div className="text-sm font-black text-indigo-900">
                            You&apos;re all set! 🎉
                        </div>
                        <div className="text-xs text-indigo-600">
                            You&apos;ve completed every onboarding step. Welcome to the community!
                        </div>
                    </div>
                </div>
            )}

            {/* Checklist items */}
            <ul className="space-y-2.5 mb-6">
                {CHECKLIST_ITEMS.map((item) => {
                    const isChecked = checked[item.id];
                    const isLocked = item.id === "joined";

                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => toggle(item.id)}
                                disabled={isLocked}
                                className={cn(
                                    "w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-200",
                                    isChecked
                                        ? "bg-indigo-50/70 border border-indigo-100"
                                        : "bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30",
                                    isLocked && "cursor-default"
                                )}
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                    {isChecked ? (
                                        <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-slate-300" />
                                    )}
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            "text-sm font-semibold leading-tight",
                                            isChecked ? "text-indigo-900 line-through decoration-indigo-300" : "text-slate-800"
                                        )}
                                    >
                                        {item.label}
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs mt-0.5",
                                            isChecked ? "text-indigo-400" : "text-slate-400"
                                        )}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Debug info (hidden in production) */}
            {process.env.NODE_ENV === "development" && (userId || experienceId) && (
                <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-300 font-mono space-y-0.5">
                    {experienceId && <div>experienceId: {experienceId}</div>}
                    {userId && <div>userId: {userId}</div>}
                </div>
            )}
        </div>
    );
}
