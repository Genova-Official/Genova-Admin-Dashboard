import DashboardCard from "@/components/card/DashboardCard";
import Table from "@/components/reusables/table/Table";
import Typography from "@/components/reusables/typography/Typography";
import React from "react";
import { FaFilter, FaUser, } from "react-icons/fa";
import { BsBoxArrowInDownRight, BsBoxArrowUpRight, BsPersonFill } from "react-icons/bs";

export default function Dashboard() {
  const columns = [
    {
      title: "S/N",
      key: "sn",
      render: (data, index) => <span>{index + 1}</span>,
    },
    { title: "Name", key: "name", render: (data) => <span>{data.name}</span> },
    {
      title: "Description",
      key: "description",
      render: (data) => <span>{data.description}</span>,
    },
    { title: "Type", key: "type", render: (data) => <span>{data.type}</span> },
    {
      title: "Amount",
      key: "amount",
      render: (data) => <span>{data.amount}</span>,
    },
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
    {
      title: "Timestamp",
      key: "timestamp",
      render: (data) => <span>{data.timestamp}</span>,
    },
  ];

  const data = [
    {
      name: "John Doe",
      description: "johndoe@gmail.com",
      type: "070-6553-2673",
      amount: "3537487526",
      status: "Active",
      timestamp: "Dec 10.24-10:30PM",
    },
    {
      name: "John Doe",
      description: "johndoe@gmail.com",
      type: "070-6553-2673",
      amount: "3537487526",
      status: "Pending",
      timestamp: "Dec 10.24-10:30PM",
    },
    {
      name: "John Doe",
      description: "johndoe@gmail.com",
      type: "070-6553-2673",
      amount: "3537487526",
      status: "Failed",
      timestamp: "Dec 10.24-10:30PM",
    },
    {
      name: "John Doe",
      description: "johndoe@gmail.com",
      type: "070-6553-2673",
      amount: "3537487526",
      status: "Failed",
      timestamp: "Dec 10.24-10:30PM",
    },
    {
      name: "John Doe",
      description: "johndoe@gmail.com",
      type: "070-6553-2673",
      amount: "3537487526",
      status: "Active",
      timestamp: "Dec 10.24-10:30PM",
    },
    {
      name: "John Doe",
      description: "johndoe@gmail.com",
      type: "070-6553-2673",
      amount: "3537487526",
      status: "Active",
      timestamp: "Dec 10.24-10:30PM",
    },
    {
      name: "John Doe",
      description: "johndoe@gmail.com",
      type: "070-6553-2673",
      amount: "3537487526",
      status: "Active",
      timestamp: "Dec 10.24-10:30PM",
    },
    {
      name: "John Doe",
      description: "johndoe@gmail.com",
      type: "070-6553-2673",
      amount: "3537487526",
      status: "Failed",
      timestamp: "Dec 10.24-10:30PM",
    },
  ];

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
            value="11,000"
          />
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
      <Table columns={columns} data={data} isGray={false} />
    </section>
  );
}
