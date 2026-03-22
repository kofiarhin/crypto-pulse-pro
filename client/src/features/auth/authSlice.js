import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  initialized: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.error = null;
      state.initialized = true;
    },
    setAuthLoading(state) {
      state.status = "loading";
      state.error = null;
    },
    setAuthInitialized(state) {
      state.initialized = true;
      if (!state.isAuthenticated) {
        state.status = "idle";
      }
    },
    setAuthError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.initialized = true;
    },
  },
});

export const {
  setCredentials,
  setAuthLoading,
  setAuthInitialized,
  setAuthError,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
