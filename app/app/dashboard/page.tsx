import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send, MessageSquare, BarChart3, Sparkles, Globe, ShieldCheck } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import OnboardingWizard from "@/components/OnboardingWizard";
import { AlertTriangle } from "lucide-react";

// Converting to a Server Component to hit Prisma directly without API routes!
export default async function DashboardPage() {
  const cookieStore = cookies();
  const companyId = cookieStore.get("memberflow_company_id")?.value;

  if (!companyId) {
    redirect("/"); // Middleware also catches this, but adding for type safety
  }

  // 1. Fetch Company Data
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    // Session is invalid/stale
    redirect("/");
  }

  // 2. Fetch Aggregated Stats
  const [membersCount, activeCampaignsCount, sentMessagesCount, messageLogs] = await Promise.all([
    prisma.member.count({ where: { companyId } }),
    prisma.campaign.count({ where: { companyId, isActive: true } }),
    prisma.messageLog.count({
      where: {
        campaign: { companyId },
        status: "sent",
      },
    }),
    prisma.messageLog.findMany({
      where: { campaign: { companyId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        member: true,
        campaign: true,
      },
    }),
  ]);

  // Fake engagement rate for demo (e.g. tracking link clicks inside DMs later)
  const engagementRate = sentMessagesCount > 0 ? "18.5%" : "0%";

  const stats = [
    { name: "Total Members", value: membersCount.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50/50" },
    { name: "Active Campaigns", value: activeCampaignsCount.toString(), icon: Send, color: "text-indigo-600", bg: "bg-indigo-50/50" },
    { name: "Messages Sent", value: sentMessagesCount.toLocaleString(), icon: MessageSquare, color: "text-green-600", bg: "bg-green-50/50" },
    { name: "Engagement Rate", value: engagementRate, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50/50" },
  ];

  const communityName = company.name || "Your Community";

  // Plan Enforcement Logic
  const isFree = company.plan === "free";
  const isGrowth = company.plan === "growth";

  const automationsLimit = isFree ? 1 : isGrowth ? 10 : Infinity;
  const membersLimit = isFree ? 50 : isGrowth ? 500 : Infinity;

  const hitAutomationLimit = activeCampaignsCount >= automationsLimit;
  const hitMembersLimit = membersCount >= membersLimit;
  const hitAnyLimit = isFree && (hitAutomationLimit || hitMembersLimit);

  return (
    <div className="space-y-8 pb-12 relative">
      {activeCampaignsCount === 0 && <OnboardingWizard companyName={communityName} />}

      {hitAnyLimit && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-900 p-4 rounded-r-lg flex items-center justify-between mb-8 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-3 text-amber-600" />
            <div>
              <h3 className="font-bold text-amber-900">You've reached your Free plan limit.</h3>
              <p className="text-sm font-medium opacity-90">Upgrade to Growth to continue adding automations and members.</p>
            </div>
          </div>
          <a
            href="https://whop.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            Upgrade Now
          </a>
        </div>
      )}

      <DashboardHero communityName={communityName} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                {stat.name}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-xl`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <p className="text-xs text-green-500 mt-2 flex items-center font-bold">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>Growth active</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 shadow-sm border-slate-100 rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                <p className="text-sm text-slate-500">Live monitoring from {communityName}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {messageLogs.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {messageLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        {log.member.username ? log.member.username.substring(0, 2).toUpperCase() : "M"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {log.campaign.name} sent to {log.member.username}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center mt-1">
                          <Globe className="h-3 w-3 mr-1" />
                          Whop ID: {log.member.whopMemberId}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {log.status === "sent" ? (
                        <span className="h-2 w-2 rounded-full bg-green-500" title="Sent Successfully" />
                      ) : log.status === "failed" ? (
                        <span className="h-2 w-2 rounded-full bg-red-500" title="Failed" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" title="Pending" />
                      )}
                      <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl group-hover:bg-indigo-100">
                        {log.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No activity yet</h3>
                <p className="text-sm text-slate-500 mb-6">Waiting for members to join and trigger automations.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status / Upsell */}
        <div className="space-y-8">
          <Card className="shadow-lg border-none bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-1 overflow-hidden">
            <div className="bg-slate-900/50 backdrop-blur-md rounded-[calc(1.5rem-4px)] p-6 h-full border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <ShieldCheck className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg">System Status</h3>
                  <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Whop Connection</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="h-12 w-12 rounded-xl shadow-lg bg-indigo-600 flex items-center justify-center font-bold">
                    {company.name ? company.name.substring(0, 1).toUpperCase() : "C"}
                  </div>
                  <div>
                    <div className="font-bold text-indigo-100">{company.name}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">{company.whopUserId}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-indigo-400 uppercase font-bold">Plan</div>
                    <div className="text-sm font-bold capitalize">{company.plan}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-indigo-400 uppercase font-bold">API Status</div>
                    <div className="text-sm font-bold text-green-400 flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
                      Listening
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm border-slate-100 rounded-3xl p-6 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="font-black text-slate-900 mb-2">Automate more.</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">Unlock advanced AI sequences and custom webhook triggers with Pro.</p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold rounded-2xl py-6 shadow-indigo-200 shadow-xl">
              Upgrade Now
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
