import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import axios from "axios";
import { API_URL } from "../../API/API";
import { Chip, Spinner } from "@nextui-org/react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: DashboardOutlinedIcon,
    subRoutes: [], // Aggiungi le sottoroute qui se necessario
  },
  {
    name: "Prodotti",
    href: "/products",
    icon: Inventory2OutlinedIcon,
    subRoutes: [
      "/products/add-product",
      "/products/visualize-product/",
      "/products/add-product-in-featured",
      "/products/edit-product/",
    ], // Esempio di sottoroute
  },
  {
    name: "Sconti",
    href: "/discounts",
    icon: DiscountOutlinedIcon,
    subRoutes: ["/discounts/add-discount", "/discounts/visualize-discount/"], // Aggiungi le sottoroute qui se necessario
  },
  {
    name: "Clienti",
    href: "/customers",
    icon: PeopleAltOutlinedIcon,
    subRoutes: [], // Aggiungi le sottoroute qui se necessario
  },
];

function isSubRoute(currentUrl, parentRoutes) {
  return parentRoutes.some((parentRoute) => {
    // Controlla se l'URL attuale corrisponde al percorso principale
    if (currentUrl === parentRoute.href) {
      return true;
    }
    // Controlla se l'URL attuale è una sottoroute del percorso principale
    if (parentRoute.subRoutes && parentRoute.subRoutes.length > 0) {
      return parentRoute.subRoutes.some((subRoute) =>
        currentUrl.startsWith(subRoute)
      );
    }
    return false;
  });
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const [userData, setUserData] = useState({
    id: 0,
    name: "",
    surname: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("/");
  const [usersNumber, setUsersNumber] = useState(0);
  const location = useLocation();

  useEffect(() => {
    axios
      .get(API_URL + "/Staffer/GetStafferData", { withCredentials: true })
      .then((res) => {
        setUserData({
          ...userData,
          id: res.data.staffer.id,
          name: res.data.staffer.name,
          surname: res.data.staffer.surname,
        });
      });

    axios.get(API_URL + "/Analytic/GetUsersToVerify").then((res) => {
      console.log(res.data);
      setUsersNumber(res.data[0].UsersNumber);
    });

    setCurrentUrl(location.pathname);
  }, [location.pathname]);

  function isSubRoute(currentUrl, parentRoutes) {
    return parentRoutes.some((parentRoute) => {
      // Controlla se l'URL attuale corrisponde al percorso principale
      if (currentUrl === parentRoute) {
        return true;
      }
      // Controlla se l'URL attuale è una sottoroute del percorso principale
      if (parentRoute.subRoutes && parentRoute.subRoutes.length > 0) {
        return parentRoute.subRoutes.some((subRoute) =>
          currentUrl.startsWith(subRoute)
        );
      }
      return false;
    });
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <CloseOutlinedIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 ring-1 ring-white/10 bg-white">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-12 w-auto"
                        src={Logo}
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    isSubRoute(currentUrl, [item]) ||
                                      currentUrl === item.href // Verifica se è una sottoroute del percorso principale
                                      ? "bg-gray-100 text-primary font-bold"
                                      : "text-gray-700 hover:text-primary hover:bg-gray-100",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                  {item.name == "Clienti" &&
                                    usersNumber !== 0 && (
                                      <Chip
                                        color="primary"
                                        variant="flat"
                                        radius="sm"
                                      >
                                        {usersNumber}
                                      </Chip>
                                    )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                        <a
                          href="/settings"
                          className="group block w-full flex-shrink-0"
                        >
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                {userData.name && userData.surname ? (
                                  userData.name + " " + userData.surname
                                ) : (
                                  <Spinner />
                                )}
                              </p>
                              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                                Visualizza profilo
                              </p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img className="h-12 w-auto" src={Logo} alt="Your Company" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            isSubRoute(currentUrl, [item]) ||
                              currentUrl === item.href
                              ? "bg-gray-100 text-primary font-bold"
                              : "text-gray-700 hover:text-primary hover:bg-gray-100",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                          {item.name == "Clienti" && usersNumber !== 0 && (
                            <Chip color="primary" variant="flat" radius="sm">
                              {usersNumber}
                            </Chip>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
              <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                <a
                  href="/settings"
                  className="group block w-full flex-shrink-0"
                >
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {userData.name && userData.surname ? (
                          userData.name + " " + userData.surname
                        ) : (
                          <Spinner />
                        )}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        Visualizza profilo
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </nav>
          </div>
        </div>

        <div className="lg:hidden lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuOutlinedIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
