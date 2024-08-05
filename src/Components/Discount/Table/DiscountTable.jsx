import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar } from "@mui/material";
import dayjs from "dayjs";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import axios from "axios";
import { API_URL } from "../../../API/API";

const columns = [
  { name: "ID Ordine", uid: "idOrder", sortable: true },
  { name: "Cliente", uid: "customerName", sortable: true },
  { name: "Totale", uid: "total", sortable: true },
  { name: "Pagamento", uid: "paid", sortable: true },
  { name: "Spedito", uid: "shipped", sortable: true },
  { name: "Data Creazione", uid: "createdDatetime", sortable: true },
  { name: "Opzioni", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "idOrder",
  "customerName",
  "total",
  "paid",
  "shipped",
  "createdDatetime",
  "actions",
];

export default function OrderTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "idOrder",
    direction: "ascending",
  });
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingLink, setTrackingLink] = useState("");

  useEffect(() => {
    if (filterValue) {
      fetchOrderById(filterValue);
    } else {
      fetchOrders();
    }
  }, [filterValue]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data: ordersData } = await axios.get(
        `${API_URL}/Order/GetAllOrders`
      );

      const enhancedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const { data: customerData } = await axios.get(
            `${API_URL}/Customer/GetCustomerById/${order.idCustomer}`
          );
          const { data: paymentData } = await axios.get(
            `${API_URL}/Payment/GetCheckoutDetails`,
            { params: { idPayment: order.idPayment } }
          );
          const { data: addressData } = await axios.get(
            `${API_URL}/Customer/GetShippingInfoById/${order.idShippingDetail}`
          );
          const { data: productData } = await axios.get(
            `${API_URL}/Order/GetProductsByIdOrder`,
            { params: { idOrder: order.idOrder } }
          );

          return {
            ...order,
            customerName: `${customerData.name} ${customerData.surname}`,
            address: `${addressData.address} ${addressData.civicNumber} ${addressData.city} ${addressData.cap} ${addressData.province} ${addressData.nation}`,
            total: productData.reduce(
              (acc, product) => acc + product.price * product.amount,
              0
            ),
            products: productData,
            paid: paymentData.paid,
          };
        })
      );

      setOrders(enhancedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderById = async (id) => {
    setIsLoading(true);
    try {
      const { data: orderData } = await axios.get(
        `${API_URL}/Order/GetOrderById`,
        { params: { idOrder: id } }
      );

      if (!orderData || orderData.length === 0) {
        setOrders([]);
      } else {
        const order = orderData[0];
        const { data: customerData } = await axios.get(
          `${API_URL}/Customer/GetCustomerById/${order.idCustomer}`
        );
        const { data: paymentData } = await axios.get(
          `${API_URL}/Payment/GetCheckoutDetails`,
          { params: { idPayment: order.idPayment } }
        );
        const { data: addressData } = await axios.get(
          `${API_URL}/Customer/GetShippingInfoById/${order.idShippingDetail}`
        );
        const { data: productData } = await axios.get(
          `${API_URL}/Order/GetProductsByIdOrder`,
          { params: { idOrder: order.idOrder } }
        );

        const enhancedOrder = {
          ...order,
          customerName: `${customerData.name} ${customerData.surname}`,
          address: `${addressData.address} ${addressData.civicNumber} ${addressData.city} ${addressData.cap} ${addressData.province} ${addressData.nation}`,
          total: productData.reduce(
            (acc, product) => acc + product.price * product.amount,
            0
          ),
          products: productData,
          paid: paymentData.paid,
        };

        setOrders([enhancedOrder]);
      }
    } catch (error) {
      console.error("Error fetching order by ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(
    () =>
      visibleColumns === "all"
        ? columns
        : columns.filter((column) => visibleColumns.has(column.uid)),
    [visibleColumns]
  );

  const pages = Math.ceil(orders.length / rowsPerPage);

  const items = useMemo(
    () => orders.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [page, orders, rowsPerPage]
  );

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const cmp =
          a[sortDescriptor.column] < b[sortDescriptor.column]
            ? -1
            : a[sortDescriptor.column] > b[sortDescriptor.column]
            ? 1
            : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }),
    [sortDescriptor, items]
  );

  const searchOrder = useCallback((value) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${API_URL}/Order/DeleteOrder`, {
        params: { idOrder: id },
      });
      setAlertData({
        isOpen: true,
        variant: "success",
        title: "Ordine rimosso",
        message: "L'ordine è stato rimosso con successo!",
      });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleClose = () => {
    setAlertData((prev) => ({ ...prev, isOpen: false }));
  };

  const openModal = (order) => {
    setIsModalOpen(true);
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const openLinkModal = (order) => {
    setIsLinkModalOpen(true);
    setSelectedOrder(order);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setSelectedOrder(null);
    setTrackingLink("");
  };

  const handleAddTrackingLink = async () => {
    try {
      await axios.put(`${API_URL}/Order/UpdateTrackingLink`, {
        idOrder: selectedOrder.idOrder,
        trackingLink: trackingLink,
      });
      setAlertData({
        isOpen: true,
        variant: "success",
        title: "Link Tracciamento Aggiornato",
        message: "Il link di tracciamento è stato aggiunto con successo!",
      });
      fetchOrders();
      closeLinkModal();
    } catch (error) {
      console.error("Error adding tracking link:", error);
    }
  };

  const renderCell = useCallback(
    (order, columnKey) => {
      switch (columnKey) {
        case "idOrder":
          return order.idOrder;
        case "customerName":
          return order.customerName;
        case "total":
          return `€${order.total.toFixed(2)}`;
        case "paid":
          return order.paid ? "Pagato" : "Non Pagato";
        case "shipped":
          return order.shipped ? "Spedito" : "Non Spedito";
        case "createdDatetime":
          return dayjs(order.createdDatetime).format("DD/MM/YYYY HH:mm");
        case "actions":
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button auto size="sm" onClick={() => openModal(order)}>
                <RemoveRedEyeOutlinedIcon />
              </Button>
              <Button auto size="sm" onClick={() => openLinkModal(order)}>
                <InsertLinkOutlinedIcon />
              </Button>
              <Button
                auto
                color="error"
                size="sm"
                onClick={() => deleteOrder(order.idOrder)}
              >
                <DeleteOutlineRoundedIcon />
              </Button>
            </div>
          );
        default:
          return null;
      }
    },
    [openModal, openLinkModal, deleteOrder]
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Input
          placeholder="Cerca per ID Ordine"
          value={filterValue}
          onChange={(e) => searchOrder(e.target.value)}
          endContent={<SearchRoundedIcon />}
        />
        <Button auto color="primary" onClick={() => fetchOrders()}>
          Ricarica
        </Button>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Table aria-label="Ordini">
            <TableHeader>
              {headerColumns.map((column) => (
                <TableColumn
                  key={column.uid}
                  sortDirection={
                    sortDescriptor.column === column.uid
                      ? sortDescriptor.direction
                      : undefined
                  }
                >
                  {column.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {sortedItems.map((order) => (
                <TableRow key={order.idOrder}>
                  {headerColumns.map((column) => (
                    <TableCell key={column.uid}>
                      {renderCell(order, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            totalPages={pages}
            onPageChange={(page) => setPage(page)}
            page={page}
          />
        </>
      )}
      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalHeader>Dettagli Ordine</ModalHeader>
        <ModalBody>
          {selectedOrder && (
            <div>
              <h4>ID Ordine: {selectedOrder.idOrder}</h4>
              <p>Cliente: {selectedOrder.customerName}</p>
              <p>Totale: €{selectedOrder.total.toFixed(2)}</p>
              <p>Pagamento: {selectedOrder.paid ? "Pagato" : "Non Pagato"}</p>
              <p>
                Spedito: {selectedOrder.shipped ? "Spedito" : "Non Spedito"}
              </p>
              <p>
                Data Creazione:{" "}
                {dayjs(selectedOrder.createdDatetime).format(
                  "DD/MM/YYYY HH:mm"
                )}
              </p>
              <p>Indirizzo: {selectedOrder.address}</p>
              <p>Prodotti:</p>
              <ul>
                {selectedOrder.products.map((product) => (
                  <li key={product.idProduct}>
                    {product.name} - {product.amount} x €
                    {product.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button auto onClick={closeModal}>
            Chiudi
          </Button>
        </ModalFooter>
      </Modal>
      <Modal open={isLinkModalOpen} onClose={closeLinkModal}>
        <ModalHeader>Aggiungi Link di Tracciamento</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Inserisci link di tracciamento"
            value={trackingLink}
            onChange={(e) => setTrackingLink(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button auto onClick={handleAddTrackingLink}>
            Aggiungi
          </Button>
          <Button auto onClick={closeLinkModal}>
            Annulla
          </Button>
        </ModalFooter>
      </Modal>
      <Snackbar
        open={alertData.isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alertData.variant}>
          <AlertTitle>{alertData.title}</AlertTitle>
          {alertData.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
