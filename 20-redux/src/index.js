import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
// Provider component wraps the component
// only wrapped components and their child components will have acess to the store
// Provider component has store prop
// now the app and its child component can tap on store data
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
