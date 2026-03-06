import React from "react";
import BillingPlans from "@/components/BillingPlans";
import DashboardLayout from "@/app/app/dashboard/layout";

export default function BillingPage() {
  return (
    <DashboardLayout>
      <BillingPlans />
    </DashboardLayout>
  );
}
