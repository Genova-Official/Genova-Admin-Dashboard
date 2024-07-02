"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/reusables/table/Table";
import Typography from "@/components/reusables/typography/Typography";
import { BiExport } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import { data } from "@/lib/constants/customersData";

export default function Customers() {
  const router = useRouter();


  const columns = [
    
    {
      title: "S/N",
      key: "sn",
      render: (data, index) => <span>{index + 1}</span>,
    },
    { title: "Name", key: "name", render: (data) => <span>{data.name}</span> },
    {
      title: "Email",
      key: "email",
      render: (data) => <span>{data.email}</span>,
    },
    {
      title: "Phone Number",
      key: "phone",
      render: (data) => <span>{data.phone}</span>,
    },
    { title: "BVN", key: "bvn", render: (data) => <span>{data.bvn}</span> },
    {
      title: "Status",
      key: "status",
      render: (data) => (
        <span
          className={`py-2 px-4 rounded-full border ${
            data.status === "Active"
              ? "bg-green/30 border-[#4BB543] text-green"
              : data.status === "Failed"
              ? "bg-[#FF9494]/30 border-[#FF9494] text-red"
              : "bg-[#F7CB73]/20 border-[#F7CB73] text-[#F7CB73]"
          }`}
        >
          {data.status}
        </span>
      ),
    },
  ];


  return (
    <section className="p-4">
      <div className="flex justify-between items-center py-8">
        <Typography size="xl" variant="h2" className="text-accent">
          All Customers
        </Typography>
        <div className="flex items-center gap-3">
          <div className="export px-4 text-accent text-lg flex items-center gap-2 border border-gray-500 rounded-lg p-3">
            <BiExport />
            <Typography>Export</Typography>
          </div>
          <div className="export px-4 text-accent text-lg flex items-center gap-2 border border-gray-500 rounded-lg p-3">
            <FaFilter />
            <Typography>Filter</Typography>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={data}
        isGray={false}
        onRowClick={(rowData) => {
          if (rowData?.id) {
            router.push(`/dashboard/customer/${rowData?.id}`);
          } else {
            console.error('ID not found in row data')
          }
        }}      />
    </section>
  );
}
