import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import { Vehicle } from "../vehicle/vehiclesSlice"; // Si Vehicle est nécessaire, mais probablement pas pour le type ReservationState

export interface Reservation {
  id: string;
  vehicleId: number;
  startDate: string;
  endDate: string;
  fullName: string;
  phone: string;
  email: string;
  regionName: string;
  totalPrice: number;
}

interface ReservationState {
  reservations: Reservation[];
}

const initialState: ReservationState = {
  reservations: [],
};

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<Reservation>) => {
      // Pour éviter les doublons si l'ID est généré côté client avant d'être envoyé au serveur
      // ou si une réservation est ajoutée plusieurs fois par erreur.
      // Si l'ID est toujours généré par le serveur, cette vérification est moins critique ici
      const exists = state.reservations.some((r) => r.id === action.payload.id);
      if (!exists) {
        state.reservations.push(action.payload);
      }
    },
    // Si vous utilisez l'ID de la réservation pour la suppression
    removeReservation: (state, action: PayloadAction<string>) => {
      // Assurez-vous que le type de PayloadAction correspond au type d'ID de réservation
      state.reservations = state.reservations.filter(
        (r) => r.id !== action.payload
      );
    },
  },
});

export const { addReservation, removeReservation } = reservationsSlice.actions;
export default reservationsSlice.reducer;
