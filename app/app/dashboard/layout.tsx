import React from "react";
import NavigationSidebar from "../../../components/NavigationSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <NavigationSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
