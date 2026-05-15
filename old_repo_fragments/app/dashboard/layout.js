"use client";
import React from "react";
import SideNav from "@/components/layout/dashboard/SideNav";
import TopNav from "@/components/layout/dashboard/TopNav";
import useCookies from "@/hooks/useCookies";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children, ...props }) {
  const { getCookie } = useCookies();
  const gen_token = getCookie("gen_token");
  const router = useRouter();

  if (!gen_token) {
    return router.push("/");
  }

  return (
    <main className="relative min-w-[20em] max-w-full h-screen mx-auto flex flex-col overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <SideNav className="flex-none shadow-lg w-full md:w-64 p-4" />
        <div
          className="flex-grow h-full md:px-8 px-2 overflow-x-hidden"
          {...props}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
