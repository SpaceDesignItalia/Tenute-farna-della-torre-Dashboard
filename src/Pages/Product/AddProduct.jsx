import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddProduct() {
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productDescription: "",
    productAmount: 0,
    unitPrice: 0,
  });
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  function handleProductName(e) {
    setNewProduct({ ...newProduct, productName: e.target.value });
  }

  const handleProductDescription = (text) => {
    setNewProduct({ ...newProduct, productDescription: text });
  };

  function handleProductAmount(e) {
    // Rimuovi i caratteri non numerici dall'input
    const inputValue = e.target.value.replace(/[^0-9]/g, "");

    // Aggiorna lo stato in tempo reale solo se il valore è diverso
    if (inputValue !== newProduct.productAmount) {
      setNewProduct({ ...newProduct, productAmount: inputValue });
    }
  }

  function handleUnitPrice(e) {
    // Rimuovi i caratteri non numerici (e la virgola) dall'input, tranne l'ultima virgola
    const inputValue = e.target.value
      .replace(/[^0-9,.]/g, "")
      .replace(/(\..*)\./g, "$1");

    // Aggiorna lo stato in tempo reale solo se il valore è diverso
    if (inputValue !== newProduct.unitPrice) {
      setNewProduct({ ...newProduct, unitPrice: inputValue });
    }
  }

  function enableSubmit() {
    if (
      newProduct.productName !== "" &&
      newProduct.productDescription !== "" &&
      newProduct.productAmount !== 0 &&
      newProduct.unitPrice !== 0
    ) {
      return false;
    }
    return true;
  }

  function backToProducts() {
    setAlertData({
      ...alertData,
      isOpen: true,
      variant: "warning",
      title: "Operazione annullata",
      message: "Il prodotto non è stato aggiunto",
    });
    setTimeout(() => {
      window.location.href = "/products";
    }, 1000);
  }

  const handleClose = (event, reason) => {
    setAlertData({
      ...alertData,
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
      <div className="py-10 p-10 lg:pl-unit-80">
        <h1 className="font-bold text-3xl">Nuovo prodotto</h1>

        <form>
          <div className="space-y-12 sm:space-y-16">
            <div>
              <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Nome prodotto
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <Input
                      variant="bordered"
                      placeholder="Nome prodotto"
                      size="sm"
                      radius="sm"
                      className="w-1/2"
                      onChange={handleProductName}
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Descrizione
                  </label>
                  <div className="mt-2 h-auto sm:col-span-2 sm:mt-0">
                    <ReactQuill
                      className="h-1/2"
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      placeholder="Descrizione prodotto"
                      onChange={handleProductDescription}
                      value={newProduct.productDescription || ""}
                    />

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Inserisci una descrizione del prodotto
                    </p>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Quantità di unità in magazzino
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <Input
                      type="text"
                      variant="bordered"
                      placeholder="0"
                      size="sm"
                      radius="sm"
                      className="w-1/2"
                      endContent="Pz."
                      onChange={handleProductAmount}
                    />
                  </div>

                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Prezzo a unità
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <Input
                      variant="bordered"
                      placeholder="0.00"
                      size="sm"
                      radius="sm"
                      className="w-1/2"
                      endContent="€"
                      onChange={handleUnitPrice}
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Photo
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <div className="flex items-center gap-x-3">
                      <button
                        type="button"
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              onClick={backToProducts}
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancella
            </button>
            <Button color="primary" radius="sm" isDisabled={enableSubmit()}>
              Aggiungi prodotto
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
