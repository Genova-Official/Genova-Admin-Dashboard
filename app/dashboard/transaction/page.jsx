"use client"
import DashboardCard from "@/components/card/DashboardCard";
import Table from "@/components/reusables/table/Table";
import Typography from "@/components/reusables/typography/Typography";
import React from "react";
import { FaFilter, FaUser, } from "react-icons/fa";
import { BsBoxArrowInDownRight, BsBoxArrowUpRight, BsPersonFill } from "react-icons/bs";
import { columns, data } from "@/lib/constants/dashboardData";
import { BiExport } from "react-icons/bi";

export default function Transactions() {


  return (
    <section className="p-4 font-poppins">
      <div className="py-8">
        <Typography size="xl" variant="h2" className={"text-accent"}>
          Transactions
        </Typography>
        <div className="flex space-x-4 p-4">
        
          <DashboardCard
            icon={<BsBoxArrowInDownRight />}
            title="Total Inflow"
            value="11,000"
          />
          <DashboardCard
            icon={<BsBoxArrowUpRight />}
            title="Total Outflow"
            value="11,000"
          />
        </div>
      </div>
      <div className="flex justify-between items-center py-4">
        <Typography size="md" variant="body" className={"text-accent"}>
          Recent Customer Transactions
        </Typography>
        <div className="flex items-center gap-5">
        <div className="export px-4 text-accent text-lg flex items-center gap-2 border border-gray-500 rounded-lg p-3">
            <BiExport />
            <Typography>Export</Typography>
          </div>
          <button className="export px-4 text-accent text-lg flex items-center gap-2 border border-[#D5D5D5] rounded-lg p-3">
            <FaFilter />
            <Typography>Filter</Typography>
          </button>
          
        </div>
      </div>
      <Table columns={columns} data={data} isGray={false} />
    </section>
  );
}
