"use client";
import React from "react";
import { SWRProvider } from "./swr-provider";
import { ToastContainer } from "react-toastify";
export default function ConfigLayout({ children }) {
  return (
    <SWRProvider>
      <ToastContainer className="mst" />
      {children}
    </SWRProvider>
  );
}
