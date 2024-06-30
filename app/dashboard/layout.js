import React from 'react';
import SideNav from "@/components/layout/dashboard/SideNav";
import TopNav from "@/components/layout/dashboard/TopNav";

export default function DashboardLayout({ children, ...props }) {
  return (
    <div className="relative min-w-[80em] max-w-[120em] h-screen mx-auto flex flex-col overflow-hidden">
      <TopNav  />
      <div className="flex flex-1 overflow-hidden">
        <SideNav className="flex-none shadow-lg w-64 p-4" />
        <div className="flex-grow  h-full px-[4%] overflow-x-hidden" {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}
