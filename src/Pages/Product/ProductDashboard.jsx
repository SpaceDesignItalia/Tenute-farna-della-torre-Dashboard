import React from "react";
import ProductTable from "../../Components/Product/Table/ProductTable";
import FeaturedProductTable from "../../Components/Product/Table/FeaturedProductTable";

export default function ProductDashboard() {
  return (
    <div className="py-10 p-10 lg:pl-unit-80 flex flex-col gap-10">
      <h1 className="font-bold text-3xl">Prodotti</h1>
      <ProductTable />

      <h2 className="font-bold text-3xl">Prodotti in evidenza</h2>
      <FeaturedProductTable />
    </div>
  );
}
