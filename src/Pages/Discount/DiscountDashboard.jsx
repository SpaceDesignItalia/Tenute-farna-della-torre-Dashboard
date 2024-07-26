import React from "react";
import DiscountTable from "../../Components/Discount/Table/DiscountTable";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

export default function DiscountDashboard() {
  return (
    <div className="py-10 p-10 lg:pl-unit-80 flex flex-col gap-10">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Sconti</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="font-bold text-3xl">Codici sconto</h1>
      <DiscountTable />
    </div>
  );
}
