import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Image,
} from "@nextui-org/react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import axios from "axios";
import { API_URL } from "../../../API/API";
import PhotoViewer from "./PhotoViewer";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SidePanel({ open, setOpen }) {
  const [customer, setCustomer] = useState({});
  const [documentPhotos, setDocumetPhotos] = useState([]);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); // State for selected status
  const [pendingStatus, setPendingStatus] = useState(false); // State for pending status changes

  const status = [
    {
      idStatus: 1,
      statusName: "In attesa",
      style: "text-orange-400 bg-orange-400/10",
    },
    {
      idStatus: 2,
      statusName: "Non valido",
      style: "text-rose-400 bg-rose-400/10",
    },
    {
      idStatus: 3,
      statusName: "Valido",
      style: "text-green-400 bg-green-400/10",
    },
  ];

  useEffect(() => {
    console.log(open.customerId);
    axios
      .get(API_URL + "/Customer/GetCustomerById/" + open.customerId)
      .then((res) => {
        setCustomer(res.data);
        setSelectedStatus(res.data.idStatus); // Set selected status when customer data is fetched
      });
    axios
      .get(API_URL + "/Customer/GetImagesByCustomerId/" + open.customerId)
      .then((res) => {
        setDocumetPhotos(res.data);
      });
  }, [open.open, open.customerId]);

  // Function to handle status change
  function handleChangeStatus(newStatusId) {
    setSelectedStatus(newStatusId); // Store the pending status change locally
  }

  const handleSaveStatus = async () => {
    // Imposta il titolo e il messaggio della notifica

    try {
      const response = await axios.put(
        API_URL + "/Customer/UpdateStatus/" + open.customerId,
        { idStatus: selectedStatus }
      );
      setPendingStatus(true);
      if (response.status === 200) {
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Errore durante la modifica dello stato", error);
    }
  };

  function handleDisable() {
    if (selectedStatus === null) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <Transition.Root show={open.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setOpen({ ...open, open: false })}
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2
                          id="slide-over-heading"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Gestione Cliente
                        </h2>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2"
                            onClick={() => setOpen({ ...open, open: false })}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <CloseOutlinedIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div>
                      <div className="pb-1 sm:pb-6">
                        <div>
                          <div className="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
                            <div className="sm:flex-1">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                    {customer.name + " " + customer.surname}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-5 pt-5 sm:px-0 sm:pt-0">
                        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {customer.mail}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Telefono
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {customer.phone}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Status Account
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              <Autocomplete
                                variant="bordered"
                                size="sm"
                                radius="sm"
                                aria-labelledby="Status List"
                                selectedKey={String(selectedStatus)} // Use selectedStatus state
                                onSelectionChange={(newStatusId) =>
                                  handleChangeStatus(newStatusId)
                                } // Call handleChangeStatus on change
                              >
                                {status.map((item) => (
                                  <AutocompleteItem
                                    key={item.idStatus}
                                    value={item.idStatus}
                                    startContent={
                                      <div
                                        className={classNames(
                                          item.style,
                                          "flex-none rounded-full p-1"
                                        )}
                                      >
                                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                      </div>
                                    }
                                  >
                                    {item.statusName}
                                  </AutocompleteItem>
                                ))}
                              </Autocomplete>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Documento
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {customer.documentType}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Foto documento
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {documentPhotos.map((image) => {
                                return (
                                  <>
                                    <Image
                                      className="cursor-pointer"
                                      src={
                                        API_URL +
                                        "/Documents/" +
                                        image.documentPath
                                      }
                                      width={200}
                                      onClick={() => setOpenPhoto(true)}
                                    />
                                    <PhotoViewer
                                      open={openPhoto}
                                      setOpen={setOpenPhoto}
                                      image={image}
                                    />
                                  </>
                                );
                              })}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                              Documento
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {customer.documentType}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        <Button
                          color="danger"
                          variant="bordered"
                          radius="sm"
                          onClick={() => setOpen({ ...open, open: false })}
                        >
                          Cancella
                        </Button>
                        <Button
                          color="primary"
                          radius="sm"
                          isLoading={pendingStatus}
                          isDisabled={handleDisable()}
                          onClick={handleSaveStatus} // Call handleSaveStatus on click
                        >
                          Salva
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
