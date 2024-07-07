"use client"
import DashboardCard from "@/components/card/DashboardCard";
import Table from "@/components/reusables/table/Table";
import Typography from "@/components/reusables/typography/Typography";
import React from "react";
import { FaFilter, FaUser, } from "react-icons/fa";
import { BsBoxArrowInDownRight, BsBoxArrowUpRight, BsPersonFill } from "react-icons/bs";
import { columns, data } from "@/lib/constants/dashboardData";
import useSWR from "swr";

export default function Dashboard() {
 const {data: dashboard } = useSWR("/adminapp/dashboard/")
//  const 
 console.log(dashboard)
  return (
    <section className="p-4 font-poppins">
      <div className="py-8">
        <Typography size="xl" variant="h2" className={"text-accent"}>
          Quick Overview
        </Typography>
        <div className="flex space-x-4 p-4">
          <DashboardCard
            icon={<FaUser />}
            title="Total Customers"
            value={dashboard?.total_customers ?? 0}
          />
          <DashboardCard
            icon={<BsBoxArrowInDownRight />}
            title="Total Inflow"
            isAmount
            value={dashboard?.total_inflow ?? 0}
          />
          <DashboardCard
            icon={<BsBoxArrowUpRight />}
            title="Total Outflow"
            isAmount
            value={dashboard?.total_outflow ?? 0}
          />
        </div>
      </div>
      <div className="flex justify-between items-center py-8">
        <Typography size="lg" variant="body" className={"text-accent"}>
          Recent Transactions
        </Typography>
        <div className="flex items-center gap-5">
          <button className="export px-4 text-accent text-lg flex items-center gap-2 border border-[#D5D5D5] rounded-lg p-3">
            <FaFilter />
            <Typography>Filter</Typography>
          </button>
            <Typography className={"underline"}>View all</Typography>
          
        </div>
      </div>
      <Table columns={columns} data={dashboard?.recent_transactions ?? []} isGray={false} />
    </section>
  );
}
