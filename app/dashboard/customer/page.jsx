import Table from "@/components/reusables/table/Table";
import Typography from "@/components/reusables/typography/Typography";
import React from "react";
import { BiExport } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";

export default function Customers() {
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
          className={`py-1 px-3 rounded-full text-white ${
            data.status === "Active" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {data.status}
        </span>
      ),
    },
  ];

  const data = [
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Inactive",
    },
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Inactive",
    },
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Inactive",
    },
  ];

  return (
    <section className="p-4">
      <div className="flex justify-between items-center py-8">
        <Typography size="xl" variant="h2" className={"text-accent"}>All Customers</Typography>
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

      <Table columns={columns} data={data} isGray={false} />
    </section>
  );
}
