import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function DeleteModal({ user }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        radius="sm"
        color="danger"
        startContent={<DeleteRoundedIcon />}
        fullWidth
      >
        Cancella account
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="rounded-md bg-red-50 p-4">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col font-bold text-xl gap-1 text-red-800">
                Cancella l'account di: <br /> {user.name + " " + user.surname}
              </ModalHeader>
              <ModalBody>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CancelRoundedIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800">
                      Conferma cancellazione dell'account
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul role="list" className="list-disc space-y-1 pl-5">
                        <li>
                          L'utente sarà avvisato tramite email della
                          cancellazione del suo profilo.
                        </li>
                        <li>
                          Tutti i dati dell'account saranno eliminati
                          permanentemente.
                        </li>
                        <li>
                          Non sarà possibile ripristinare l'account una volta
                          cancellato.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  radius="sm"
                  variant="light"
                  onPress={onClose}
                >
                  Annulla
                </Button>
                <Button color="primary" radius="sm" onPress={onClose}>
                  Sono sicuro
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
