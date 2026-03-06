import React from "react";
import AnalyticsCharts from "../../../components/AnalyticsCharts";
import DashboardLayout from "../dashboard/layout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsCharts />
    </DashboardLayout>
  );
}
