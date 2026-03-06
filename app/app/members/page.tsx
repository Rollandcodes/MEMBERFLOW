import React from "react";
import MemberTable from "../../../components/MemberTable";
import DashboardLayout from "../dashboard/layout";

export default function MembersPage() {
  return (
    <DashboardLayout>
      <MemberTable />
    </DashboardLayout>
  );
}
