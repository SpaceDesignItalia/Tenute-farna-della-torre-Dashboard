import React from "react";
import Cards from "../../Components/Home/Other/Cards";
import ProductTable from "../../Components/Home/Table/ProductTable";

export default function Home() {
  return (
    <div className="py-10 p-10 lg:pl-unit-80">
      <h1 className="font-bold text-3xl">Dashboard</h1>
      <div className="flex flex-col gap-5">
        <Cards />
        <div className="flex flex-col gap-5 border rounded-lg border-gray-200 bg-white px-4 py-5 sm:px-6">
          <div className=" mt-4">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Prodotti in magazzino
            </h3>
          </div>
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
