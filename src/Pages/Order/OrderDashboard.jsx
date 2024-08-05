import React from "react";
import OrderTable from "../../Components/Order/Table/OrderTable";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

export default function OrderDashboard() {
  return (
    <div className="py-10 p-10 lg:pl-unit-80 flex flex-col gap-10">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Ordini</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="font-bold text-3xl">Ordini</h1>
      <OrderTable />
    </div>
  );
}
