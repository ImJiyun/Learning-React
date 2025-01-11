## React Router

### 1. Defining Routes
React Router provides tools to define path-to-component mappings. 

```jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";

// Using `createRoutesFromElements` (older style)
const routeDefinitions = createRoutesFromElements(
  <Route>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductsPage />} />
  </Route>
);

// Using `createBrowserRouter` (latest style)
const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ProductsPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

#### Key Notes:
- Routes define the structure of application's paths.
- React Router allows flexibility between imperative (programmatic) and declarative route definitions.
- `RouterProvider` connects the router instance to the app.

---

### 2. Navigating Pages with `Link`
React Router replaces traditional `<a>` tags with `Link` to handle navigation without reloading the page.

```jsx
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <h1>My Home Page</h1>
      <p>
        Go to <Link to="/products">the list of products</Link>
      </p>
    </>
  );
}

export default HomePage;
```

#### Key Notes:
- `<Link>` prevents unnecessary HTTP requests, maintaining SPA behavior.
- Unlike an `<a>` tag, a `Link` listens for clicks and updates the browser history programmatically.
- Always use `Link` for internal navigation in React applications.

---

### 3. Layouts & Nested Routes
Layouts in React Router are achieved using nested routes and the `Outlet` component.

```jsx
import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import classes from "./Root.module.css";

function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main className={classes.content}>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
```

#### Key Notes:
- **`Outlet`**: Acts as a placeholder for child route elements.
- Nested routes enable building reusable layouts while keeping routes modular.
- Example use case: shared navigation bars, sidebars, or footers.

```jsx
import {
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";
import RootLayout from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

---

### 4. Error Handling with `errorElement`
React Router allows defining error pages for unexpected situations, such as undefined routes.

```jsx
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />, // Handle undefined paths or errors
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

#### Key Notes:
- **`errorElement`**: Renders a fallback UI when the router encounters an error.
- Useful for displaying custom 404 or server error pages.

---

### 5. `NavLink` for Active Styling
`NavLink` is a special version of `Link` that supports dynamic styling for active routes.

```jsx
import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? classes.active : undefined)}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? classes.active : undefined)}
            >
              Products
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
```

#### Key Notes:
- `className` in `NavLink` accepts a function that returns a CSS class based on `isActive`.
- The `end` prop ensures the link matches only its exact path (avoiding partial matches for nested routes).

---

### 6. Programmatic Navigation
React Router's `useNavigate` hook allows programmatic navigation.

```jsx
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  function navigateHandler() {
    navigate("/products");
  }

  return (
    <>
      <h1>My Home Page</h1>
      <p>
        <button onClick={navigateHandler}>Navigate</button>
      </p>
    </>
  );
}

export default HomePage;
```

#### Key Notes:
- `useNavigate` is ideal for navigation triggered by events, such as button clicks or form submissions.
- Prefer `Link` for static navigation in your UI.

---

### Dynamic Routes with React Router

Dynamic routes allow React Router to handle path segments that are not static, enabling pages to be rendered based on variable data (e.g., `:productId` in a route).

---

### Setting Up Dynamic Routes

1. **Route Definition**  
Dynamic routes use `:` to define a path parameter, such as `:productId`. This parameter can be accessed in the component corresponding to the route.

```jsx
import {
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import ProductDetailPage from "./pages/ProductDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      // Dynamic Route
      { path: "/products/:productId", element: <ProductDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

---

2. **Accessing Dynamic Parameters with `useParams`**  
The `useParams` hook retrieves the dynamic path parameters defined in the route.

```jsx
import { useParams } from "react-router-dom";

function ProductDetailPage() {
  const params = useParams(); // Extracts `:productId` from the URL

  return (
    <>
      <h1>Product Details</h1>
      <p>Product ID: {params.productId}</p>
    </>
  );
}

export default ProductDetailPage;
```

- **How It Works:**  
  When the URL matches `/products/:productId`, `useParams` provides an object containing the path variable.  
  Example: Visiting `/products/p1` gives `{ productId: "p1" }`.

---

3. **Linking to Dynamic Routes**  
Use `<Link>` components to navigate to a dynamic route. The `to` prop can include dynamic path variables.

```jsx
import { Link } from "react-router-dom";

const PRODUCTS = [
  { id: "p1", title: "Product 1" },
  { id: "p2", title: "Product 2" },
  { id: "p3", title: "Product 3" },
];

function ProductsPage() {
  return (
    <>
      <h1>The Products Page</h1>
      <ul>
        {PRODUCTS.map((prod) => (
          <li key={prod.id}>
            {/* Link to dynamic route */}
            <Link to={`/products/${prod.id}`}>{prod.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProductsPage;
```

- **Explanation:**  
  The `PRODUCTS` array simulates fetched data. Each item dynamically generates a link pointing to its corresponding detail page.

---

### Benefits of Dynamic Routes

- **Flexibility**: Routes can adapt to dynamic data such as user IDs, product IDs, or categories.
- **Scalability**: One dynamic route can handle multiple variations, reducing redundancy.
- **Seamless Navigation**: Links and parameters are seamlessly integrated, ensuring a clean user experience.

---

### Example Walkthrough

1. User visits `/products`.
2. `ProductsPage` renders a list of links using the `PRODUCTS` array.
3. Clicking on a product's link navigates to `/products/:productId`.
4. `ProductDetailPage` uses `useParams` to fetch and display the `productId`.

---
### Path in React Router

#### 1. **Absolute Path**
- **Definition:**  
  An absolute path begins with a `/` and is directly appended after the domain name.  
  It always refers to the same specific route, regardless of the current active route.

- **Usage Example:**

  ```jsx
  <Route path="/products" element={<ProductsPage />} />
  ```
  - When navigating to `/products`, the `ProductsPage` component is rendered.
  - The absolute path does not depend on any parent route's path.

- **Characteristics:**
  - Starts with a `/`.
  - Useful for top-level routes or when you want to ensure the path is globally consistent.

---

#### 2. **Relative Path**
- **Definition:**  
  A relative path does not start with `/`. Instead, it is appended to the **currently active parent route's path**.  
  Child routes automatically inherit the parent route's structure.

- **Usage Example:**

  ```jsx
  <Route path="details" element={<ProductDetailPage />} />
  ```
  - If this route is nested under a parent route with a path `/products`, the resulting route becomes `/products/details`.

- **Characteristics:**
  - Does not start with `/`.
  - The path is appended to the parent route’s path.
  - Ideal for child routes where the context of the parent path is required.

---

### **`relative` Prop in React Router**

The `relative` prop can be used to control the behavior of relative paths in navigational components like `Link`, `NavLink`, or programmatic navigation using `useNavigate`.

#### **Values:**
- `"route"` (default):  
  The relative path is resolved **based on the nearest route path**.  
  This is the most commonly used mode for nested routing scenarios.
  
- `"path"`:  
  The relative path is resolved **based on the current URL path**, not the nearest route.

---

#### **Examples of `relative` Prop Usage**

##### 1. **Default Behavior (`relative="route"`)**

```jsx
<Link to="details">Details</Link>
```

- If the current route is `/products`, the resulting path will be `/products/details`.
- The `relative` prop is `"route"` by default, so you don’t need to specify it explicitly in most cases.

---

##### 2. **Custom Behavior (`relative="path"`)**

```jsx
<Link to="details" relative="path">Details</Link>
```

- If the current URL is `/products/123`, the resulting path will be `/products/123/details`.
- Useful for situations where navigation needs to consider the exact current URL, not just the route path.

---

### Example Code with `relative`

```jsx
import { Link, useNavigate } from "react-router-dom";

function ProductDetailPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Product Details</h1>
      {/* Relative to the route */}
      <Link to="reviews">View Reviews (Relative to Route)</Link>

      {/* Relative to the current path */}
      <Link to="reviews" relative="path">
        View Reviews (Relative to Path)
      </Link>

      {/* Programmatic navigation with relative */}
      <button onClick={() => navigate("reviews", { relative: "path" })}>
        Navigate to Reviews
      </button>
    </>
  );
}
```

---

### Key Differences Between `relative="route"` and `relative="path"`

| **Aspect**             | **`relative="route"`**                       | **`relative="path"`**                       |
|-------------------------|---------------------------------------------|---------------------------------------------|
| **Default Behavior**    | Yes                                        | No (must be explicitly specified)           |
| **Resolved Against**    | Nearest route path                         | Current URL path                            |
| **Use Case**            | Nested routing                             | URL-specific navigation                     |
