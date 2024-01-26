import React, { useState, useRef } from "react";
import { Button, Input, Avatar } from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar } from "@mui/material";
import { Select, SelectItem } from "@nextui-org/react";

export default function AddDiscount() {
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [newDiscount, setNewDiscount] = useState({
    discountCode: "",
    discountType: "",
    discountValue: "",
    discountStart: 0,
    discountEnd: 0,
  });

  function handleDiscountCode(e) {
    setNewDiscount({ ...newDiscount, discountCode: e.target.value });
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
    const value = new Date(e.target.value);
    setNewDiscount({ ...newDiscount, discountEnd: value });
  }

  function handleDiscountEnd(e) {
    const value = new Date(e.target.value);
    setNewDiscount({ ...newDiscount, discountEnd: value });
  }

  function enableSubmit() {
    const {
      discountCode,
      discountType,
      discountValue,
      discountStart,
      discountEnd,
    } = newDiscount;

    // Verifica se la data di inizio è compilata completamente e nel formato corretto (solo numeri)
    const isStartDateComplete = /^\d{4}-\d{2}-\d{2}$/.test(discountStart);

    // Verifica se la data di fine è compilata completamente (se presente) e nel formato corretto (solo numeri)
    const isEndDateComplete =
      !discountEnd || /^\d{4}-\d{2}-\d{2}$/.test(discountEnd);

    if (
      discountCode !== "" &&
      (discountType === 1 || discountType === 2) &&
      discountValue !== "" &&
      isStartDateComplete &&
      isEndDateComplete
    ) {
      return false; // Tutte le condizioni sono soddisfatte, quindi il submit è abilitato
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

  function handleAddDiscount() {
    // Imposta il titolo e il messaggio della notifica
    setAlertData({
      ...alertData,
      isOpen: true,
      variant: "success",
      title: "Sconto aggiunto",
      message: "Il codice sconto è stato aggiunto con successo",
    });

    const formData = new FormData();
    formData.append("discountCode", newDiscount.discountCode);
    formData.append("discountType", newDiscount.discountType);
    formData.append("discountValue", newDiscount.discountValue);
    formData.append("discountStart", newDiscount.discountStart);
    formData.append("discountEnd", newDiscount.discountEnd);

    formData.forEach((value, key) => {
      console.log(key + " " + value);
    });
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
                    />
                  </div>
                </div>

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

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Data fine
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
                      onChange={handleDiscountEnd}
                    />
                  </div>
                </div>
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
            >
              Aggiungi sconto
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
