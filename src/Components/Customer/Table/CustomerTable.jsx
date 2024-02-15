import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
  Link,
} from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar, Backdrop } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { API_URL } from "../../../API/API";
import axios from "axios";
import SidePanel from "../Other/SidePanel";

const columns = [
  { name: "Nome completo", uid: "name", sortable: true },
  { name: "Email", uid: "mail", sortable: true },
  { name: "Phone", uid: "phone", sortable: true },
  { name: "Stato", uid: "status", sortable: true },
  { name: "Opzioni", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "mail", "phone", "status", "actions"];

export default function CustomerTable() {
  const [open, setOpen] = useState({
    open: false,
    customerId: 0,
  });
  const [customers, setCustomers] = useState([]);
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const rowsPerPage = 5;
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(API_URL + "/Customer/GetAll").then((res) => {
      setCustomers(res.data);
      // Imposta la pagina su 1 dopo aver recuperato i dati
      setPage(1);
    });
  }, []);

  function searchProduct(e) {
    const filterValue = e;

    if (filterValue === "") {
      // Se il valore di ricerca è vuoto, carica nuovamente tutti i prodotti
      axios.get(API_URL + "/Customer/GetAll").then((res) => {
        setCustomers(res.data);
      });
    } else {
      axios
        .get(API_URL + `/Customer/GetProductByName/${filterValue}`)
        .then((res) => {
          setCustomers(res.data);
        })
        .catch((err) => {
          setCustomers([]);
        });
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

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const pages = Math.ceil(customers.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return customers.slice(start, end);
  }, [page, customers, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((customer, columnKey) => {
    const cellValue = customer[columnKey];

    switch (columnKey) {
      case "name":
        return <div>{customer.name + " " + customer.surname}</div>;
      case "mail":
        return <div>{customer.mail}</div>;
      case "phone":
        return <div>{customer.phone}</div>;
      case "status":
        if (customer.idStatus === 1) {
          return (
            <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
              {customer.status}
            </span>
          );
        } else if (customer.idStatus === 2) {
          return (
            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
              {customer.status}
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {customer.status}
            </span>
          );
        }

      case "actions":
        return (
          <>
            <Button
              isIconOnly
              variant="light"
              onClick={() =>
                setOpen({
                  ...open,
                  open: true,
                  customerId: customer.id,
                })
              }
            >
              <MoreVertIcon />
            </Button>
          </>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-3 lg:items-end">
          <Input
            className="lg:w-1/3"
            placeholder="Cerca cliente per email"
            variant="bordered"
            size="sm"
            startContent={<SearchRoundedIcon />}
            onChange={(e) => searchProduct(e.target.value)}
          />
        </div>
      </div>
    );
  }, [statusFilter, visibleColumns, customers.length]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          initialPage={page}
          total={pages || 1}
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages]);

  return (
    <>
      <SidePanel open={open} setOpen={setOpen} />
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

      {alertData.isOpen && (
        <Backdrop
          sx={{
            backdropFilter: "blur(5px)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={open}
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
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
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
        <TableBody
          emptyContent={"Nessun prodotto presente in magazzino"}
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item.idCustomer}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
