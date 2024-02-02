import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "../../API/API";

export default function VisualizeDiscount() {
  const { id, code } = useParams();

  const [discount, setDiscount] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(API_URL + "/Discounts/GetDiscountDataById/" + id).then((res) => {
      setDiscount(res.data[0]);
    });
    axios
      .get(API_URL + "/Discounts/GetDiscountProductsById/" + id)
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
      });
  }, [id]);

  return (
    <div className="py-10 p-10 lg:pl-unit-80">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Sconto
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{code}</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Tipo sconto
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {discount.typeName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Valore
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {discount.idDiscountType === 1 ? (
                <div>€ {discount.value.toFixed(2)}</div>
              ) : (
                <div>{discount.value}%</div>
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Inizio validità sconto
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {dayjs(discount.startDate).format("DD/MM/YYYY")}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Fine validità sconto
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {discount.endDate === null ? (
                <div className="text-3xl">♾️</div>
              ) : (
                dayjs(discount.endDate).format("DD/MM/YYYY")
              )}
            </dd>
          </div>
          {products.length > 0 && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Prodotti a cui è associato lo sconto
              </dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  {products.map((product) => {
                    return (
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {product.productName}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a
                            href={`/products/visualize-product/${product.idProduct}/${product.productName}`}
                            className="font-medium text-primary hover:text-primary"
                          >
                            Visualizza prodotto
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
