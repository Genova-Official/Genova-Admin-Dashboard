import { formatDateTime } from "@/utils/dateUtils";

export const columns = [
    {
      title: "S/N",
      key: "sn",
      render: (data, index) => <span>{index + 1}</span>,
    },
    { title: "Name", key: "name", render: (data) => <span>{data.customer_name}</span> },
    {
      title: "Description",
      key: "description",
      render: (data) => <span>{data.transaction_description === "" ? "Not Available": data.transaction_description}</span>,
    },
    { title: "Type", key: "type", render: (data) => <span>{data.transaction_type}</span> },
    {
      title: "Amount",
      key: "amount",
      render: (data) => {
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'NGN',
        }).format(data?.transaction_amount
          );
      
        return <span>{formattedPrice}</span>;
      },  
    },
    {
      title: "Status",
      key: "status",
    render: (data) => (
      <span>
        {data?.status?.toLowerCase() === "successful" && (
          <span style={{background:"rgba(75, 181, 67, 0.3)", border:"solid 1px #4BB543", color: "rgba(75, 181, 67, 1)"}} className={`py-2 px-4 rounded-full border bg-[#4BB543]/30 border-[#4BB543] text-[#4BB543]`}>
            {data?.status}
          </span>
        )}
        {data?.status?.toLowerCase() === "failed" && (
          <span  style={{background:"rgba(255, 148, 148, 0.3)", color: "rgba(255, 148, 148, 1)", border:"rgba(255, 148, 148, 1)"}} className={`py-2 px-4 rounded-full border bg-red/30 border-[#FF9494] text-[#FF9494]`}>
            {data.status}
          </span>
        )}
        {data?.status?.toLowerCase() === "pending" && (
          <span style={{background:"rgba(247, 203, 115, 0.2)", border:"solid 1px rgba(247, 203, 115, 1)", color: "rgba(247, 203, 115, 1)"}} className={`py-2 px-4 rounded-full border bg-[#F7CB73]/20 border-[#F7CB73] text-[#F7CB73]`}>
            {data?.status}
          </span>
        )}
      </span>
    )
    
  
    },
    {
      title: "Timestamp",
      key: "timestamp",
      render: (data) => <span>{formatDateTime(data.timestamp)}</span>,
    },
  ];

