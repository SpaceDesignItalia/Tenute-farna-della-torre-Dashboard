import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../API/API";

export default function Cards() {
  const [statsData, setStatsData] = useState({
    usersNumber: 0,
    customersNumber: 0,
    ordersNumber: 0,
  });

  useEffect(() => {
    axios.get(API_URL + "/Analytic/GetUsersNumber").then((res) => {
      setStatsData((prevData) => ({
        ...prevData,
        usersNumber: res.data.analytic[0].CustomersNumber,
      }));
    });
    axios.get(API_URL + "/Analytic/GetCustomersNumber").then((res) => {
      setStatsData((prevData) => ({
        ...prevData,
        customersNumber: res.data,
      }));
    });
    axios.get(API_URL + "/Analytic/GetOrdersNumber").then((res) => {
      setStatsData((prevData) => ({
        ...prevData,
        ordersNumber: res.data,
      }));
    });
  }, []);

  const stats = [
    { name: "Clienti registrati", stat: statsData.usersNumber },
    { name: "Clienti", stat: statsData.customersNumber },
    { name: "Ordini", stat: statsData.ordersNumber },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
