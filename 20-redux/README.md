# **Redux Overview**

## **What is Redux?**
- Redux is a state management library that manages cross-component or app-wide state in a predictable way.
- **State** refers to data that impacts the UI when changed:
  - **Local State**
    - Belongs to a single component.
    - Managed using `useState` or `useReducer`.
    - Example: Handling input field data or toggling a "show more details" section.
  - **Cross-Component State**
    - Affects multiple components.
    - Example: Managing a modal's open/closed state.
    - Requires "prop drilling" (passing state through multiple components).
  - **App-Wide State**
    - Affects the entire application.
    - Example: User authentication status or selected theme.
    - Also requires "prop drilling."

### **React Context vs Redux**
- **React Context**:
  - A built-in feature in React for managing cross-component or app-wide state.
- **Redux**:
  - Solves the same problem but addresses some limitations of React Context:
    1. **Complexity**:
       - Large apps using React Context may have deeply nested or "fat" Context Providers.
    2. **Performance**:
       - React Context is not optimized for frequent state updates, leading to potential performance issues.

---

## **How Redux Works**
1. **Central Store**:
   - Holds the entire app's state.
2. **Components**:
   - Subscribe to the store to receive updates when the state changes.
   - Never manipulate the state directly.
3. **Reducers**:
   - Pure functions responsible for updating the state based on actions.
   - Receive the current state and an action, then return a new state.
4. **Actions**:
   - JavaScript objects describing what operations should be performed on the state.
5. **Workflow**:
   - Components dispatch actions → Redux forwards actions to reducers → Reducers update the state → Subscribed components are notified → UI updates automatically.

---

## **Code Examples**

### **Store Setup (`store/index.js`)**
```javascript
import { createStore } from "redux";

const counterReducer = (state = { counter: 0 }, action) => {
  if (action.type === "increment") {
    return { counter: state.counter + 1 };
  }
  if (action.type === "decrement") {
    return { counter: state.counter - 1 };
  }
  return state;
};

const store = createStore(counterReducer);
export default store;
```

### **Application Entry Point (`index.js`)**
```javascript
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Wrap the application with the Provider component
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### **Counter Component (`Counter.js`)**
```javascript
import { useSelector, useDispatch } from "react-redux";
import classes from "./Counter.module.css";

const Counter = () => {
  const dispatch = useDispatch(); // Dispatch actions to the Redux store
  const counter = useSelector((state) => state.counter); // Access state from the Redux store

  const incrementHandler = () => {
    dispatch({ type: "increment" });
  };

  const decrementHandler = () => {
    dispatch({ type: "decrement" });
  };

  const toggleCounterHandler = () => {};

  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      <div className={classes.value}>{counter}</div>
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter;
```

---
