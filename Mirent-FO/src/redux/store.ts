import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./features/clients/customersSlice";
import proformaReducer from "./slices/proformaSlice";
import commandeReducer from "./features/commande/commandeSlice";
import authReducer from "./features/auth/authSlice";
import sidebarReducer from "./features/sidebar/SidebarSlice";
import vehiclesReducer from "./features/vehicle/vehiclesSlice";
import { create } from "zustand";
import { Proforma } from "../types/Proforma";

import locationReducer from "../redux/features/lieux/locationSlice";

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
    customer: customersReducer,
    proforma: proformaReducer,
    commande: commandeReducer,
    locations: locationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
