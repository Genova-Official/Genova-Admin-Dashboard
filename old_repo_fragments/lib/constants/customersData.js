import { formatDateTime } from "@/utils/dateUtils";

export const customer_column = [
    
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
    render: (data) => <span> {data.phone_no ?? "Not Available"} </span>,
  },
  { title: "BVN", key: "bvn", render: (data) => <span>{data.bvn ?? "Not Available"}</span> },
  {
    title: "Status",
    key: "status",
    render: (data) => (
      <span>
        {data?.status?.toLowerCase() === "active" && (
          <span style={{background:"#4BB543", color: "white"}} className={`py-2 px-4 rounded-full border bg-[#4BB543]/30 border-[#4BB543] text-[#4BB543]`}>
            {data?.status}
          </span>
        )}
        {data?.status?.toLowerCase() === "inactive" && (
          <span style={{background:"#FF9494", color: "white"}} className={`py-2 px-4 rounded-full border bg-red/30 border-[#FF9494] text-[#FF9494]`}>
            {data.status}
          </span>
        )}
        {data?.status?.toLowerCase() === "pending" && (
          <span className={`py-2 px-4 rounded-full border bg-[#F7CB73]/20 border-[#F7CB73] text-[#F7CB73]`}>
            {data?.status}
          </span>
        )}
      </span>
    )
    
  },
];



  export   const transactionColumns = [
    { title: "Timestamp", key: "timestamp", render: (data) => <span>{formatDateTime(data.timestamp)}</span>},
    { title: "Description", key: "description", render: (data) => <span>{data.description}</span> },
    { title: "Type", key: "type", render: (data) => <span>{data.type}</span> },
    {
      title: "Status",
      key: "status",
      render: (data) => (
        <span
          className={`py-2 px-4 rounded-full border ${
            data?.status?.toLowerCase() === "successful"
              ? "bg-green/30 border-[#4BB543] text-[#4BB543]"
              : data.status.toLowerCase() === "failed"
              ? "bg-[#FF9494]/30 border-[#FF9494] text-red"
              : "bg-[#F7CB73]/20 border-[#F7CB73] text-[#F7CB73]"
          }`}
        >
          {data.status}
        </span>
      ),
    },
    { title: "Amount", key: "amount",  render: (data) => {
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
      }).format(data?.amount);
    
      return <span>{formattedPrice}</span>; 
    }  
  },
    { title: "Balance", key: "balance", render: (data) => {
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
      }).format(data?.wallet_balance_after_transaction);
    
      return <span>{formattedPrice}</span>;
    }, },
  ];
