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
      render: (data) => <span>{data.transaction_description}</span>,
    },
    { title: "Type", key: "type", render: (data) => <span>{data.transaction_type}</span> },
    {
      title: "Amount",
      key: "amount",
      render: (data) => {
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(data?.transaction_amount);
      
        return <span>{formattedPrice}</span>;
      },       },
    {
      title: "Status",
      key: "status",
      render: (data) => (
        <span
      className={`py-2 px-4 rounded-full border ${
        data.status === "Successful"
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
      render: (data) => <span>{formatDateTime(data.timestamp)}</span>,
    },
  ];

  export  const data = [
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