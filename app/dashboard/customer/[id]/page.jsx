"use client";
import { useParams } from "next/navigation";
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
import useFormattedPrice from "@/hooks/useFormattedPrice";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};
const CustomerDetails = () => {
  const { id } = useParams();
  const {data: customer_details} = useSWR(`/adminapp/user-information/${id}`)
  const {data: customer_transaction} = useSWR(`/adminapp/user-transaction/${id}`)
  const {data: customer_detail} = useSWR(`/user/${id}`)

  const formattedPrice = useFormattedPrice(customer_details?.wallet_balance, "NGN")
  const tabs = [
    {
      label: "Transactions",
      content: (
        <TransactionComponent
          transactionColumns={transactionColumns}
          transactionData={customer_transaction?.transaction_history ?? []}
        />
      ),
    },
    { label: "Profile Information", content: <ProfileComponent customer={customer_details?.user_information} /> },
  ];
  return (
    <div className="mt-8 xl:p-4  mb-[100px] xl:mb-0  p-1  bg-white ">
      <div className="flex ">
        <div className="flex xl:flex-row w-full sm:flex-row flex-col gap-8 items-center">
          <div className="bg-[#6666FF] grid gap-9 xl:w-[350px] w-[100%] p-4 tex-white rounded-md">
            <Typography variant="h4" className={"text-white"} size="sm">
              Total Balance
            </Typography>
            <Typography variant="h1" size="xl" className="text-white">
              {formattedPrice}
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
          <div className="bg-[#FFCC66] grid gap-9 xl:w-[350px] w-[100%]  text-black p-4 rounded-md">
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
                {customer_details?.user_information?.account_number ?? "Not Available"}
              </Typography>
            </div>
          </div>
          <div className="bg-gray-100 grid gap-2 text-accent border border-gray-300 xl:w-[350px] w-[100%] p-4 rounded-lg">
            <div className="bg-gray-500 h-[70px] w-[70px] rounded-[50%]"></div>
            <Typography variant="h3" size="md">
              {customer_detail?.first_name} { " "}
              {customer_detail?.last_name}
            </Typography>
            <Typography size="sm">{customer_detail?.email}</Typography>
            <Typography className="text-accent" size="sm">
            User since {customer_details?.user_information?.created_at ? formatDate(customer_details?.user_information?.created_at) : 'N/A'}
            </Typography>
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
