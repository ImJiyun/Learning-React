import { createSlice } from "@reduxjs/toolkit";

const initialCounterState = { counter: 0, showCounter: true };

// createSlice needs an object as an argument
const counterSlice = createSlice({
  name: "counter",
  initialState: initialCounterState,
  // every method automatically recieve the latest state
  // createSlice creates unique action identifiers for different reducers
  reducers: {
    increment(state) {
      state.counter++; // it seems mutating the state, but it doesn't!
    },
    decrement(state) {
      state.counter--;
    },
    increase(state, action) {
      state.counter = state.counter + action.payload;
    },
    toggleCounter(state) {
      state.showCounter = !state.showCounter;
    },
  },
});
export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
