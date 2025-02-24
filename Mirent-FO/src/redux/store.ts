import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sidebarReducer from "./slices/SidebarSlice";
import filterReducer from "./slices/filterSlice";
import vehiclesReducer from "./slices/vehiclesSlice";
import { create } from "zustand";
import { Proforma } from "../types/Proforma";
interface ProformaState {
  proformas: Proforma[];
  addProforma: (newProforma: Proforma) => void;
}

export const useProformaStore = create<ProformaState>((set) => ({
  proformas: [],
  addProforma: (newProforma) =>
    set((state) => ({ proformas: [...state.proformas, newProforma] })),
}));

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    sidebar: sidebarReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
