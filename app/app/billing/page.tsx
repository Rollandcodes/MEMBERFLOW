import React from "react";
import BillingPlans from "../../../components/BillingPlans";
import DashboardLayout from "../dashboard/layout";

export default function BillingPage() {
  return (
    <DashboardLayout>
      <BillingPlans />
    </DashboardLayout>
  );
}
