import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiWrapper from "./services/axios.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApiWrapper>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApiWrapper>
  </React.StrictMode>
);
