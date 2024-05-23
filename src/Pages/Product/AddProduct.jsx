import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  Image,
  Breadcrumbs,
  BreadcrumbItem,
  Checkbox,
} from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import axios from "axios";
import { API_URL } from "../../API/API";

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
    productAmount: "",
    unitPrice: "",
  });

  const [isWine, setIsWine] = React.useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [labelPhoto, setLabelPhoto] = useState(null);

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["link"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
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
    let value = e.target.value.replace(/[^\d]/g, ""); // Rimuovi tutti i caratteri non numerici

    const numericValue = parseInt(value); // Converte il valore in un numero intero

    // Se il valore è un numero intero positivo, aggiorna lo stato
    if (!isNaN(numericValue) && numericValue >= 0) {
      setNewProduct({ ...newProduct, productAmount: value });
    }
  }

  function handleUnitPrice(e) {
    // Rimuovi i caratteri non numerici (e il punto) dall'input
    let value = e.target.value.replace(/[^\d.]/g, "");

    // Se il valore contiene solo numeri e al massimo un punto, aggiorna lo stato
    if (/^\d*\.?\d*$/.test(value)) {
      setNewProduct({ ...newProduct, unitPrice: value });
    }
  }

  const handleKeyPress = (e) => {
    // Permette solo i numeri e il tasto Backspace
    const isValidKey = /^\d$/.test(e.key) || e.key === "Backspace";
    if (!isValidKey) {
      e.preventDefault();
    }
  };

  const handleKeyPressPrice = (e) => {
    const { value } = e.target;
    // Controlla se il punto è già presente nella stringa
    const hasDecimalPoint = value.includes(".");

    // Permette solo i numeri, la virgola e il tasto Backspace
    const isValidKey = /^[\d.]$/.test(e.key) || e.key === "Backspace";

    // Consenti l'inserimento del punto solo se non è già presente nella stringa
    if (!isValidKey || (e.key === "." && hasDecimalPoint)) {
      e.preventDefault();
    }
  };

  function enableSubmit() {
    if (
      (newProduct.productName !== "" &&
        newProduct.productDescription !== "" &&
        newProduct.productAmount !== 0 &&
        newProduct.unitPrice !== 0 &&
        photos.length !== 0) ||
      (isWine !== true && labelPhoto !== null)
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

  const handleAddProduct = async () => {
    // Imposta il titolo e il messaggio della notifica
    setAlertData({
      ...alertData,
      isOpen: true,
      variant: "success",
      title: "Prodotto aggiunto",
      message: "Il prodotto è stato aggiunto con successo",
    });

    const trimmedProductName = newProduct.productName.trim();
    const formData = new FormData();

    // Aggiungi i dati del nuovo prodotto
    formData.append("productName", trimmedProductName);
    formData.append("productDescription", newProduct.productDescription);
    formData.append("productAmount", newProduct.productAmount);
    formData.append("unitPrice", newProduct.unitPrice);
    formData.append("isDiscount", newProduct.isDiscount);
    formData.append("productLabel", labelPhoto);

    // Aggiungi le immagini del prodotto
    photos.forEach((photo, index) => {
      formData.append(`photo${index + 1}`, photo.file);
    });

    try {
      const response = await axios.post(
        API_URL + "/Products/CreateProduct",
        formData
      );
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

  const handleClose = (event, reason) => {
    setAlertData({
      ...alertData,
      isOpen: false,
      variant: "",
      title: "",
      message: "",
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;

    // Limit the number of selected files to 5
    const selectedFilesArray = Array.from(selectedFiles).slice(0, 5);

    // Convert each file to an object with additional properties if needed
    const photoObjects = selectedFilesArray.map((file) => ({
      file,
      // You can add more properties here, such as a caption or other metadata
    }));

    setPhotos((prevPhotos) => [...prevPhotos, ...photoObjects]);
  };

  const handleRemovePhoto = (index) => {
    // Rimuovi la foto corrispondente all'indice dall'array
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleLabelPhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    setLabelPhoto(selectedFile);
  };

  const handleRemoveLabelPhoto = () => {
    setLabelPhoto(null);
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
          <BreadcrumbItem>Aggiungi prodotto</BreadcrumbItem>
        </Breadcrumbs>
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
                      className="lg:w-1/2"
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
                  <div className="mt-2 h-auto sm:col-span-1 sm:mt-0">
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
                      className="lg:w-1/2"
                      endContent="Pz."
                      onChange={handleProductAmount}
                      onKeyPress={handleKeyPress}
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
                      type="text"
                      variant="bordered"
                      placeholder="0.00"
                      size="sm"
                      radius="sm"
                      className="lg:w-1/2"
                      endContent="€"
                      onChange={handleUnitPrice}
                      onKeyPress={handleKeyPressPrice}
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Foto del prodotto
                  </label>
                  <div className="flex flex-col gap-10">
                    <Alert variant="outlined" severity="warning">
                      Dimensioni consigliate per l'immagine: <br /> 500x500
                      pixel.
                    </Alert>
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="flex flex-row gap-5 items-center"
                      >
                        <Image
                          isBordered
                          radius="sm"
                          size="lg"
                          width={200}
                          height={200}
                          src={URL.createObjectURL(photo.file)}
                        />
                        <Button
                          isIconOnly
                          className="bg-red-500 text-white"
                          radius="sm"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <DeleteRoundedIcon />{" "}
                        </Button>
                      </div>
                    ))}

                    {photos.length < 5 && (
                      <label className="relative inline-flex justify-center items-center bg-primary dark:text-black text-white px-4 py-2 rounded-md cursor-pointer w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e)}
                          className="hidden"
                          multiple
                          ref={fileInputRef}
                        />
                        <FileUploadRoundedIcon />
                        {photos.length === 0 ? (
                          <span>Carica copertina</span>
                        ) : (
                          <span>Carica foto {photos.length + "/" + 5}</span>
                        )}
                      </label>
                    )}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    <Checkbox
                      isSelected={isWine}
                      onValueChange={setIsWine}
                      radius="sm"
                    />
                    Vino
                  </label>
                  {isWine && (
                    <div className="flex flex-col gap-10">
                      <Alert variant="outlined" severity="warning">
                        Dimensioni consigliate per l'immagine: <br /> 500x500
                        pixel.
                      </Alert>
                      {labelPhoto !== null && (
                        <div className="flex flex-row gap-5 items-center">
                          <Image
                            isBordered
                            radius="sm"
                            size="lg"
                            width={200}
                            height={200}
                            src={URL.createObjectURL(labelPhoto)}
                          />
                          <Button
                            isIconOnly
                            className="bg-red-500 text-white"
                            radius="sm"
                            onClick={() => handleRemoveLabelPhoto()}
                          >
                            <DeleteRoundedIcon />{" "}
                          </Button>
                        </div>
                      )}

                      {!labelPhoto && (
                        <label className="relative inline-flex justify-center items-center bg-primary dark:text-black text-white px-4 py-2 rounded-md cursor-pointer w-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLabelPhotoChange(e)}
                            className="hidden"
                            ref={fileInputRef}
                          />
                          <FileUploadRoundedIcon />

                          <span>Carica etichetta</span>
                        </label>
                      )}
                    </div>
                  )}
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
              isDisabled={enableSubmit() || isAddingProduct} // Disabilita il pulsante quando è in corso l'aggiunta del prodotto
              onClick={handleAddProduct}
              isLoading={isAddingProduct}
            >
              {isAddingProduct ? "Aggiungendo..." : "Aggiungi prodotto"}{" "}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
