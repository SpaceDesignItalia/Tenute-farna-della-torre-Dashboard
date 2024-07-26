import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <Router>
      <App />
    </Router>
  </NextUIProvider>
);
