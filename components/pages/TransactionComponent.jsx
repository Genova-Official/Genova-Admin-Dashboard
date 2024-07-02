import React from "react";
import Typography from "../reusables/typography/Typography";
import Table from "../reusables/table/Table";

export default function TransactionComponent({
  transactionColumns,
  transactionData,
}) {
  return (
    <div>
      {/* <Typography size="lg" variant="h3" className="text-accent mb-4">
        Transactions
      </Typography> */}
      <Table
        columns={transactionColumns}
        data={transactionData}
        isGray={false}
      />
    </div>
  );
}
