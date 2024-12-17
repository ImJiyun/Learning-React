import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // strict mode causes the component function to be executed twice
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
