import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiWrapper from "./services/axios.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApiWrapper>
      <App />
    </ApiWrapper>
  </React.StrictMode>
);
