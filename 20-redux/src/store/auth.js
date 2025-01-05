import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
};

// when we have multiple slices, we still have only one Redux store
const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});
// devs don't have to worry about creating action objects and coming up with unique identifiers
export const authActions = authSlice.actions;

export default authSlice.reducer;
