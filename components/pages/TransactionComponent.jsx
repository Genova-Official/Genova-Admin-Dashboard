import React from "react";
import Table from "../reusables/table/Table";

export default function TransactionComponent({
  transactionColumns,
  transactionData,
}) {
  return (
    <div>
      <Table
        columns={transactionColumns}
        data={transactionData}
        isGray={false}
      />
    </div>
  );
}
