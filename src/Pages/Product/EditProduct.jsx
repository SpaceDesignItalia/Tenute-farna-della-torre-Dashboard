import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Image,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../API/API";

const modules = {
  toolbar: [["bold", "italic", "underline", "strike", "blockquote"], ["link"]],
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
export default function EditProduct() {
  const { id, name } = useParams();
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    productAmount: "",
    unitPrice: "",
  });
  const [initialProduct, setInitialProduct] = useState({});
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [photo, setPhoto] = useState([]);
  const [labelPhoto, setLabelPhoto] = useState(null); // Initialize as null
  const [deletedLabel, setDeletedLabel] = useState(false);
  const fileInputRef = useRef(null);
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    // Fetch existing product details and photos
    axios
      .get(API_URL + "/Products/GetProductByNameAndId/" + id + "/" + name)
      .then((res) => {
        const initialProductData = res.data[0];
        setProduct({
          productName: initialProductData.productName,
          productDescription: initialProductData.productDescription,
          productAmount: initialProductData.productAmount,
          unitPrice: initialProductData.unitPrice,
        });
        setInitialProduct({
          productName: initialProductData.productName,
          productDescription: initialProductData.productDescription,
          productAmount: initialProductData.productAmount,
          unitPrice: initialProductData.unitPrice,
        });
      });
    axios.get(API_URL + "/Products/GetProductImagesById/" + id).then((res) => {
      setPhoto(res.data);
    });
    axios.get(API_URL + "/Products/GetProductLabelById/" + id).then((res) => {
      // Set label photo or null if not available
      setLabelPhoto(res.data ? res.data : null);
    });
  }, [id, name]);

  function handleProductName(e) {
    setProduct({ ...product, productName: e.target.value });
  }

  const handleProductDescription = (value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productDescription: value,
    }));
  };

  function handleProductAmount(e) {
    let value = e.target.value.replace(/[^\d]/g, ""); // Remove non-numeric characters
    const numericValue = parseInt(value); // Convert to integer
    if (!isNaN(numericValue) && numericValue >= 0) {
      setProduct({ ...product, productAmount: value });
    }
  }

  function handleUnitPrice(e) {
    let value = e.target.value.replace(/[^\d.]/g, ""); // Remove non-numeric characters (except dot)
    if (/^\d*\.?\d*$/.test(value)) {
      setProduct({ ...product, unitPrice: value });
    }
  }

  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...photo];
    updatedPhotos.splice(index, 1);
    setPhoto(updatedPhotos);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const selectedFilesArray = Array.from(selectedFiles).slice(0, 5);
    const photoObjects = selectedFilesArray.map((file) => ({
      file,
    }));
    setPhoto((prevPhotos) => [...prevPhotos, ...photoObjects]);
  };

  const handleKeyPress = (e) => {
    const isValidKey = /^\d$/.test(e.key) || e.key === "Backspace";
    if (!isValidKey) {
      e.preventDefault();
    }
  };

  const handleKeyPressPrice = (e) => {
    const { value } = e.target;
    const hasDecimalPoint = value.includes(".");
    const isValidKey = /^[\d.]$/.test(e.key) || e.key === "Backspace";
    if (!isValidKey || (e.key === "." && hasDecimalPoint)) {
      e.preventDefault();
    }
  };

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

  function enableSubmit() {
    if (
      product.productName === initialProduct.productName &&
      product.productDescription === initialProduct.productDescription &&
      product.productAmount === initialProduct.productAmount &&
      product.unitPrice === initialProduct.unitPrice &&
      photo.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    const trimmedProductName = product.productName.trim();
    const formData = new FormData();
    formData.append("productName", trimmedProductName);
    formData.append("productDescription", product.productDescription);
    formData.append("productAmount", product.productAmount);
    formData.append("unitPrice", product.unitPrice);
    // Add the labelPhoto to the FormData if it's not null
    if (labelPhoto) {
      formData.append("productLabel", labelPhoto);
    }

    if (deletedLabel) {
      formData.append("deletedLabel", deletedLabel);
    }
    // Add existing photos
    photo.forEach((photo) => {
      formData.append("oldPhotos", photo.productImagePath);
    });
    photo.forEach((photo) => {
      formData.append("photos", photo.file);
    });

    try {
      const response = await axios.put(
        API_URL + "/Products/EditProduct/" + id,
        formData
      );
      setIsAddingProduct(true);

      if (response.status === 200) {
        setAlertData({
          ...alertData,
          isOpen: true,
          variant: "success",
          title: "Prodotto modificato",
          message: "Il prodotto è stato modificato con successo",
        });
        setTimeout(() => {
          window.location.href = "/products";
        }, 1000);
      }
    } catch (error) {
      setIsAddingProduct(false);
      console.error(error);
      setAlertData({
        ...alertData,
        isOpen: true,
        variant: "error",
        title: "Errore",
        message: "Si è verificato un errore durante la modifica del prodotto",
      });
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

  const onImageDownload = (name) => {
    const svg = document.getElementById("QrCode");
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.download = "QR_" + name + ".svg";
    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url); // Free up the URL resource when it's no longer needed
  };

  const handleLabelPhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    setLabelPhoto(selectedFile);
    setDeletedLabel(false);
  };

  const handleRemoveLabelPhoto = () => {
    setLabelPhoto(null); // Set to null if label photo is removed
    setDeletedLabel(true);
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
          <BreadcrumbItem>{product.productName}</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex flex-col justify-center gap-5">
          <h1 className="font-bold text-3xl">Modifica: </h1>
          <h1 className="font-semibold text-2xl">{name}</h1>
        </div>

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
                      onChange={(e) => handleProductName(e)}
                      value={product.productName}
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
                      value={product.productDescription}
                      onChange={handleProductDescription}
                      modules={modules}
                      formats={formats}
                    />
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
                      onKeyPress={handleKeyPress}
                      value={product.productAmount}
                      onChange={(e) => handleProductAmount(e)}
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
                      onKeyPress={handleKeyPressPrice}
                      value={product.unitPrice}
                      onChange={(e) => handleUnitPrice(e)}
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
                    {photo.map((photo, index) => (
                      <div
                        key={index}
                        className="flex flex-row gap-5 items-center"
                      >
                        <Image
                          radius="sm"
                          size="lg"
                          width={200}
                          height={200}
                          src={
                            photo.productImagePath
                              ? API_URL + "/uploads/" + photo.productImagePath
                              : URL.createObjectURL(photo.file)
                          }
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

                    {photo.length < 5 && (
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
                        {photo.length === 0 ? (
                          <span>Carica copertina</span>
                        ) : (
                          <span>Carica foto {photo.length + "/" + 5}</span>
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
                    Etichetta del prodotto
                  </label>
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
                          src={
                            labelPhoto.path
                              ? API_URL + "/uploads/" + labelPhoto.path
                              : URL.createObjectURL(labelPhoto)
                          }
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
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    QR Code
                  </label>
                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-5 items-center">
                      <QRCode
                        id="QrCode"
                        size={256}
                        value={
                          "https://www.tenutefarina.it/store/product/" +
                          id +
                          "/" +
                          encodeURIComponent(name.toLowerCase()) +
                          "/details"
                        }
                        viewBox={`0 0 256 256`}
                      />
                      <Button
                        color="primary"
                        radius="sm"
                        className="w-4/5"
                        startContent={<DownloadRoundedIcon />}
                        onClick={() => onImageDownload(product.productName)}
                      >
                        Scarica codice
                      </Button>
                    </div>
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
              isDisabled={enableSubmit() || isAddingProduct}
              onClick={handleSubmit}
              isLoading={isAddingProduct}
            >
              {isAddingProduct ? "Aggiornando..." : "Modifica prodotto"}{" "}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
