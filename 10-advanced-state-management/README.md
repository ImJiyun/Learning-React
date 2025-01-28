## Advanced State Management

- the problem of shared state : prop drilling
- embracing **component composition**
- sharing state with **context**
- managing complex state with **Reducers**

---

### Prop Drilling

- **What is Prop Drilling?**  
  The process of passing data (props) through multiple layers of components in a hierarchy to reach deeply nested components.

- **Drawbacks of Prop Drilling:**
  1. Makes components **less reusable** because the data dependency spreads across unrelated components.
  2. Requires **extra boilerplate code**, making it harder to maintain and scale the application.

---

### Component Composition

- **What is Component Composition?**  
  A design pattern in React where we combine smaller, reusable components to create complex UI hierarchies.  
  Instead of tightly coupling components by passing data directly via props, we allow components to be more flexible and generic by embedding children or passing specific logic through props.

---

### Before Component Composition (Prop Drilling Example)

```jsx
import { DUMMY_PRODUCTS } from "../dummy-products.js";
import Product from "./Product.jsx";

export default function Shop({ onAddItemToCart }) {
  return (
    <section id="shop">
      <h2>Elegant Clothing For Everyone</h2>
      <ul id="products">
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} onAddToCart={onAddItemToCart} />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

In this example:

- The `Shop` component tightly controls the structure of how products are rendered.
- **Limitation:** It relies on passing the `onAddItemToCart` prop down to every product, tightly coupling the `Shop` and `Product` components.

---

### After Embracing Component Composition

- The `Shop` component is modified to accept `children` props. This allows for flexibility in what gets rendered inside the `Shop` component.

**Revised `Shop` Component:**

```jsx
import { DUMMY_PRODUCTS } from "../dummy-products.js";

export default function Shop({ children }) {
  return (
    <section id="shop">
      <h2>Elegant Clothing For Everyone</h2>
      <ul id="products">{children}</ul>
    </section>
  );
}
```

**Revised `App` Component Using Component Composition:**

```jsx
import { useState } from "react";
import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";
import Product from "./components/Product.jsx";

function App() {
  const [shoppingCart, setShoppingCart] = useState({ items: [] });

  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const existingCartItemIndex = updatedItems.findIndex(
        (item) => item.id === id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        updatedItems[existingCartItemIndex] = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return { items: updatedItems };
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = { ...updatedItems[updatedItemIndex] };
      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return { items: updatedItems };
    });
  }

  return (
    <>
      <Header
        cart={shoppingCart}
        onUpdateCartItemQuantity={handleUpdateCartItemQuantity}
      />
      <Shop>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} onAddToCart={handleAddItemToCart} />
          </li>
        ))}
      </Shop>
    </>
  );
}

export default App;
```

---

### Benefits of Component Composition

1. **Increased Flexibility:**  
   By using `children` or composition patterns, components like `Shop` can accept arbitrary content, not just `DUMMY_PRODUCTS`.

2. **Reusability:**  
   Components can be reused in other parts of the application without tight coupling to specific logic.

3. **Cleaner Codebase:**  
   Composition helps reduce boilerplate and makes the application easier to read and maintain.

---

### Cons of Component Composition

1. **Complexity in Prop Management:**

   - When components accept children or composition props, it can become harder to track what data is being passed and ensure consistency.
   - Debugging and refactoring may require additional effort, especially in large applications.

2. **Potential Overhead for Small Applications:**

   - For simple use cases, using component composition might feel like overengineering compared to directly passing props.

3. **Inconsistent Child Structure:**

   - Since `children` can be anything (JSX elements, arrays, strings, etc.), it's harder to enforce structure or type-checking, leading to potential runtime issues.

4. **Reduced Readability in Some Cases:**

   - Overuse of composition can sometimes make the relationships between components unclear, especially if the logic spans multiple levels of the hierarchy.

5. **Dependency on Context or State Management:**
   - To fully eliminate prop drilling, we may need context APIs or state management libraries (e.g., Redux, Zustand), adding another layer of complexity.

---

### Context API

The Context API in React is a powerful tool for managing state and data across multiple components without passing props through every level of the component tree.

---

#### **Core Features**

1. **Data Sharing Across Components**
   - React allows the creation of a "context" value that can be shared across multiple components.
2. **Eliminates Prop Drilling**
   - Avoids the hassle of passing states or state-updating functions as props through multiple layers of components.

---

#### **Advantages**

1. **State Connection**
   - The context can be easily connected to a state, allowing dynamic updates.
2. **Prop Management Simplified**
   - No need to pass props manually. Components can directly access the context value.
3. **Centralized Store**
   - Context values are often stored in a centralized "store" file for better management and organization.
4. **Flexibility with Hooks**
   - The `useContext` hook provides a clean and efficient way to access context values.

---

#### **Disadvantages**

1. **Performance Concerns**
   - Updates to context can cause unnecessary re-renders in all consuming components. Optimization may require splitting contexts.
2. **Limited Use Cases**
   - Best for managing global state, such as themes or authentication. Overuse can make components overly reliant on context.
3. **Coupling**
   - Components tightly coupled to a context can lose reusability.
4. **Debugging Challenges**
   - Tracing issues related to deeply nested components using context may be difficult.

---

#### **Implementation Example**

##### Creating a Context

```jsx
import { createContext } from "react";

// 1. Create a context object with an initial value
export const CartContext = createContext({
  items: [], // Initial value
});
// createContext creates an object that contains a react component
// createContext takes an argument as an initial value
```

---

##### Providing the Context

Wrap components with the `Provider` and set a `value` prop.

- older React version (before React 19)

```jsx
import { CartContext } from "./store/shopping-cart-context";
import { useState } from "react";
import Header from "./components/Header";
import Shop from "./components/Shop";

function App() {
  const [shoppingCart, setShoppingCart] = useState({ items: [] });

  return (
    <CartContext.Provider value={{ shoppingCart, setShoppingCart }}>
      <Header />
      <Shop />
    </CartContext.Provider>
  );
}

export default App;
```

- Since React 19 : don't need to specify Provider property

```jsx
import { CartContext } from "./store/shopping-cart-context";
import { useState } from "react";
import Header from "./components/Header";
import Shop from "./components/Shop";

function App() {
  const [shoppingCart, setShoppingCart] = useState({ items: [] });

  return (
    <CartContext value={{ shoppingCart, setShoppingCart }}>
      <Header />
      <Shop />
    </CartContext>
  );
}

export default App;
```

---

##### Consuming the Context

Use the `useContext` hook to access context values in a child component.

```jsx
import { useContext } from "react";
import { CartContext } from "../store/shopping-cart-context";

export default function Cart() {
  const { shoppingCart } = useContext(CartContext); // cartCtx is a value provided by the context
  const totalPrice = shoppingCart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Cart Total: ${totalPrice.toFixed(2)}</h2>
      <ul>
        {shoppingCart.items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

#### **Special Notes**

1. **Provider Property:**
   - `Provider` is a property of the context object created by `createContext`, not defined by developers.
2. **React Version:**
   - The `useContext` hook is supported in React 16.8+. React 19+ introduces enhanced performance and flexibility.

This setup demonstrates how Context API can simplify state sharing while maintaining clean and efficient code. For larger applications, consider integrating Context API with state management libraries like Redux for enhanced capabilities.

---

#### A different way of consuming context

- context provides properties not only Provider but also Consumer
- between two tags, we should pass a function as a child
- that function is executed by React and that function will automatically receive the context value

```jsx
import { useContext } from "react";
import { CartContext } from "../store/shopping-cart-context.jsx";

export default function Cart({ onUpdateItemQuantity }) {
  return (
    <CartContext.Consumer>
      {(cartCtx) => {
        const totalPrice = cartCtx.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;

        return (
          <div id="cart">
            {cartCtx.items.length === 0 && <p>No items in cart!</p>}
            {cartCtx.items.length > 0 && (
              <ul id="cart-items">
                {cartCtx.items.map((item) => {
                  const formattedPrice = `$${item.price.toFixed(2)}`;

                  return (
                    <li key={item.id}>
                      <div>
                        <span>{item.name}</span>
                        <span> ({formattedPrice})</span>
                      </div>
                      <div className="cart-item-actions">
                        <button
                          onClick={() => onUpdateItemQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateItemQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p id="cart-total-price">
              Cart Total: <strong>{formattedTotalPrice}</strong>
            </p>
          </div>
        );
      }}
    </CartContext.Consumer>
  );
}
```

- It shouldn't be the default apporach. It's order version

#### What happens when context value changes?

## Linking the Context to State

When we wrap components with a **context provider**, any child components can access the properties inside the `value` of the `context`. This is how we share state and functions (so that they don't have to be passed as props) across components efficiently.

### Example: App Component with State Management

```jsx
import { useState } from "react";

import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";
import Product from "./components/Product.jsx";

import { CartContext } from "./store/shopping-cart-context.jsx";

function App() {
  const [shoppingCart, setShoppingCart] = useState({
    items: [],
    addItemToCart: () => {}, // for auto completion
  });

  // Function to handle adding items to the shopping cart
  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    });
  }

  // Function to handle cart item quantity adjustments
  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = { ...updatedItems[updatedItemIndex] };
      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    });
  }

  const ctxValue = {
    items: shoppingCart.items, // State linked here
    addItemToCart: handleAddItemToCart,
  };

  return (
    // Wrap context provider around the entire part of the app
    <CartContext.Provider value={ctxValue}>
      <Header
        cart={shoppingCart}
        onUpdateCartItemQuantity={handleUpdateCartItemQuantity}
      />
      <Shop>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} onAddToCart={handleAddItemToCart} />
          </li>
        ))}
      </Shop>
    </CartContext.Provider>
  );
}

export default App;
```

### Explanation:

1. **State with `useState`:**  
   The `shoppingCart` state is managed at the top-level `App` component.
2. **Handler Functions (`handleAddItemToCart`, `handleUpdateCartItemQuantity`):**

   - These are functions that manipulate the shopping cart state.
   - Handlers are passed into context and consumed by other child components.

3. **Context Value (`ctxValue`):**  
   The context value contains shared state (`items`) and functions (`addItemToCart`). This is passed down using `CartContext.Provider`.

---

## Simplifying the Child Component with Context

Instead of passing `onAddToCart` via props, `Product.jsx` accesses `addItemToCart` directly from the context.

### Example: Product Component

```jsx
import { useContext } from "react";
import { CartContext } from "../store/shopping-cart-context.jsx";

export default function Product({ id, image, title, price, description }) {
  const { addItemToCart } = useContext(CartContext);

  return (
    <article className="product">
      <img src={image} alt={title} />
      <div className="product-content">
        <div>
          <h3>{title}</h3>
          <p className="product-price">${price}</p>
          <p>{description}</p>
        </div>
        <p className="product-actions">
          <button onClick={() => addItemToCart(id)}>Add to Cart</button>
        </p>
      </div>
    </article>
  );
}
```

### Key Idea

- `Product.jsx` no longer relies on props for the `onAddToCart` function. Instead, it pulls the context data directly using `useContext(CartContext)`.
- This simplifies prop drilling and keeps `Product` cleaner.

---

## A Different Way of Consuming Context: Using `CartContext.Consumer`

Although modern React prefers the `useContext` hook, we can use the **`CartContext.Consumer`** for accessing context values. This is the older way of using context.

### Example: `Cart` Component with Consumer

```jsx
import { useContext } from "react";
import { CartContext } from "../store/shopping-cart-context.jsx";

export default function Cart({ onUpdateItemQuantity }) {
  return (
    <CartContext.Consumer>
      {(cartCtx) => {
        const totalPrice = cartCtx.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;

        return (
          <div id="cart">
            {cartCtx.items.length === 0 && <p>No items in cart!</p>}
            {cartCtx.items.length > 0 && (
              <ul id="cart-items">
                {cartCtx.items.map((item) => {
                  const formattedPrice = `$${item.price.toFixed(2)}`;
                  return (
                    <li key={item.id}>
                      <div>
                        <span>{item.name}</span>
                        <span> ({formattedPrice})</span>
                      </div>
                      <div className="cart-item-actions">
                        <button
                          onClick={() => onUpdateItemQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateItemQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p id="cart-total-price">
              Cart Total: <strong>{formattedTotalPrice}</strong>
            </p>
          </div>
        );
      }}
    </CartContext.Consumer>
  );
}
```

---

## What Happens When Context Value Changes?

When the context value passed to `CartContext.Provider` changes, React re-renders all child components that are consuming that context.

1. **`useContext` or `Consumer` Will Trigger Re-render:**  
   Whenever `ctxValue` changes (e.g., `setShoppingCart` updates the `items` array), all components that use `useContext(CartContext)` or `CartContext.Consumer` will re-render.

2. **Why This is Useful:**  
   This allows components depending on shared state or functions to always reflect the latest changes without needing to pass props through multiple levels of the component tree.

---

### Recap

1. **Linking Context to State:**  
   Use `Context.Provider` with a `value` prop to pass state and state-manipulating functions to child components.
2. **Context Consumption:**

   - Preferred: Use `useContext`.
   - Older alternative: Use `CartContext.Consumer`.

3. **Dynamic Reactivity:**  
   When the `value` in `Context.Provider` changes, consuming components will automatically re-render to stay updated.

---

### Outsourcing Context and State into a Separate Provider Component

#### Benefits of Outsourcing Context and State

1. **Centralized State Management**: Keeps state and logic centralized, making the codebase more maintainable.
2. **Reusability**: The context can be reused across multiple components without duplicating code.
3. **Readability**: Separating context logic from component-specific logic improves readability and separation of concerns.
4. **Scalability**: Easier to extend with additional functionality as the project grows.

---

### Code Implementation

#### `shopping-cart-context.jsx` (Context and Provider Component)

```jsx
import { createContext, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

// Step 1: Create the context with default values
export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

// Step 2: Create the provider component
export default function CartContextProvider({ children }) {
  const [shoppingCart, setShoppingCart] = useState({ items: [] });

  // Handle adding an item to the cart
  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        updatedItems[existingCartItemIndex] = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return { items: updatedItems };
    });
  }

  // Handle updating the quantity of an item
  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = { ...updatedItems[updatedItemIndex] };
      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return { items: updatedItems };
    });
  }

  // Define the context value to be provided
  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
```

---

#### `App.jsx` (Using the Provider Component)

```jsx
import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";
import Product from "./components/Product.jsx";
import CartContextProvider from "./store/shopping-cart-context.jsx";

function App() {
  return (
    // Step 3: Wrap the provider around components that need access to the context
    <CartContextProvider>
      <Header />
      <Shop>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} />
          </li>
        ))}
      </Shop>
    </CartContextProvider>
  );
}

export default App;
```

---

### Component-Level Context Usage Example

#### Example: `Product.jsx`

```jsx
import { useContext } from "react";
import { CartContext } from "../store/shopping-cart-context.jsx";

export default function Product({ id, title, price, description }) {
  const { addItemToCart } = useContext(CartContext);

  return (
    <article className="product">
      <h3>{title}</h3>
      <p className="product-price">${price}</p>
      <p>{description}</p>
      <button onClick={() => addItemToCart(id)}>Add to Cart</button>
    </article>
  );
}
```

---

### Key Notes

1. **Encapsulation**: By outsourcing the context, all state management logic remains encapsulated in the `shopping-cart-context.jsx` file.
2. **Ease of Use**: The `CartContextProvider` ensures that any component wrapped within it can easily access and update the cart state.
3. **Testability**: We can test the provider independently of the components using it.

---

### useReducer

#### What's a Reducer

- A reducer is a function that takes the current state and an action as input and returns a new state. It "reduces" one or more complex values into a simpler one, often used for state management.

#### Key Features:

1. **Pure Function**: A reducer must always return a new state without modifying the original state or having side effects.
2. **Action-based**: State updates are triggered by actions that contain a `type` and optional `payload`.

---

### Example Implementation with React's `useReducer`

#### Creating Context and Reducer

```jsx
import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

// Step 1: Create a context
export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

// Step 2: Define the reducer function
function shoppingCartReducer(state, action) {
  // reducer function will be called by React after dispatching an action
  // 2nd arg : action we dispatch with dispatch function
  // state is the guaranteed latest state snapshot
  // we should return the updated state
  switch (action.type) {
    case "ADD_ITEM": {
      const updatedItems = [...state.items];
      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        updatedItems[existingCartItemIndex] = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
      } else {
        const product = DUMMY_PRODUCTS.find(
          (product) => product.id === action.payload
        );
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return { ...state, items: updatedItems };
    }
    case "UPDATE_ITEM": {
      const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );
      const updatedItem = { ...updatedItems[updatedItemIndex] };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return { ...state, items: updatedItems };
    }
    default:
      return state;
  }
}
```

#### Creating the Provider Component

```jsx
export default function CartContextProvider({ children }) {
  // Step 3: Initialize the reducer
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    { items: [] }
  ); // 1st arg : reducer function, 2nd arg : an initial value of state

  // Step 4: Define action handlers
  function handleAddItemToCart(id) {
    // argument in this dispatch function (the object) is a value for action parameter in shoppingCartReducer
    shoppingCartDispatch({ type: "ADD_ITEM", payload: id });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: { productId, amount },
    });
  }

  // Step 5: Define context value
  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  // Step 6: Wrap children with Provider
  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
```

---

### Usage of `useReducer`

#### How to Use:

1. **Initialize Reducer**: Use `useReducer(reducer, initialState)` to set up a state and dispatch function.
2. **Dispatch Actions**: Call `dispatch({ type, payload })` to update the state.
3. **Consume Context**: Use `useContext(Context)` to access state and action handlers.

---

### Benefits of `useReducer`

1. **Predictable State Management**: Updates are isolated in a single function.
2. **Better Readability**: Clear separation between state logic and UI.
3. **Scalable**: Ideal for managing complex state transitions.
4. **Testable**: Reducer functions are pure and can be tested independently.

---

### When to Use `useReducer`

- Use `useReducer` when:
  - State logic is complex or interdependent.
  - Multiple actions modify the same state.
- Prefer `useState` for simpler, localized state management.
