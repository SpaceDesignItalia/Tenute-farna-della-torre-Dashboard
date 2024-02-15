import React, { useEffect, useState } from "react";
import {
  Button,
  Avatar,
  Autocomplete,
  AutocompleteItem,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../API/API";

export default function AddFeaturedProduct() {
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    axios.get(API_URL + "/Featured/NotFeatured").then((response) => {
      setProducts(response.data);
    });
  }, []);

  const onSelectionChange = (value) => {
    setProductId(value);
  };

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

  const handleAddFeaturedProduct = async () => {
    setAlertData({
      isOpen: true,
      variant: "success",
      title: "Prodotto aggiunto",
      message: "Il prodotto in evidenza è stato aggiunto con successo",
    });

    try {
      const response = await axios.post(API_URL + "/Featured/CreateFeatured", {
        idProduct: productId,
      });
      setIsAddingProduct(true);
      if (response.status === 201) {
        setTimeout(() => {
          window.location.href = "/products";
        }, 1000);
      }
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto", error);
    }
  };

  const handleClose = (reason) => {
    setAlertData({
      isOpen: false,
      variant: "",
      title: "",
      message: "",
    });
  };

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
      <div className="py-10 p-10 lg:pl-unit-80 flex flex-col gap-10">
        <Breadcrumbs>
          <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/products">Prodotti</BreadcrumbItem>
          <BreadcrumbItem>Aggiungi in evidenza</BreadcrumbItem>
        </Breadcrumbs>
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
                      isRequired
                    >
                      {products.map((product) => (
                        <AutocompleteItem
                          key={product.idProduct}
                          value={product.idProduct}
                          startContent={
                            <Avatar
                              src={
                                API_URL + "/uploads/" + product.productImagePath
                              }
                              radius="sm"
                            />
                          }
                        >
                          {product.productName}
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
              isLoading={isAddingProduct}
            >
              {isAddingProduct ? "Aggiungendo..." : "Aggiungi prodotto"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
