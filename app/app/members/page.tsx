import React from "react";
import MemberTable from "@/components/MemberTable";
import DashboardLayout from "@/app/dashboard/layout";

export default function MembersPage() {
  return (
    <DashboardLayout>
      <MemberTable />
    </DashboardLayout>
  );
}
