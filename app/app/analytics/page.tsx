import React from "react";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import DashboardLayout from "@/app/dashboard/layout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsCharts />
    </DashboardLayout>
  );
}
