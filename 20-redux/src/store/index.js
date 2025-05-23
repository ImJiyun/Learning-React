import { createStore } from "redux";
import { configureStore } from "@reduxjs/toolkit";
// configureStore is like createStore, but it merges multiple reducers into one reducer

import counterReducer from "./counter";
import authReducer from "./auth";

/*
// working with various states
const counterReducer = (state = initialState, action) => {
  // the objects which we return in the reducer will overwrite the existing state
  // so we should set all other states when updating a piece of state

  // we MUST NOT mutate the existing state
  // INSTEAD overwrite it by returning a brand new state object
  // objects are reference balues in JS
  if (action.type === "increment") {
    return {
      counter: state.counter + 1,
      showCounter: state.showCounter,
    };
  }

  if (action.type === "increase") {
    return {
      counter: state.counter + action.amount,
      showCounter: state.showCounter,
    };
  }

  if (action.type === "decrement") {
    return {
      counter: state.counter - 1,
      showCounter: state.showCounter,
    };
  }

  if (action.type === "toggle") {
    return {
      counter: state.counter,
      showCounter: !state.showCounter,
    };
  }

  return state;
};
*/

// const store = createStore(counterSlice.reducer); // it passes reducer function
const store = configureStore({
  reducer: { counter: counterReducer, auth: authReducer },
}); // it passes a configuration object



export default store;
