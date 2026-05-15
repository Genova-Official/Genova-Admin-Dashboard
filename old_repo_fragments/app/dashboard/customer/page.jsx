"use client"

import { useRouter } from "next/navigation";
import Table from "@/components/reusables/table/Table";
import Typography from "@/components/reusables/typography/Typography";
import { BiExport } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import { customer_column } from "@/lib/constants/customersData";
import useSWR from "swr";

export default function Customers() {
  const router = useRouter();
  const {data: customer, isLoading } = useSWR("/adminapp/customers/")

 

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
        columns={customer_column}
        data={customer}
        isLoading={isLoading}
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
