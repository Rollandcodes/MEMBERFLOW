// dummy file to clear stale diagnostics
import React from "react";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import DashboardLayout from "@/app/app/dashboard/layout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsCharts />
    </DashboardLayout>
  );
}
