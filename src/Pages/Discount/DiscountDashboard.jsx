import React from "react";
import DiscountTable from "../../Components/Discount/DiscountTable";

export default function DiscountDashboard() {
  return (
    <div className="py-10 p-10 lg:pl-unit-80 flex flex-col gap-10">
      <h1 className="font-bold text-3xl">Codici sconto</h1>
      <DiscountTable />
    </div>
  );
}
