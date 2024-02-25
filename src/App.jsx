import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { API_URL } from "./API/API";
import Home from "./Pages/Home/Home";
import Sidebar from "./Components/Layout/Sidebar";
import ProductDashboard from "./Pages/Product/ProductDashboard";
import AddProduct from "./Pages/Product/AddProduct";
import AddDiscount from "./Pages/Discount/AddDiscount";
import DiscountDashboard from "./Pages/Discount/DiscountDashboard";
import AddFeaturedProduct from "./Pages/Product/AddFeaturedProduct";
import VisualizeProduct from "./Pages/Product/VisualizeProduct";
import EditProduct from "./Pages/Product/EditProduct";
import VisualizeDiscount from "./Pages/Discount/VisualizeDiscount";
import Login from "./Pages/Login/Login";
import Settings from "./Pages/Settings/Settings";
import CustomerDashboard from "./Pages/Customer/CustomerDashboard";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(API_URL + "/Staffer/CheckSession", { withCredentials: true })
      .then((res) => {
        if (res.status === 200 && res.data) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .catch((err) => {
        console.error("Errore durante il controllo della sessione:", err);
        setIsAuth(false);
      })
      .finally(() => {
        setIsLoading(false); // Aggiorna lo stato di caricamento quando la richiesta è completata
      });
  }, [isAuth]);

  if (isLoading) {
    return (
      <div className="absolute left-0 w-full h-full flex flex-col justify-center items-center bg-gray-200">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const ProtectedRoute = ({ isAuth, redirectPath = "/login" }) => {
    if (!isAuth) {
      return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
  };

  const LoginRoute = ({ isAuth, redirectPath = "/" }) => {
    if (isAuth) {
      return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
  };

  return (
    <>
      {isAuth && <Sidebar />}
      <Routes>
        <Route element={<LoginRoute isAuth={isAuth} />}>
          <Route exact path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute isAuth={isAuth} />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/products" element={<ProductDashboard />} />
          <Route exact path="/products/add-product" element={<AddProduct />} />
          <Route
            exact
            path="/products/visualize-product/:id/:name"
            element={<VisualizeProduct />}
          />
          <Route
            exact
            path="/products/edit-product/:id/:name"
            element={<EditProduct />}
          />
          <Route
            exact
            path="/products/add-product-in-featured"
            element={<AddFeaturedProduct />}
          />
          <Route exact path="/discounts" element={<DiscountDashboard />} />
          <Route
            exact
            path="/discounts/add-discount"
            element={<AddDiscount />}
          />
          <Route
            exact
            path="/discounts/visualize-discount/:id/:code"
            element={<VisualizeDiscount />}
          />
          <Route exact path="/customers" element={<CustomerDashboard />} />
          <Route exact path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}
