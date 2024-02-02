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
  Link,
  Spinner,
} from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar, Backdrop } from "@mui/material";
import dayjs from "dayjs";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import axios from "axios";
import { API_URL } from "../../../API/API";

const columns = [
  { name: "Codice", uid: "cod", sortable: true },
  { name: "Tipo", uid: "discountType", sortable: true },
  { name: "Valore", uid: "discountValue", sortable: true },
  { name: "Data inizio", uid: "startDate", sortable: true },
  { name: "Data fine", uid: "endDate", sortable: true },
  { name: "Opzioni", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "cod",
  "discountType",
  "discountValue",
  "startDate",
  "endDate",
  "actions",
];

export default function DiscountTable() {
  const [products, setProducts] = useState([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [alertData, setAlertData] = useState({
    isOpen: false,
    variant: "",
    title: "",
    message: "",
  });
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    axios.get(API_URL + "/Discounts/GetAll").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredProducts;
  }, [products, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  function searchProduct(e) {
    const filterValue = e;

    if (filterValue === "") {
      // Se il valore di ricerca è vuoto, carica nuovamente tutti i prodotti
      axios.get(API_URL + "/Discounts/GetAll").then((res) => {
        setProducts(res.data);
      });
    } else {
      axios
        .get(API_URL + `/Discounts/GetDiscountByCode/${filterValue}`)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          setProducts([]);
        });
    }
  }

  function deleteDiscount(id) {
    axios.delete(API_URL + `/Discounts/DeleteDiscount/${id}`).then((res) => {
      setAlertData({
        ...alertData,
        isOpen: true,
        variant: "success",
        title: "Prodotto rimosso",
        message: "Il prodotto è stato rimosso con successo dal magazzino!",
      });

      if (res.status === 200) {
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
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

  const renderCell = React.useCallback((discount, columnKey) => {
    const cellValue = discount[columnKey];

    switch (columnKey) {
      case "cod":
        return (
          <div>
            {discount.discountCode !== null ? (
              discount.discountCode
            ) : (
              <>Non previsto</>
            )}
          </div>
        );
      case "discountType":
        return <div>{discount.typeName}</div>;
      case "discountValue":
        return (
          <div>
            {discount.idDiscountType === 1 ? (
              <>€ {discount.value.toFixed(2)}</>
            ) : (
              <>{discount.value}%</>
            )}
          </div>
        );
      case "startDate":
        return <div>{dayjs(discount.startDate).format("DD/MM/YYYY")}</div>;
      case "endDate":
        return (
          <div>
            {discount.endDate === null ? (
              <p className="text-2xl">♾️</p>
            ) : (
              dayjs(discount.endDate).format("DD/MM/YYYY")
            )}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Dropdown radius="sm">
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  startContent={<RemoveRedEyeOutlinedIcon />}
                  href={`/discounts/visualize-discount/${discount.idDiscount}/${discount.discountCode}`}
                >
                  Visualizza
                </DropdownItem>

                <DropdownItem
                  className="text-danger"
                  color="danger"
                  onClick={() => deleteDiscount(discount.idDiscount)}
                  startContent={<DeleteOutlineRoundedIcon />}
                >
                  Rimuovi
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-3 lg:items-end">
          <Input
            className="lg:w-1/3"
            placeholder="Cerca per codice sconto"
            variant="bordered"
            size="sm"
            startContent={<SearchRoundedIcon />}
            onChange={(e) => searchProduct(e.target.value)}
          />
          <Button
            startContent={<AddRoundedIcon />}
            as={Link}
            href="/discounts/add-discount"
            color="primary"
            radius="sm"
          >
            Aggiungi sconto
          </Button>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    products.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
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
    );
  }, [page, pages, hasSearchFilter]);

  return (
    <>
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
        <TableBody emptyContent={"Nessuno sconto trovato"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.discountCode}>
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
