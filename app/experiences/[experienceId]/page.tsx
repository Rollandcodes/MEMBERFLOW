import { Suspense } from "react";
import OnboardingChecklist from "./OnboardingChecklist";
import prisma from "@/lib/prisma";
import { Zap } from "lucide-react";

interface ExperiencePageProps {
  params: { experienceId: string };
  searchParams: { userId?: string };
}

async function getCommunityName(experienceId: string): Promise<string | null> {
  try {
    const company = await prisma.company.findUnique({
      where: { whopUserId: experienceId },
      select: { name: true },
    });
    return company?.name ?? null;
  } catch {
    return null;
  }
}

export default async function ExperiencePage({
  params,
  searchParams,
}: ExperiencePageProps) {
  const { experienceId } = params;
  const userId = searchParams.userId ?? null;
  const communityName = await getCommunityName(experienceId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
                <Zap className="h-4.5 w-4.5 text-white" style={{ height: "18px", width: "18px" }} />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest">
                  Powered by MemberFlow
                </div>
                <div className="text-sm font-black text-slate-800 leading-tight">
                  {communityName ?? "Your Community"}
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-1">
              Welcome aboard! 👋
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Complete these steps to get the most out of {communityName ?? "the community"}.
            </p>
          </div>

          {/* Checklist — client component */}
          <Suspense fallback={<ChecklistSkeleton />}>
            <OnboardingChecklist userId={userId} experienceId={experienceId} />
          </Suspense>
        </div>

        {/* Subtle powered-by footer */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          Onboarding powered by{" "}
          <span className="font-semibold text-indigo-400">MemberFlow</span>
        </p>
      </div>
    </div>
  );
}

function ChecklistSkeleton() {
  return (
    <div className="px-8 py-6 space-y-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
          <div className="h-6 w-6 rounded-full bg-slate-200 flex-shrink-0" />
          <div className="h-4 bg-slate-200 rounded-full flex-1" />
        </div>
      ))}
    </div>
  );
}
