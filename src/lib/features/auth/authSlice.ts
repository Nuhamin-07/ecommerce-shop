import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

// Mock user data
const mockUser: User = {
  id: 1,
  username: "user",
  email: "user@example.com",
  firstName: "User",
  lastName: "User",
};

const initialState: AuthState = {
  isAuthenticated:
    typeof window !== "undefined"
      ? localStorage.getItem("isAuthenticated") === "true"
      : false,
  user:
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = mockUser;

      if (typeof window !== "undefined") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(mockUser));
      }
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
      }
    },
    register: (
      state,
      action: PayloadAction<{
        username: string;
        email: string;
        password: string;
      }>
    ) => {
      const newUser: User = {
        id: Date.now(),
        username: action.payload.username,
        email: action.payload.email,
        firstName: action.payload.username,
        lastName: "User",
      };

      state.isAuthenticated = true;
      state.user = newUser;

      if (typeof window !== "undefined") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(newUser));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, register } =
  authSlice.actions;
export default authSlice.reducer;
