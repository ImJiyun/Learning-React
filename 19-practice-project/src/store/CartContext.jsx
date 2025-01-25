import { createContext, useReducer, useState } from "react";

// arg here is the default value of the context
// object created by createContext will be a component that provides the context value
const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
});

// state and action parameters are provided by React
function cartReducer(state, action) {
  // action object tells the reducer how to update the state
  // the cartReducer returns an updated state
  if (action.type === "ADD_ITEM") {
    // ... update the state to add a meal item
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedItems = [...state.items]; // copy the existing items array

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // if the item is not in the cart, add it
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ITEM") {
    // ... update the state to remove a meal item
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];
    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, items: updatedItems };
  }

  return state;
}

// context provider component that wraps the components that need access to the context value
export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] }); // useReducer is a hook used to manage complex state
  // it needs a reducer function and an initial state

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
  }

  const cartContext = {
    items: cart.items,
    addItem: addItem,
    removeItem: removeItem,
  };

  console.log(cartContext);

  // prior React 19, CartContext.Provider was used to provide the context value to the components
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
