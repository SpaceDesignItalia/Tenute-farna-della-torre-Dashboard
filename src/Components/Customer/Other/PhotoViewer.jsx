import { Fragment, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RotateRightOutlinedIcon from "@mui/icons-material/RotateRightOutlined";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import { API_URL } from "../../../API/API";
import { motion, AnimatePresence } from "framer-motion";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PhotoViewer({ open, image, setOpen }) {
  const [rotation, setRotation] = useState(0); // Aggiungi stato per tenere traccia della rotazione

  // Funzione per ruotare la foto
  const rotateImage = (degrees) => {
    const newRotation = rotation + degrees;
    // Limita la rotazione ai valori consentiti da Tailwind
    const validRotations = [0, 45, 90, 180, -45, -90, -180];
    const closestValidRotation = validRotations.reduce((prev, curr) => {
      return Math.abs(curr - newRotation) < Math.abs(prev - newRotation)
        ? curr
        : prev;
    });
    setRotation(closestValidRotation);
  };

  function handleClose() {
    setOpen(false);
    setRotation(0);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75"
        >
          <Dialog as="div" className="relative z-50" onClose={handleClose}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative flex w-full justify-center items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={handleClose}
                    >
                      <span className="sr-only">Close</span>
                      <CloseOutlinedIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>

                    <div className="flex flex-col">
                      <div className="flex flex-col justify-center items-center gap-5 p-10">
                        <motion.img
                          src={API_URL + "/Documents/" + image}
                          className="object-cover object-center w-1/2"
                          animate={{ rotate: rotation }}
                          transition={{
                            ease: "linear",
                            duration: 0.2,
                            x: { duration: 1 },
                          }}
                        />

                        <div className="mt-4 flex justify-center space-x-4">
                          {/* Pulsante per ruotare a sinistra */}
                          <Button
                            isIconOnly
                            color="primary"
                            radius="sm"
                            onClick={() => rotateImage(-90)}
                          >
                            <RotateLeftOutlinedIcon />
                          </Button>
                          {/* Pulsante per ruotare a destra */}
                          <Button
                            isIconOnly
                            color="primary"
                            radius="sm"
                            onClick={() => rotateImage(90)}
                          >
                            <RotateRightOutlinedIcon />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
