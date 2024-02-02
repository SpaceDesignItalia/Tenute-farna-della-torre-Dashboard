import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import axios from "axios";
import { API_URL } from "../../API/API";
import { Image } from "@nextui-org/react";
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
      setLoading(false); // Nascondi lo spinner quando i dati sono stati caricati
    });
  }, [id, name]);

  console.log(product);

  return (
    <div className="lg:pl-unit-80">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6 ">
                  {images.map((image) => (
                    <Tab
                      key={image.id}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Image
                              radius={0}
                              src={
                                API_URL + "/uploads/" + image.productImagePath
                              }
                              alt=""
                              className="h-full w-full"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-primary" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-h-1 aspect-w-1 w-full flex justify-center">
                {images.map((image) => (
                  <Tab.Panel key={image.id}>
                    <Image
                      width={500}
                      height={500}
                      radius={0}
                      src={API_URL + "/uploads/" + image.productImagePath}
                      alt={image.alt}
                      className="h-full w-full"
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              {loading ? ( // Mostra lo spinner di caricamento se i dati sono in caricamento
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
                    {product.productName}
                  </h1>

                  <div className="mt-3">
                    <h2 className="text-xl font-bold text-gray-800">
                      Quantità in magazzino:
                    </h2>
                    <p className="text-xl tracking-tight text-gray-900">
                      {product.productAmount} Pz.
                    </p>
                  </div>

                  <div className="mt-3">
                    <h2 className="text-xl font-bold text-gray-800">Prezzo:</h2>
                    <p className="text-xl tracking-tight text-gray-900">
                      € {product.unitPrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Descrizione:
                    </h3>

                    <div
                      className="space-y-6 text-base text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: product.productDescription,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
