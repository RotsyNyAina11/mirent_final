import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sidebarReducer from "./slices/SidebarSlice";
import vehicleReducer from "./slices/VehicleSlice";
import filterReducer from "./slices/filterSlice";
import customerReducer from "./slices/customersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    sidebar: sidebarReducer,
    filter: filterReducer,
    customer: customerReducer,
    // Ajoutez vos reducers ici
  },
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
