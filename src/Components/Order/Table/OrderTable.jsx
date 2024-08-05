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
  useDisclosure,
} from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar, Backdrop } from "@mui/material";
import dayjs from "dayjs";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import axios from "axios";
import { API_URL } from "../../../API/API";

const columns = [
  { name: "ID Ordine", uid: "idOrder", sortable: true },
  { name: "Cliente", uid: "customerName", sortable: true },
  { name: "Indirizzo", uid: "address", sortable: true },
  { name: "Totale", uid: "total", sortable: true },
  { name: "Pagamento", uid: "paid", sortable: true },
  { name: "Data Creazione", uid: "createdDatetime", sortable: true },
  { name: "Opzioni", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "idOrder",
  "customerName",
  "address",
  "total",
  "paid",
  "createdDatetime",
  "actions",
];

export default function OrderTable() {
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
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filterValue]);

  const fetchOrders = async () => {
    try {
      const ordersResponse = await axios.get(API_URL + `/Order/GetAllOrders`);
      const ordersData = ordersResponse.data;

      const customerResponses = await axios.all(
        ordersData.map((order) =>
          axios.get(API_URL + `/Customer/GetCustomerById/${order.idCustomer}`)
        )
      );
      const addressResponses = await axios.all(
        ordersData.map((order) =>
          axios.get(
            API_URL + `/Customer/GetShippingInfoById/${order.idShippingDetail}`
          )
        )
      );
      const productResponses = await axios.all(
        ordersData.map((order) =>
          axios.get(API_URL + `/Order/GetProductsByIdOrder`, {
            params: { idOrder: order.idOrder },
          })
        )
      );

      const enhancedOrders = ordersData.map((order, index) => ({
        ...order,
        customerName: `${customerResponses[index].data.name} ${customerResponses[index].data.surname}`,
        address: `${addressResponses[index].data.address} ${addressResponses[index].data.civicNumber} ${addressResponses[index].data.city} ${addressResponses[index].data.cap} ${addressResponses[index].data.province} ${addressResponses[index].data.nation}`,
        total: productResponses[index].data.reduce(
          (acc, product) => acc + product.price * product.amount,
          0
        ),
      }));

      setOrders(enhancedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const filteredItems = useMemo(
    () =>
      hasSearchFilter
        ? orders.filter((order) =>
            order.idOrder.toString().includes(filterValue.toLowerCase())
          )
        : orders,
    [orders, filterValue, hasSearchFilter]
  );

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(
    () => filteredItems.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [page, filteredItems, rowsPerPage]
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
      await axios.delete(API_URL + `/Order/DeleteOrder`, {
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

  const renderCell = useCallback((order, columnKey) => {
    switch (columnKey) {
      case "idOrder":
        return <div>{order.idOrder}</div>;
      case "customerName":
        return <div>{order.customerName}</div>;
      case "address":
        return <div>{order.address}</div>;
      case "total":
        return <div>{order.total}</div>;
      case "paid":
        return <div>{order.paid ? "Sì" : "No"}</div>;
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
                  className="text-danger"
                  color="danger"
                  onClick={() => deleteOrder(order.idOrder)}
                  startContent={<DeleteOutlineRoundedIcon />}
                >
                  Elimina
                </DropdownItem>
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
      {alertData.isOpen && (
        <Backdrop
          sx={{
            backdropFilter: "blur(5px)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={alertData.isOpen}
          onClick={handleClose}
        >
          <Spinner color="primary" size="lg" />
        </Backdrop>
      )}
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
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
                      <strong>Totale:</strong> {selectedOrder.total}
                    </p>
                    <p>
                      <strong>Pagamento:</strong>{" "}
                      {selectedOrder.paid ? "Sì" : "No"}
                    </p>
                    <strong>Data Creazione:</strong>{" "}
                    {dayjs(selectedOrder.createdDatetime).format("DD/MM/YYYY")}
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
    </>
  );
}
