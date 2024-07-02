export const data = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      id: 2,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      id: 3,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Failed",
    },
    {
      id: 4,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Failed",
    },
    {
      id: 5,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Pending",
    },
    {
      id: 6,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      id: 7,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Active",
    },
    {
      id: 8,
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "070-6553-2673",
      bvn: "3537487526",
      status: "Failed",
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
