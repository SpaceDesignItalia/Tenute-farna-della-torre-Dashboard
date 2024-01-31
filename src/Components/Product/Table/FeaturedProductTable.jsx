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
  Spinner,
  Pagination,
  Link,
} from "@nextui-org/react";
import { AlertTitle, Alert, Snackbar, Backdrop } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { API_URL } from "../../../API/API";
import axios from "axios";

const columns = [
  { name: "Prodotto", uid: "productName", sortable: true },
  { name: "Quantità in magazzino", uid: "productAmount", sortable: true },
  { name: "Prezzo (€)", uid: "unitPrice", sortable: true },
  { name: "Opzioni", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "productName",
  "productAmount",
  "unitPrice",
  "actions",
];

export default function FeaturedProductTable() {
  const [products, setProducts] = useState([]);
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
    axios.get(API_URL + "/Featured/GetAll").then((res) => {
      setProducts(res.data);

      // Imposta la pagina su 1 dopo aver recuperato i dati
      setPage(1);
    });
  }, []);

  function searchProduct(e) {
    const filterValue = e;

    if (filterValue === "") {
      // Se il valore di ricerca è vuoto, carica nuovamente tutti i prodotti
      axios.get(API_URL + "/Featured/GetAll").then((res) => {
        setProducts(res.data);
      });
    } else {
      axios
        .get(API_URL + `/Featured/GetProductByName/${filterValue}`)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          setProducts([]);
        });
    }
  }

  function deleteProduct(id) {
    axios.delete(API_URL + `/Featured/DeleteFeatured/${id}`).then((res) => {
      setAlertData({
        ...alertData,
        isOpen: true,
        variant: "success",
        title: "Prodotto rimosso",
        message: "Il prodotto è stato rimosso con successo dagli in evidenza",
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

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const pages = Math.ceil(products.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products.slice(start, end);
  }, [page, products, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((product, columnKey) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "productName":
        return <div>{product.productName}</div>;
      case "productAmount":
        return <div>{product.productAmount}</div>;
      case "unitPrice":
        return <div>€ {product.unitPrice.toFixed(2)}</div>;
      case "actions":
        return (
          <Button
            startContent={<DeleteOutlineRoundedIcon />}
            color="danger"
            radius="sm"
            onClick={() => deleteProduct(product.idProduct)}
          >
            Rimuovi
          </Button>
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
            placeholder="Cerca per nome prodotto"
            variant="bordered"
            size="sm"
            startContent={<SearchRoundedIcon />}
            onChange={(e) => searchProduct(e.target.value)}
          />
          <Button
            as={Link}
            href="/products/add-product-in-featured"
            startContent={<AddRoundedIcon />}
            color="primary"
            radius="sm"
          >
            Aggiungi in evidenza
          </Button>
        </div>
      </div>
    );
  }, [
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    products.length,
    onSearchChange,
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
  }, [page, pages]);

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
        <TableBody
          emptyContent={"Nessun prodotto in evidenza trovato"}
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item.idProduct}>
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
