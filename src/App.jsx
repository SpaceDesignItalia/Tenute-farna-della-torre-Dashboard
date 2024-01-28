import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
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

export default function App() {
  const [isAuth, setIsAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  /* useEffect(() => {
    axios
      .get(API_URL + "Auth/CheckSession", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setIsAuth(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []); */

  if (isLoading) {
    return (
      <div className="absolute left-0 w-full h-full flex flex-col justify-center items-center">
        <Spinner size="lg" color="danger" />
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
          {/* <Route exact path="/login" element={<Login />} /> */}
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
            path="/products/add-product-in-featured"
            element={<AddFeaturedProduct />}
          />
          <Route exact path="/discounts" element={<DiscountDashboard />} />
          <Route
            exact
            path="/discounts/add-discount"
            element={<AddDiscount />}
          />
        </Route>
      </Routes>
    </>
  );
}
