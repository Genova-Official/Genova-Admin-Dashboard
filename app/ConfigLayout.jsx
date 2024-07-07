"use client";
import React from "react";
import { SWRProvider } from "./swr-provider";
import { ToastContainer } from "react-toastify";
import init from "@/config/config";
import "react-toastify/dist/ReactToastify.css";

export default function ConfigLayout({ children }) {
  init();

  return (
    <SWRProvider>
      <ToastContainer  />
      {children}
    </SWRProvider>
  );
}
