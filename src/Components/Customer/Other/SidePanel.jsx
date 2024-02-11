import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Autocomplete, AutocompleteItem, Image } from "@nextui-org/react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import axios from "axios";
import { API_URL } from "../../../API/API";
import PhotoViewer from "./PhotoViewer";

export default function SidePanel({ open, setOpen }) {
  const [customer, setCustomer] = useState({});
  const [documentPhotos, setDocumetPhotos] = useState([]);
  const [openPhoto, setOpenPhoto] = useState(false);
  const status = [
    { idStatus: 1, statusName: "In attesa" },
    { idStatus: 2, statusName: "Non valido" },
    { idStatus: 3, statusName: "Valido" },
  ];
  useEffect(() => {
    console.log(open.customerId);
    axios
      .get(API_URL + "/Customer/GetCustomerById/" + open.customerId)
      .then((res) => {
        setCustomer(res.data);
      });
    axios
      .get(API_URL + "/Customer/GetImagesByCustomerId/" + open.customerId)
      .then((res) => {
        setDocumetPhotos(res.data);
      });
  }, [open.open, open.customerId]);

  return (
    <Transition.Root show={open.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setOpen({ ...open, open: false, customerId: 0 })}
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
                                selectedKey={String(customer.idStatus)}
                              >
                                {status.map((item) => (
                                  <AutocompleteItem
                                    key={item.idStatus}
                                    value={item.idStatus}
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
                        </dl>
                      </div>
                    </div>
                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Create
                        </button>
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
