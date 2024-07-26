import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Avatar,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar } from "@mui/material";
import {
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Tooltip,
} from "@nextui-org/react";
import dayjs from "dayjs";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";
import { API_URL } from "../../API/API";

export default function AddDiscount() {
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [newDiscount, setNewDiscount] = useState({
    discountCode: null,
    discountType: "",
    discountValue: "",
    discountStart: 0,
    discountEnd: 0,
  });
  const [products, setProducts] = useState([]); // Stato per salvare i prodotti da assegnare allo sconto [
  const [isAssigned, setIsAssigned] = useState(1);
  const [assignedProducts, setAssignedProducts] = useState(new Set([]));
  const [startDateCompleted, setStartDateCompleted] = useState(false); // Nuovo stato per tracciare la compilazione della data di inizio
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [alreadyGeneraredCodes, setAlreadyGeneratedCodes] = useState([]);

  useEffect(() => {
    axios.get(API_URL + "/Discounts/GetProductWithoutDiscount").then((res) => {
      setProducts(res.data);
    });
    axios.get(API_URL + "/Discounts/GetAllCodes").then((res) => {
      setAlreadyGeneratedCodes(res.data);
    });
  }, []);

  function handleDiscountSwitch(e) {
    setNewDiscount({
      ...newDiscount,
      discountCode: null,
    });

    setAssignedProducts([]);

    setIsAssigned(e);
  }

  function handleDiscountCode(e) {
    const codeWithoutSpaces = e.target.value.replace(/\s/g, ""); // Rimuovi gli spazi dal valore inserito
    setNewDiscount({ ...newDiscount, discountCode: codeWithoutSpaces });
  }

  function handleKeyPressSpace(e) {
    if (e.key === " ") {
      // Se il tasto premuto è uno spazio
      e.preventDefault(); // Impedisci l'azione predefinita (inserimento dello spazio)
    }
  }

  function handleDiscountType(e) {
    setNewDiscount({
      ...newDiscount,
      discountType: e.target.value,
      discountValue: "",
    });
  }

  function handleKeyPress(e) {
    const value = e.target.value;
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    } else if (
      (e.key === "." && value.includes(".")) ||
      (parseFloat(value) >= 100 &&
        e.key !== "Backspace" &&
        newDiscount.discountType === "2")
    ) {
      e.preventDefault();
    }
  }

  function handlePercentValue(e) {
    let value = e.target.value.replace(/[^\d.,]/g, "");
    value = value.replace(",", ".");

    const numericValue = parseFloat(value);

    if (
      value === "" ||
      (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100)
    ) {
      setNewDiscount({ ...newDiscount, discountValue: value });
    }
  }

  function handleCurrencyValue(e) {
    let value = e.target.value.replace(/[^\d.]/g, "");
    const numericValue = parseFloat(value);

    if (value === "" || (!isNaN(numericValue) && numericValue >= 0)) {
      setNewDiscount({ ...newDiscount, discountValue: value });
    }
  }

  function handleDiscountStart(e) {
    const startDate = new Date(e.target.value);

    setNewDiscount({
      ...newDiscount,
      discountStart: dayjs(startDate).format("YYYY-MM-DD"),
    });

    // Impostiamo lo stato a true una volta che la data di inizio è stata inserita
    setStartDateCompleted(true);
  }

  function generateDiscountCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 16;

    let discountCode = "";

    // Funzione per generare un codice casuale
    const generateCode = () => {
      for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        discountCode += characters[randomIndex];
      }
      return discountCode;
    };

    // Controllo se il codice è già presente nell'array dei codici generati
    let isCodeUnique = false;

    while (!isCodeUnique) {
      discountCode = generateCode();

      isCodeUnique = !alreadyGeneraredCodes.includes(discountCode);
    }

    return discountCode;
  }

  function handleDiscountEnd(e) {
    if (!startDateCompleted) {
      console.log("Inserisci prima la data di inizio");
      return;
    }

    const endDate = new Date(e.target.value);
    const startDate = new Date(newDiscount.discountStart);

    if (dayjs(endDate).isAfter(dayjs(startDate))) {
      setNewDiscount({
        ...newDiscount,
        discountEnd: dayjs(endDate).format("YYYY-MM-DD"),
      });
    } else {
      console.log("La data di fine deve essere successiva a quella di inizio");
      return;
    }
  }

  function enableSubmit() {
    if (isAssigned === 1) {
      if (
        newDiscount.discountCode !== null &&
        newDiscount.discountType !== "" &&
        newDiscount.discountValue !== "" &&
        newDiscount.discountStart !== 0
      ) {
        return false; // Tutte le condizioni sono soddisfatte, quindi il submit è abilitato
      }
    } else {
      if (
        assignedProducts.size > 0 &&
        newDiscount.discountType !== "" &&
        newDiscount.discountValue !== "" &&
        newDiscount.discountStart !== 0
      ) {
        return false; // Tutte le condizioni sono soddisfatte, quindi il submit è abilitato
      }
    }
    return true; // Almeno una delle condizioni non è soddisfatta, quindi il submit è disabilitato
  }

  function backToDiscounts() {
    setAlertData({
      ...alertData,
      isOpen: true,
      variant: "warning",
      title: "Operazione annullata",
      message: "Il codice sconto non è stato aggiunto",
    });
    setTimeout(() => {
      window.location.href = "/discounts";
    }, 1000);
  }

  const handleAddDiscount = async () => {
    // Imposta il titolo e il messaggio della notifica
    setAlertData({
      ...alertData,
      isOpen: true,
      variant: "success",
      title: "Sconto aggiunto",
      message: "Il codice sconto è stato aggiunto con successo",
    });

    if (isAssigned === 1) {
      const data = {
        discountCode: newDiscount.discountCode,
        discountType: newDiscount.discountType,
        discountValue: newDiscount.discountValue,
        discountStart: newDiscount.discountStart,
        discountEnd: newDiscount.discountEnd,
      };

      try {
        const response = await axios.post(
          API_URL + "/Discounts/CreateDiscount",
          data
        );
        setIsAddingProduct(true);
        if (response.status === 201) {
          setTimeout(() => {
            window.location.href = "/discounts";
          }, 1000);
        }
      } catch (error) {
        console.error("Errore durante l'aggiunta dello sconto", error);
      }
    } else {
      const data = {
        discountCode: generateDiscountCode(),
        discountType: newDiscount.discountType,
        discountValue: newDiscount.discountValue,
        discountStart: newDiscount.discountStart,
        discountEnd: newDiscount.discountEnd,
        assignedProducts: [...assignedProducts],
      };

      try {
        const response = await axios.post(
          API_URL + "/Discounts/CreateDiscount",
          data
        );
        setIsAddingProduct(true);
        if (response.status === 201) {
          setTimeout(() => {
            window.location.href = "/discounts";
          }, 1000);
        }
      } catch (error) {
        console.error("Errore durante l'aggiunta dello sconto", error);
      }
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
          <BreadcrumbItem href="/discounts">Sconti</BreadcrumbItem>
          <BreadcrumbItem>Nuovo sconto</BreadcrumbItem>
        </Breadcrumbs>
        <h1 className="font-bold text-3xl">Nuovo sconto</h1>

        <form>
          <div className="space-y-12 sm:space-y-16">
            <div>
              <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Assegna sconto
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <RadioGroup
                      label="Seleziona un opzione"
                      defaultValue="1"
                      onValueChange={handleDiscountSwitch}
                    >
                      <Radio
                        value="1"
                        description="Crea un codice sconto da utilizzare al checkout"
                      >
                        Codice sconto
                      </Radio>
                      <Radio
                        value="2"
                        description="Assegna lo sconto a uno o più prodotti"
                      >
                        Prodotti
                      </Radio>
                    </RadioGroup>
                  </div>
                </div>
                {isAssigned < 2 ? (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Codice sconto
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <Input
                        variant="bordered"
                        placeholder="Codice sconto"
                        size="sm"
                        radius="sm"
                        className="lg:w-1/2"
                        onChange={handleDiscountCode}
                        onKeyDown={handleKeyPressSpace}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Prodotti
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <Select
                        variant="bordered"
                        radius="sm"
                        label="Seleziona prodotti"
                        selectionMode="multiple"
                        className="lg:w-1/2"
                        selectedKeys={assignedProducts}
                        onSelectionChange={setAssignedProducts}
                      >
                        {products.map((product) => (
                          <SelectItem
                            startContent={
                              <Avatar
                                src={
                                  API_URL +
                                  "/uploads/" +
                                  product.productImagePath
                                }
                                size="md"
                                radius="sm"
                              />
                            }
                            key={product.idProduct}
                            value={product.idProduct}
                          >
                            {product.productName}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Tipo sconto
                  </label>
                  <div className="mt-2 h-auto sm:col-span-1 sm:mt-0">
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Select
                        label="Tipologia codice sconto"
                        variant="bordered"
                        size="sm"
                        onChange={handleDiscountType}
                        selectedKeys={newDiscount.discountType}
                      >
                        <SelectItem key="1" value={"1"}>
                          Valuta
                        </SelectItem>
                        <SelectItem key="2" value={"2"}>
                          Percentuale
                        </SelectItem>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Valore
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <Input
                      type="text"
                      variant="bordered"
                      placeholder="0"
                      size="sm"
                      radius="sm"
                      className="lg:w-1/2"
                      value={newDiscount.discountValue}
                      onKeyDown={handleKeyPress}
                      endContent={newDiscount.discountType === "1" ? "€" : "%"}
                      isDisabled={newDiscount.discountType === ""}
                      onChange={
                        newDiscount.discountType === "1"
                          ? handleCurrencyValue
                          : handlePercentValue
                      }
                    />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Data inizio
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <Input
                      variant="bordered"
                      size="sm"
                      radius="sm"
                      className="lg:w-1/2"
                      type="date"
                      min="1900-01-01"
                      max="9999-12-31"
                      onChange={handleDiscountStart}
                    />
                  </div>
                </div>

                {startDateCompleted && ( // Mostreremo l'input per la data di fine solo se la data di inizio è stata inserita
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="first-name"
                      className="flex items-center gap-5 text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Data fine
                      <Tooltip
                        color="primary"
                        showArrow
                        className="p-3"
                        radius="sm"
                        content="Se il campo data viene lasciato vuoto il codice sconto durerà all'infinito"
                      >
                        <InfoOutlinedIcon color="primary" />
                      </Tooltip>
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <Input
                        variant="bordered"
                        size="sm"
                        radius="sm"
                        className="lg:w-1/2"
                        type="date"
                        min="1900-01-01"
                        max="9999-12-31"
                        value={newDiscount.discountEnd}
                        onChange={handleDiscountEnd}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center lg:justify-end gap-x-6">
            <button
              onClick={backToDiscounts}
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancella
            </button>
            <Button
              color="primary"
              radius="sm"
              isDisabled={enableSubmit()}
              onClick={handleAddDiscount}
              isLoading={isAddingProduct}
            >
              {isAddingProduct ? "Aggiungendo..." : "Aggiungi sconto"}{" "}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
