import React from "react";

// The sidebar is already provided by app/app/layout.tsx
// This layout just passes through children for the /app/dashboard route
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
