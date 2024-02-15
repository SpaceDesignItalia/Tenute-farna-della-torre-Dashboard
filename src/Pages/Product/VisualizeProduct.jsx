import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import axios from "axios";
import { API_URL } from "../../API/API";
import { Breadcrumbs, BreadcrumbItem, Button, Image } from "@nextui-org/react";
import CircularProgress from "@mui/material/CircularProgress"; // Importa lo spinner di caricamento

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function VisualizeProduct() {
  const { id, name } = useParams();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true); // Stato per gestire il caricamento

  useEffect(() => {
    axios
      .get(API_URL + "/Products/GetProductByNameAndId/" + id + "/" + name)
      .then((res) => {
        setProduct(res.data[0]);
      });

    axios.get(API_URL + "/Products/GetProductImagesById/" + id).then((res) => {
      setImages(res.data);
      console.log(res.data);
      setLoading(false); // Nascondi lo spinner quando i dati sono stati caricati
    });
  }, [id, name]);

  const calculateDiscountedPrice = () => {
    if (product.idDiscountType === null) {
      return <>€{product.unitPrice.toFixed(2)}</>;
    } else if (product.idDiscountType === 1) {
      const discountedPrice = product.unitPrice - product.discountValue;
      return <>€{discountedPrice.toFixed(2)}</>;
    } else if (product.idDiscountType === 2) {
      const discountedPrice =
        product.unitPrice - product.unitPrice * (product.discountValue / 100);
      return (
        <div className="flex flex-row gap-5 justify-center items-center">
          <div className="line-through text-lg text-gray-500">
            €{product.unitPrice.toFixed(2)}
          </div>
          €{discountedPrice.toFixed(2)}
        </div>
      );
    }
  };

  return (
    <div className="py-10 p-10 lg:pl-unit-80">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/products">Prodotti</BreadcrumbItem>
        <BreadcrumbItem>{product.productName}</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <Tab
                    key={index}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img
                            src={`${API_URL}/uploads/${image.productImagePath}`}
                            className="h-full w-full object-cover object-center"
                            alt={`Product Image ${index + 1}`}
                          />
                        </span>
                        <span
                          className={`${
                            selected ? "ring-primary" : "ring-transparent"
                          } pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2`}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
              {images.map((image, index) => (
                <Tab.Panel key={index}>
                  <img
                    src={`${API_URL}/uploads/${image.productImagePath}`}
                    className="h-full w-2/3 object-cover object-center sm:rounded-lg"
                    alt={`Product Image ${index + 1}`}
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.productName}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="flex flex-row text-3xl tracking-tight text-gray-900">
                {calculateDiscountedPrice()}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.productDescription }}
              />
            </div>
          </div>
        </div>
      </div>
      {loading && <CircularProgress />} {/* Aggiungi spinner di caricamento */}
      {images.length === 0 && <p>No images available</p>}{" "}
      {/* Nessuna immagine disponibile */}
    </div>
  );
}
