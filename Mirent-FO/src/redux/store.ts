import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import authReducer from "./features/auth/authSlice";
import sidebarReducer from "./features/sidebar/SidebarSlice";
import vehiclesReducer from "./features/vehicle/vehiclesSlice";
import locationReducer from "./features/lieux/locationSlice";
import customersReducer from "./features/clients/customersSlice";
import reservationReducer from "./features/reservation/reservationSlice";
import bonDeCommandeReducer from "./features/commande/bonDeCommandeSlice";
import paiementReducer from "./features/paiement/paiementSlice";
import factureReducer from "./features/facture/factureSlice"

// 1. Combine tous vos réducteurs en un seul
const rootReducer = combineReducers({
  auth: authReducer,
  vehicles: vehiclesReducer,
  sidebar: sidebarReducer,
  customer: customersReducer,
  region: locationReducer,
  reservations: reservationReducer,
  bonDeCommande: bonDeCommandeReducer,
  paiements: paiementReducer,
  facture: factureReducer,
});

// 2. Configure la persistance
const persistConfig = {
  key: "root", 
  storage, 
  whitelist: ["auth", "reservations", "vehicles", "customer", "region"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store); 

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;