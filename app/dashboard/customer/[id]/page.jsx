"use client";
import { useParams, useRouter } from "next/navigation";
import Typography from "@/components/reusables/typography/Typography";
import {
  data,
  transactionColumns,
  transactionData,
} from "@/lib/constants/customersData";
import Tab from "@/components/reusables/Tab";
import TransactionComponent from "@/components/pages/TransactionComponent";
import ProfileComponent from "@/components/pages/ProfileComponent";
import useSWR from "swr";

const CustomerDetails = () => {
  const { id } = useParams();
  const {data: customer_details} = useSWR(`/adminapp/user/${id}`)
  const {data: customer_detail} = useSWR(`/user/${id}`)
  const selecteddata = data?.find((customer) => customer?.id == id);
console.log(customer_detail, customer_details)
  const tabs = [
    {
      label: "Transactions",
      content: (
        <TransactionComponent
          transactionColumns={transactionColumns}
          transactionData={transactionData}
        />
      ),
    },
    { label: "Profile Information", content: <ProfileComponent /> },
  ];
  return (
    <div className="mt-8 p-4 bg-white ">
      <div className="flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <div className="bg-[#6666FF] grid gap-9 w-[350px] p-4 tex-white rounded-md">
            <Typography variant="h4" className={"text-white"} size="sm">
              Total Balance
            </Typography>
            <Typography variant="h1" size="xl" className="text-white">
              NGN100,000
            </Typography>
            <div className="">
              <Typography className="text-white" variant="body" size="sm">
                Credit due date
              </Typography>
              <Typography className="text-white" variant="body" size="sm">
                2023-06-25
              </Typography>
            </div>
          </div>
          <div className="bg-[#FFCC66] grid gap-9 w-[350px] text-black p-4 rounded-md">
            <Typography variant="h4" className="text-black" size="sm">
              Virtual Account Balance
            </Typography>
            <Typography variant="h1" size="xl" className="text-black">
              NGN800,000
            </Typography>
            <div className="">
              <Typography className="text-black" variant="body" size="sm">
                Account Number
              </Typography>
              <Typography className="text-black" variant="body" size="sm">
                9857374832
              </Typography>
            </div>
          </div>
          <div className="bg-gray-100 grid gap-2 text-accent border border-gray-300 w-[350px] p-4 rounded-lg">
            <div className="bg-gray-500 h-[70px] w-[70px] rounded-[50%]"></div>
            <Typography variant="h3" size="md">
              {customer_detail?.first_name} { " "}
              {customer_detail?.last_name}
            </Typography>
            <Typography size="sm">{customer_detail?.email}</Typography>
            {/* <Typography className="text-accent" size="sm">
              User since 08/08/2007
            </Typography> */}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tab tabs={tabs} />
      </div>
    </div>
  );
};

export default CustomerDetails;
