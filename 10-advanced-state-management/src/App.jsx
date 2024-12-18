import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";
import Product from "./components/Product.jsx";
import CartContextProvider from "./store/shopping-cart-context.jsx";

function App() {
  return (
    // wrapp the context around the content that should be able to access this context
    // if we are using older version before React 19, we should use Provider property on the CartContext object to wrapp the components
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
