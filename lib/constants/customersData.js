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
    render: (data) => <span>{data.phone_no ?? "Not Available"}</span>,
  },
  { title: "BVN", key: "bvn", render: (data) => <span>{data.bvn ?? "Not Available"}</span> },
  {
    title: "Status",
    key: "status",
    render: (data) => (
      <span
        className={`py-2 px-4 rounded-full border ${
          data.status.toLowerCase() === "active"
          ? "bg-green/30 border-[#4BB543] text-green"
            : data.status.toLowerCase() === "inactive"
            ? "bg-[#FF9494]/30 border-[#FF9494] text-red"
            : "bg-[#F7CB73]/20 border-[#F7CB73] text-[#F7CB73]"
        }`}
      >
        {data.status}
      </span>
    ),
  },
];


 export const transactionData = [
    {
      timestamp: "Dec 10.24–10:30PM",
      description: "Airtime Recharge",
      type: "Debit",
      status: "Success",
      paymentOption: "Wallet",
      amount: "₦3000",
      balance: "₦200000",
    },
    {
      timestamp: "Dec 10.24–10:30PM",
      description: "Bank Transfer",
      type: "Credit",
      status: "Failed",
      paymentOption: "Virtual Account",
      amount: "₦10000",
      balance: "₦200000",
    },
    {
      timestamp: "Dec 10.24–10:30PM",
      description: "DSTV",
      type: "Debit",
      status: "Success",
      paymentOption: "Virtual Account",
      amount: "₦34500",
      balance: "₦200000",
    },
    // Add more transaction data as needed
  ];

  export   const transactionColumns = [
    { title: "Timestamp", key: "timestamp", render: (data) => <span>{data.timestamp}</span> },
    { title: "Description", key: "description", render: (data) => <span>{data.description}</span> },
    { title: "Type", key: "type", render: (data) => <span>{data.type}</span> },
    {
      title: "Status",
      key: "status",
      render: (data) => (
        <span
          className={`py-2 px-4 rounded-full border ${
            data.status === "Success"
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
    { title: "Payment Option", key: "paymentOption", render: (data) => <span>{data.paymentOption}</span> },
    { title: "Amount", key: "amount", render: (data) => <span>{data.amount}</span> },
    { title: "Balance", key: "balance", render: (data) => <span>{data.balance}</span> },
  ];
