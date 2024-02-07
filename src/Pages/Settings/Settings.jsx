import { useEffect, useState } from "react";
import { Tabs, Tab, Spinner, Input, Button } from "@nextui-org/react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../API/API";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings() {
  const tabs = [
    { name: "Account", content: <GeneralSettings /> },
    { name: "Password", content: <ManagePassword /> },
  ];

  return (
    <div>
      <div className="py-10 p-10 lg:pl-unit-80">
        <main className="flex-1">
          <div className="relative mx-auto max-w-4xl">
            <div className="pb-16 pt-10">
              <div className="px-4 sm:px-6 lg:px-0">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Impostazioni
                </h1>
              </div>
              <div className="px-4 sm:px-6 lg:px-0">
                <div className="py-6">
                  {/* Tabs */}
                  <Tabs variant="underlined" color="primary" size="lg">
                    {tabs.map((tab) => (
                      <Tab key={tab.name} title={tab.name}>
                        {tab.content}
                      </Tab>
                    ))}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function GeneralSettings() {
  const [data, setData] = useState({
    id: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
  });
  const [oldData, setOldData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState({
    name: false,
    surname: false,
    email: false,
    phone: false,
  });
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [isUpdatingData, setIsUpdatingData] = useState(false);

  useEffect(() => {
    axios
      .get(API_URL + "/Staffer/GetStafferData", { withCredentials: true })
      .then((res) => {
        setData({
          ...data,
          id: res.data.staffer.id,
          name: res.data.staffer.name,
          surname: res.data.staffer.surname,
          email: res.data.staffer.email,
          phone: res.data.staffer.phone,
        });
        setOldData({
          ...oldData,
          name: res.data.staffer.name,
          surname: res.data.staffer.surname,
          email: res.data.staffer.email,
          phone: res.data.staffer.phone,
        });
      });
  }, []);

  function handleResetData(value) {
    setIsEditing({ ...isEditing, [value]: false });
    setData({ ...data, [value]: oldData[value] });
  }

  function handleChangeName(e) {
    if (e.target.value === "") {
      setData({ ...data, name: oldData.name });
    } else {
      setData({ ...data, name: e.target.value });
    }
  }
  function handleChangeSurname(e) {
    if (e.target.value === "") {
      setData({ ...data, surname: oldData.surname });
    } else {
      setData({ ...data, surname: e.target.value });
    }
  }
  function handleChangeEmail(e) {
    if (e.target.value === "") {
      setData({ ...data, email: oldData.email });
    } else {
      setData({ ...data, email: e.target.value });
    }
  }
  function handleChangePhone(e) {
    if (e.target.value === "") {
      setData({ ...data, phone: oldData.phone });
    } else {
      setData({ ...data, phone: e.target.value });
    }
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

  function enableSubmit() {
    if (
      data.name !== oldData.name ||
      data.surname !== oldData.surname ||
      data.email !== oldData.email ||
      data.phone !== oldData.phone
    ) {
      return false;
    }
    return true;
  }

  const handleUpdateData = async () => {
    setAlertData({
      ...alertData,
      isOpen: true,
      variant: "success",
      title: "Dati aggiornati",
      message: "I dati sono stati aggiornati correttamente",
    });

    try {
      const response = await axios.put(
        API_URL + "/Staffer/UpdateStafferData",
        {
          id: data.id,
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
        },
        { withCredentials: true }
      );
      setIsUpdatingData(true);
      if (response.status === 200) {
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto", error);
    }
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

      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Profilo
          </h3>
          <p className="max-w-2xl text-sm text-gray-500">
            Modifica le tue impostazioni personali.
          </p>
        </div>
        <div className="mt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 items-center">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                {isEditing.name ? (
                  <>
                    <span className="flex-grow">
                      <Input
                        variant="bordered"
                        placeholder="Inserisci il nuovo nome"
                        size="sm"
                        radius="sm"
                        className="w-full lg:w-1/2"
                        onChange={handleChangeName}
                      />
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-danger hover:text-danger"
                        onClick={() => handleResetData("name")}
                      >
                        Annulla
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">
                      {data.name ? data.name : <Spinner />}
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-primary hover:text-primary"
                        onClick={() =>
                          setIsEditing({ ...isEditing, name: true })
                        }
                      >
                        Aggiorna
                      </button>
                    </span>
                  </>
                )}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Cognome</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                {isEditing.surname ? (
                  <>
                    <span className="flex-grow">
                      <Input
                        variant="bordered"
                        placeholder="Inserisci il nuovo cognome"
                        size="sm"
                        radius="sm"
                        className="w-full lg:w-1/2"
                        onChange={handleChangeSurname}
                      />
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-danger hover:text-danger"
                        onClick={() => handleResetData("surname")}
                      >
                        Annulla
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">
                      {data.surname ? data.surname : <Spinner />}
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-primary hover:text-primary"
                        onClick={() =>
                          setIsEditing({ ...isEditing, surname: true })
                        }
                      >
                        Aggiorna
                      </button>
                    </span>
                  </>
                )}
              </dd>
            </div>

            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                {isEditing.email ? (
                  <>
                    <span className="flex-grow">
                      <Input
                        type="email"
                        variant="bordered"
                        placeholder="Inserisci la nuova email"
                        size="sm"
                        radius="sm"
                        className="w-full lg:w-1/2"
                        onChange={handleChangeEmail}
                      />
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-danger hover:text-danger"
                        onClick={() => handleResetData("email")}
                      >
                        Annulla
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">
                      {data.email ? data.email : <Spinner />}
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-primary hover:text-primary"
                        onClick={() =>
                          setIsEditing({ ...isEditing, email: true })
                        }
                      >
                        Aggiorna
                      </button>
                    </span>
                  </>
                )}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Telefono</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                {isEditing.phone ? (
                  <>
                    <span className="flex-grow">
                      <Input
                        variant="bordered"
                        placeholder="Inserisci il nuovo numero di telefono"
                        size="sm"
                        radius="sm"
                        className="w-full lg:w-1/2"
                        onChange={handleChangePhone}
                      />
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-danger hover:text-danger"
                        onClick={() => handleResetData("phone")}
                      >
                        Annulla
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">
                      {data.phone ? data.phone : <Spinner />}
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="rounded-md bg-white font-medium text-primary hover:text-primary"
                        onClick={() =>
                          setIsEditing({ ...isEditing, phone: true })
                        }
                      >
                        Aggiorna
                      </button>
                    </span>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center lg:justify-end gap-x-6">
        <Button
          color="primary"
          radius="sm"
          isDisabled={enableSubmit()}
          onClick={handleUpdateData}
          isLoading={isUpdatingData}
        >
          {isUpdatingData ? "Aggiornamento in corso" : "Salva modifiche"}
        </Button>
      </div>
    </>
  );
}

function ManagePassword() {
  const [data, setData] = useState({
    id: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [isUpdatingData, setIsUpdatingData] = useState(false);

  useEffect(() => {
    axios
      .get(API_URL + "/Staffer/GetStafferData", { withCredentials: true })
      .then((res) => {
        setData({ ...data, id: res.data.staffer.id });
      });
  }, []);

  function handleChangeOldPassword(e) {
    setData({ ...data, oldPassword: e.target.value });
  }
  function handleChangeNewPassword(e) {
    setData({ ...data, newPassword: e.target.value });
  }
  function handleChangeConfirmPassword(e) {
    setData({ ...data, confirmPassword: e.target.value });
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

  function equalPassword() {
    if (data.oldPassword !== "" && data.newPassword !== "") {
      if (data.oldPassword === data.newPassword) {
        return true;
      }
      return false;
    }
  }

  function enableSubmit() {
    if (data.oldPassword !== "" && data.newPassword === data.confirmPassword) {
      return false;
    }
    return true;
  }

  const handleUpdateData = async () => {
    setAlertData({
      ...alertData,
      isOpen: true,
      variant: "success",
      title: "Dati aggiornati",
      message: "I dati sono stati aggiornati correttamente",
    });

    try {
      const response = await axios.put(
        API_URL + "/Staffer/UpdateStafferPassword",
        {
          id: data.id,
          password: data.newPassword,
        },
        { withCredentials: true }
      );
      setIsUpdatingData(true);
      if (response.status === 200) {
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto", error);
    }
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

      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Password
          </h3>
          <p className="max-w-2xl text-sm text-gray-500">
            Modifica la tua password.
          </p>
        </div>
        <div className="mt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">
                Vecchia password
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                <span className="flex-grow">
                  <Input
                    type="password"
                    variant="bordered"
                    placeholder="Inserisci la vecchia password"
                    size="sm"
                    radius="sm"
                    className="w-full lg:w-1/2"
                    onChange={handleChangeOldPassword}
                  />
                </span>
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Nuova password
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                <span className="flex-grow">
                  <Input
                    type="password"
                    variant="bordered"
                    placeholder="Inserisci la nuova password"
                    size="sm"
                    radius="sm"
                    className="w-full lg:w-1/2"
                    onChange={handleChangeNewPassword}
                    color={equalPassword() ? "danger" : null}
                    errorMessage={
                      equalPassword()
                        ? "La nuova password non può essere uguale a quella vecchia"
                        : ""
                    }
                  />
                </span>
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Conferma password
              </dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                <span className="flex-grow">
                  <Input
                    type="password"
                    variant="bordered"
                    placeholder="Conferma la nuova password"
                    size="sm"
                    radius="sm"
                    className="w-full lg:w-1/2"
                    onChange={handleChangeConfirmPassword}
                    isDisabled={equalPassword()}
                  />
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center lg:justify-end gap-x-6">
        <Button
          color="primary"
          radius="sm"
          isDisabled={enableSubmit()}
          onClick={handleUpdateData}
          isLoading={isUpdatingData}
        >
          {isUpdatingData ? "Aggiornamento in corso" : "Salva modifiche"}
        </Button>
      </div>
    </>
  );
}
