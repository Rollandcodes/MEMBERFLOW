import React from "react";
import CampaignBuilder from "../../../components/CampaignBuilder";
import DashboardLayout from "../dashboard/layout";

export default function CampaignsPage() {
  return (
    <DashboardLayout>
      <CampaignBuilder />
    </DashboardLayout>
  );
}
