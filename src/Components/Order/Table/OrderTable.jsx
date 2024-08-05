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
      const ordersResponse = await axios.get(`${API_URL}/Order/GetAllOrders`);
      const ordersData = ordersResponse.data;

      const enhancedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const customerResponse = await axios.get(
            `${API_URL}/Customer/GetCustomerById/${order.idCustomer}`
          );
          const paymentResponse = await axios.get(
            `${API_URL}/Payment/GetCheckoutDetails`,
            {
              params: { idPayment: order.idPayment },
            }
          );
          const addressResponse = await axios.get(
            `${API_URL}/Customer/GetShippingInfoById/${order.idShippingDetail}`
          );
          const productResponse = await axios.get(
            `${API_URL}/Order/GetProductsByIdOrder`,
            {
              params: { idOrder: order.idOrder },
            }
          );

          return {
            ...order,
            customerName: `${customerResponse.data.name} ${customerResponse.data.surname}`,
            address: `${addressResponse.data.address} ${addressResponse.data.civicNumber} ${addressResponse.data.city} ${addressResponse.data.cap} ${addressResponse.data.province} ${addressResponse.data.nation}`,
            total: productResponse.data.reduce(
              (acc, product) => acc + product.price * product.amount,
              0
            ),
            products: productResponse.data,
            paid: paymentResponse.data.paid,
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
      const orderResponse = await axios.get(`${API_URL}/Order/GetOrderById`, {
        params: { idOrder: id },
      });

      if (!orderResponse || !orderResponse.data) {
        throw new Error("Invalid response format");
      }

      if (orderResponse.data.length === 0) {
        setOrders([]);
      } else {
        const order = orderResponse.data[0];
        const customerResponse = await axios.get(
          `${API_URL}/Customer/GetCustomerById/${order.idCustomer}`
        );
        const paymentResponse = await axios.get(
          `${API_URL}/Payment/GetCheckoutDetails`,
          {
            params: { idPayment: order.idPayment },
          }
        );
        const addressResponse = await axios.get(
          `${API_URL}/Customer/GetShippingInfoById/${order.idShippingDetail}`
        );
        const productResponse = await axios.get(
          `${API_URL}/Order/GetProductsByIdOrder`,
          {
            params: { idOrder: order.idOrder },
          }
        );

        const enhancedOrder = {
          ...order,
          customerName: `${customerResponse.data.name} ${customerResponse.data.surname}`,
          address: `${addressResponse.data.address} ${addressResponse.data.civicNumber} ${addressResponse.data.city} ${addressResponse.data.cap} ${addressResponse.data.province} ${addressResponse.data.nation}`,
          total: productResponse.data.reduce(
            (acc, product) => acc + product.price * product.amount,
            0
          ),
          products: productResponse.data,
          paid: paymentResponse.data.paid,
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

  const renderCell = useCallback((order, columnKey) => {
    switch (columnKey) {
      case "idOrder":
        return <div>{order.idOrder}</div>;
      case "customerName":
        return <div>{order.customerName}</div>;
      case "address":
        return <div>{order.address}</div>;
      case "total":
        return <div>{order.total} €</div>;
      case "paid":
        return (
          <div>
            {order.paid ? (
              <Chip color="success" className="text-white" size="sm">
                Effettuato
              </Chip>
            ) : (
              <Chip color="error" size="sm">
                Non Effettuato
              </Chip>
            )}
          </div>
        );
      case "createdDatetime":
        return <div>{dayjs(order.createdDatetime).format("DD/MM/YYYY")}</div>;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  startContent={<RemoveRedEyeOutlinedIcon />}
                  onClick={() => openModal(order)}
                >
                  Visualizza
                </DropdownItem>
                <DropdownItem
                  startContent={<InsertLinkOutlinedIcon />}
                  onClick={() => openLinkModal(order)}
                >
                  Inserisci link tracciamento
                </DropdownItem>
                {!order.paid && (
                  <DropdownItem
                    className="text-danger"
                    color="danger"
                    onClick={() => deleteOrder(order.idOrder)}
                    startContent={<DeleteOutlineRoundedIcon />}
                  >
                    Elimina
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return <div>{order[columnKey]}</div>;
    }
  }, []);

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-3 lg:items-end">
          <Input
            className="lg:w-1/3"
            placeholder="Cerca per ID Ordine"
            variant="bordered"
            size="sm"
            startContent={<SearchRoundedIcon />}
            onChange={(e) => searchOrder(e.target.value)}
          />
        </div>
      </div>
    ),
    [searchOrder]
  );

  const bottomContent = useMemo(
    () => (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages || 1}
          onChange={setPage}
        />
      </div>
    ),
    [page, pages]
  );

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alertData.isOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert severity={alertData.variant} sx={{ width: "100%" }}>
          <AlertTitle sx={{ fontWeight: "bold" }}>{alertData.title}</AlertTitle>
          {alertData.message}
        </Alert>
      </Snackbar>

      <div className="relative">
        <Table
          aria-label="Example table with custom cells, pagination and sorting"
          isStriped
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{ wrapper: "max-h-[382px]" }}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent="Nessun ordine trovato" items={sortedItems}>
            {(order) => (
              <TableRow key={order.idOrder}>
                {(columnKey) => (
                  <TableCell>{renderCell(order, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
            <Spinner color="primary" size="lg" />
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 id="modal-title">Dettagli Ordine</h3>
              </ModalHeader>
              <ModalBody>
                {selectedOrder && (
                  <div>
                    <p>
                      <strong>ID Ordine:</strong> {selectedOrder.idOrder}
                    </p>
                    <p>
                      <strong>Cliente:</strong> {selectedOrder.customerName}
                    </p>
                    <p>
                      <strong>Indirizzo:</strong> {selectedOrder.address}
                    </p>
                    <p>
                      <strong>Totale:</strong> {selectedOrder.total} €
                    </p>
                    <p>
                      <strong>
                        Pagamento:{" "}
                        {selectedOrder.paid ? (
                          <Chip
                            color="success"
                            className="text-white"
                            size="sm"
                          >
                            Effettuato
                          </Chip>
                        ) : (
                          <Chip color="error" size="sm">
                            Non Effettuato
                          </Chip>
                        )}
                      </strong>{" "}
                    </p>
                    <strong>Data Creazione:</strong>{" "}
                    {dayjs(selectedOrder.createdDatetime).format("DD/MM/YYYY")}
                    <p>
                      <strong>Prodotti:</strong>
                      {selectedOrder.products.map((product) => (
                        <div key={product.idProduct}>
                          <a
                            className="underline"
                            href={`https://www.tenutefarina.it/store/product/${product.idProduct}/${product.productName}`}
                          >
                            {product.productName}
                          </a>{" "}
                          - {product.amount} x {product.price} €
                        </div>
                      ))}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  auto
                  onClick={closeModal}
                >
                  Chiudi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isLinkModalOpen}
        onClose={closeLinkModal}
        aria-labelledby="link-modal-title"
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 id="link-modal-title">Inserisci Link di Tracciamento</h3>
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="Inserisci il link di tracciamento"
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
              onClick={handleAddTrackingLink}
              disabled={!trackingLink.trim()}
            >
              Conferma
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
