import React from "react";
import CustomerTable from "../../Components/Customer/Table/CustomerTable";

export default function CustomerDashboard() {
  return (
    <div className="py-10 p-10 lg:pl-unit-80 flex flex-col gap-10">
      <h1 className="font-bold text-3xl">Clienti registrati</h1>
      <CustomerTable />
    </div>
  );
}
