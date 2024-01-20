import React, { useState } from "react";
import {
  Button,
  Avatar,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

export default function AddFeaturedProduct() {
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });

  const [productId, setProductId] = useState(null);

  const onSelectionChange = (value) => {
    setProductId(value);
  };

  console.log("newFeaturedProduct", productId);

  function enableSubmit() {
    if (productId === null) {
      return true;
    }
    return false;
  }

  function backToProducts() {
    setAlertData({
      isOpen: true,
      variant: "warning",
      title: "Operazione annullata",
      message: "Il prodotto non è stato aggiunto",
    });

    setTimeout(() => {
      window.location.href = "/products";
    }, 1000);
  }

  function handleAddFeaturedProduct() {
    setAlertData({
      isOpen: true,
      variant: "success",
      title: "Prodotto aggiunto",
      message: "Il prodotto in evidenza è stato aggiunto con successo",
    });
  }

  const handleClose = (reason) => {
    setAlertData({
      isOpen: false,
      variant: "",
      title: "",
      message: "",
    });
  };

  const products = [
    {
      productImagePath: "https://picsum.photos/200/300",
      label: "Prodotto 1",
      value: "1",
    },
  ];

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alertData.isOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert size="lg" severity={alertData.variant} sx={{ width: "100%" }}>
          <AlertTitle sx={{ fontWeight: "bold" }}>{alertData.title}</AlertTitle>
          {alertData.message}
        </Alert>
      </Snackbar>
      <div className="py-10 p-10 lg:pl-unit-80">
        <h1 className="font-bold text-3xl">Aggiungi prodotto in evidenza</h1>

        <form>
          <div className="space-y-12 sm:space-y-16">
            <div>
              <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Seleziona prodotto
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <Autocomplete
                      label="Seleziona un prodotto dal catalogo"
                      variant="bordered"
                      className="lg:w-1/2"
                      size="sm"
                      radius="sm"
                      onSelectionChange={onSelectionChange}
                    >
                      {products.map((product) => (
                        <AutocompleteItem
                          key={product.value}
                          value={product.value}
                          startContent={
                            <Avatar
                              src={product.productImagePath}
                              radius="sm"
                            />
                          }
                        >
                          {product.label}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center lg:justify-end gap-x-6">
            <button
              onClick={backToProducts}
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancella
            </button>
            <Button
              color="primary"
              radius="sm"
              isDisabled={enableSubmit()}
              onClick={handleAddFeaturedProduct}
            >
              Aggiungi prodotto
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
