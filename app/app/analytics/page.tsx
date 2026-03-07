import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AnalyticsCharts from "@/components/AnalyticsCharts";

type PerformancePoint = {
  name: string;
  sent: number;
  failed: number;
};

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default async function AnalyticsPage() {
  const cookieStore = cookies();
  const companyId = cookieStore.get("memberflow_company_id")?.value;

  if (!companyId) {
    redirect("/");
  }

  const now = new Date();
  const months: Date[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push(d);
  }

  const firstMonthStart = months[0];

  const [members, campaigns, logs] = await Promise.all([
    prisma.member.findMany({ where: { companyId }, select: { status: true, joinedAt: true } }),
    prisma.campaign.findMany({ where: { companyId }, select: { isActive: true } }),
    prisma.messageLog.findMany({
      where: {
        campaign: { companyId },
        createdAt: { gte: firstMonthStart },
      },
      select: { status: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "active").length;
  const activeCampaigns = campaigns.filter((c) => c.isActive).length;
  const totalLogs = logs.length;
  const totalSent = logs.filter((log) => log.status === "sent").length;
  const totalFailed = logs.filter((log) => log.status === "failed").length;

  const deliveryRate = totalLogs > 0 ? (totalSent / totalLogs) * 100 : 0;
  const retentionRate = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0;

  const sentByMonth = new Map<string, number>();
  const failedByMonth = new Map<string, number>();

  for (const log of logs) {
    const key = monthKey(log.createdAt);
    if (log.status === "sent") {
      sentByMonth.set(key, (sentByMonth.get(key) || 0) + 1);
    }
    if (log.status === "failed") {
      failedByMonth.set(key, (failedByMonth.get(key) || 0) + 1);
    }
  }

  const performanceData: PerformancePoint[] = months.map((date) => {
    const key = monthKey(date);
    return {
      name: monthLabel(date),
      sent: sentByMonth.get(key) || 0,
      failed: failedByMonth.get(key) || 0,
    };
  });

  const sortedJoinedDates = members
    .map((m) => m.joinedAt)
    .sort((a, b) => b.getTime() - a.getTime());
  const latestJoined = sortedJoinedDates[0] || now;
  const lastActiveDate = latestJoined.toISOString().slice(0, 10);

  return (
    <AnalyticsCharts
      stats={{
        totalSent,
        totalMembers,
        activeCampaigns,
        retentionRate,
        deliveryRate,
        totalFailed,
      }}
      performanceData={performanceData}
      churnDefaults={{
        lastActiveDate,
        messageOpenRate: Number(deliveryRate.toFixed(1)),
      }}
    />
  );
}
