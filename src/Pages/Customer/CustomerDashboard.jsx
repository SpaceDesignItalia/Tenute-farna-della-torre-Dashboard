import React from "react";
import CustomerTable from "../../Components/Customer/Table/CustomerTable";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

export default function CustomerDashboard() {
  return (
    <div className="py-10 p-10 lg:pl-unit-80 flex flex-col gap-10">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Clienti</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="font-bold text-3xl">Clienti registrati</h1>
      <CustomerTable />
    </div>
  );
}
