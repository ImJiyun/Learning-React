import { StrictMode } from "react";
// it is a component provided from react
// it's used for wrapping the App component
//  during development, it makes every component to get executed twice
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
