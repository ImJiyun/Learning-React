## Building a Multiple SPAs with React Router

### what is routing?

In SPA, routing refers to the process of navigating between different pages without a full page reloads.

#### SPA (Single Page Application)

- a web application that loads a single HTML page and dynamically updates its content as the user interacts with it, fetching data from the server as needed.
- Pros
  - No full page reload: Uses AJAX to update only necessary components, improving speed and responsiveness.
  - Better performance & UX: Provides a smooth user experience similar to a native app.
  - Reduced server load: The backend does not need to generate a new HTML page for each request.
  - Frontend-Backend decoupling: Enables a clear separation of concerns, making development more flexible.
- Cons
  - Slower initial load: The browser needs to load all necessary resources at once, which can increase the initial load time.
  - SEO challenges: Since content is dynamically loaded, search engines may have difficulty indexing pages.
  - Complex state management: Requires efficient client-side state handling, often using libraries like Vuex (Vue), Redux (React), or Pinia (Vue 3).

#### MPA (Multi Page Application)

- It is a web application that consists of multiple HTML pages, where each request loads a new page from the server
- Pros

  - Better SEO: Since each page is fully loaded from the server, search engines can easily index them.
  - Simpler architecture: Easier to manage without requiring complex client-side state management.
  - Faster initial load: Only the necessary page is loaded, rather than fetching all resources at once.

- Cons:

  - Slower navigation: Each page change requires a full reload, which can lead to longer load times.
  - Higher server load: The backend needs to process and serve an entire HTML page for every request.
  - Less interactive UX: The user experience may feel less fluid compared to an SPA.

### Building routes

#### 1. Define Routes

- latest version : object based

```jsx
// https://example.com/products
// https: protocol
// example.com : domain name
// products : path

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";

// latest version
// react router renders the element when the specific path is active
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/products", element: <ProductsPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

- older version

```jsx
// https://example.com/products
// https: protocol
// example.com : domain name
// products : path

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";

const routeDefinitions = createRoutesFromElements(
  <Route>
    <Route path="/" element={<HomePage />}></Route>
    <Route path="/products" element={<ProductsPage />}></Route>
  </Route>
);

const router = createBrowserRouter(routeDefinitions);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

#### 2. Navigating between pages with links

```jsx
function HomePage() {
  return (
    <>
      <h1>My Home Page</h1>
      <p>
        Go to <a href="/products">the list of products</a>
      </p>
    </>
  );
}
export default HomePage;
```

- with `<a></a>`, the user will send a new request to the server
- and the server will send back a HTML page, which loads all the JS code and restarts the application (it's not a necessary work)
- `Link` prevents the action of sending a request and make the React loads the appropriate element for that URL.
- It will also change the URL without sending a new request
- NOTE: `Link` component renders a regular `a` element

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

### Layouts & Nested Routes

For better user experience, we should make navigation bar

```jsx
import { Link } from "react-router-dom";

function MainNavigation() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
```

- `MainNavigation` should be visible on all pages
- The more pages we have, we have to add this `MainNavigation` in all pages
- It's better to have a layout that wraps all routes

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "/products", element: <ProductsPage /> },
    ],
  },
]);
```

- `RootLayout` acts as a wrapper and a parent routes to the children routes
- In `RootLayout`, we have to tell where the children routes should be rendered to

```jsx
import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
```

- `Outlet` marks the place where the child route elements should be rendered to
- `MainNavigation` will be fixed, and content will be different for different URLs

### Showing error pages with `errorElement`

- Website users might visit URLs that don't exist
- The react-router-dom package will generate an error, and the error will bubble up to root route definition
- with help of `errorElement`, we can render the error page as a fallback page if an error occurs

`ErrorPage.js`

```jsx
import MainNavigation from "../components/MainNavigation";

function ErrorPage() {
  return (
    <>
      <MainNavigation />
      <main>
        <h1>An error occured!</h1>
        <p>Could not find this page!</p>
      </main>
    </>
  );
}

export default ErrorPage;
```

- `App.jsx`

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "/products", element: <ProductsPage /> },
    ],
  },
]);
```

### Working with `NavLink`

- with `NavLink`, we can get a feedback when the current link is active

`MainNavigation.jsx`

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
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
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

`MainNavigation.module.css`

```css
/* note : NavLink renders a tag */
.list a {
  text-decoration: none;
  color: var(--color-primary-400);
}

.list a:hover,
.list a.active {
  color: var(--color-primary-800);
  text-decoration: underline;
}
```

- It takes a special prop - `className`, which takes a function and that function whould return the class name
- that function automatically receives an object, from which we can destrucutre `isActive`
- `isActive` is true when that link is active
- `end` prop means the link with it should only be considered active if the currently active route ends with this path.
  - In this case, when we hit `'/'`, only this URL will be active, not `'/products'`

### Navigating programtically

- So far, we have implemented only UI-based navigation through main navigation bar.
- when a form is submitted, or timer is expired, we might want to trigger a navigation action.

`HomePage.js`

```jsx
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate(); // trigger a navigation

  function navigationHandler() {
    navigate("/products");
  }

  return (
    <>
      <h1>My Home Page</h1>
      <p>
        Go to <Link to="/products">the list of products</Link>
      </p>
      <p>
        <button onClick={navigationHandler}>Navigate</button>
      </p>
    </>
  );
}
export default HomePage;
```

- `useNavigate` hook returns a function that we can change the current route.

### Defining & Using Dynamic Routes

- We might want to load a page for different products
- While loading the same component, the data that will be displayed in there will be different for the different products
- And the path will be different

`App.jsx`

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:productId", element: <ProductDetailPage /> },
    ],
  },
]);
```

- `:` signals the React-router-dom that the path is dynamic
- after `:`, any value can be used

`ProductDetailPage.js`

- We want to know which `productId` was used in `ProductDetailPage`

`ProductDetailPage.js`

```jsx
import { useParams } from "react-router-dom";

function ProductDetailPage() {
  const params = useParams(); // gives an object which we can destructure identifier in route definition
  // the actual value used in the place of place holder
  return (
    <>
      <h1>Product Details</h1>
      <p>{params.productId}</p>
    </>
  );
}

export default ProductDetailPage;
```

- `useParams` returns an object from which we can get the actual value used in the placeholder in route definition
- in this case, we define `productId` in `createBrowserRouter`, so we use `productId` to get the value

### Adding Links for Dynamic Routes

`ProductsPage.js`

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
            <Link to={`/products/${prod.id}`}>{prod.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProductsPage;
```

### Relative & Absoulte Paths

- If a path starts with '/', it means it is an absolute path
- The other case, it means it is a relative path

`App.jsx`

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:productId", element: <ProductDetailPage /> },
    ],
  },
]);
```

- In the above code, the children paths are relative paths
- Those paths are appended after the path of the wrapper parent route

  - If the parent path was `/root` and child path was `products`, we will visit `/root/products`
  - If the child path was `/products`, we will visit `/products`

- NOTE : relative path is relative to the route definitions
  - `products/:productId` is a child of root route and a sibling of `products`
  - So when going up level, it goes to the root path

```jsx
import { Link, useParams } from "react-router-dom";

function ProductDetailPage() {
  const params = useParams(); // gives an object which we can destructure identifier in route definition
  // the actual value used in the place of place holder
  return (
    <>
      <h1>Product Details</h1>
      <p>{params.productId}</p>
      <p>
        <Link to="..">Back</Link>
      </p>
    </>
  );
}

export default ProductDetailPage;
```

- By setting the `relative` prop `path`, it will move to product page
  - Because React Router will remove one segment from that path
- By default, `relative` prop is set to be `route`

```jsx
import { Link, useParams } from "react-router-dom";

function ProductDetailPage() {
  const params = useParams(); // gives an object which we can destructure identifier in route definition
  // the actual value used in the place of place holder
  return (
    <>
      <h1>Product Details</h1>
      <p>{params.productId}</p>
      <p>
        <Link to=".." relative="path">
          Back
        </Link>
      </p>
    </>
  );
}

export default ProductDetailPage;
```

### Index Routes

- When the parent route path and child's one are same, we can add `index` property and set it true
- It means it's the default route that should be displayed if the parent route's path is active

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:productId", element: <ProductDetailPage /> },
    ],
  },
]);
```
