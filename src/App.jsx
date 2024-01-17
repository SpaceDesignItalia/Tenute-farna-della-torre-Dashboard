import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import Nav from "./Components/Global/Nav";
import Products from "./Pages/Products/Products";
import Login from "./Pages/Login/Login";
import Settings from "./Pages/Settings/Settings";
import { API_URL } from "./API/API";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
      <Routes>
        <Route element={<LoginRoute isAuth={isAuth} />}>
          <Route exact path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute isAuth={isAuth} />}>
          <Route exact path="/" element={<Products />} />
        </Route>
      </Routes>
    </>
  );
}
