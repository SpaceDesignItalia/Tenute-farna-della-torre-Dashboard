import React from "react";

export default function TrackingLinkModal(isOpen) {
  return (
    <Modal
      isOpen={isLinkModalOpen}
      onClose={closeLinkModal}
      aria-labelledby="link-modal-title"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 id="link-modal-title">
            Inserisci Link di Tracciamento all'ordine {selectedOrder.idOrder}
          </h3>
        </ModalHeader>
        <ModalBody>
          <Input
            placeholder="Inserisci il link di tracciamento"
            variant="bordered"
            size="lg"
            value={trackingLink}
            onChange={(e) => setTrackingLink(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button auto onClick={closeLinkModal}>
            Annulla
          </Button>
          <Button
            color="primary"
            auto
            onClick={handleAddTrackingLink(selectedOrder.idOrder)}
            disabled={!trackingLink.trim()}
          >
            Conferma
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
