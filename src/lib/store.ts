import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./features/favorites/favoritesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
