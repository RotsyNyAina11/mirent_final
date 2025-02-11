import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Nous allons créer ce slice plus tard

export const store = configureStore({
  reducer: {
    auth: authReducer, // Ajoutez vos reducers ici
  },
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
