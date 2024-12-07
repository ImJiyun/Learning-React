import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
// index.jsx file acts as the main entry point of React App
// since it's in the index.html

// App - the first component to be analyzed & rendered by React
// Header - a child component of its parent compoent of the App component in this case

// component tree : a hierarchy of componets analyzed & rendered by react step-by-step

// built-in components
// name starts with a lowercase character
// only valid, officially defined HTML elements are allowed
// Are rendered as DOM nodes by React

// Custom component
// name starts with uppercase characer
// Defined by dev, "wraps" built-in or other custom components
// react traverse the component tree until it has only built-in components left
