import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vehicle } from "../vehicle/vehiclesSlice";

interface ReservationState {
  reservations: Vehicle[];
}

const initialState: ReservationState = {
  reservations: [],
};

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<Vehicle>) => {
      // Vérifie si le véhicule est déjà réservé
      const exists = state.reservations.some((r) => r.id === action.payload.id);
      if (!exists) {
        state.reservations.push(action.payload);
      }
    },
    removeReservation: (state, action: PayloadAction<number>) => {
      state.reservations = state.reservations.filter(
        (r) => r.id !== action.payload
      );
    },
  },
});

export const { addReservation, removeReservation } = reservationsSlice.actions;
export default reservationsSlice.reducer;
