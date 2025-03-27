import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Reservation } from "../../../models/Reservation";
import axios from "axios";
import { RootState } from "../../store";

const API_BASE_URL = "http://localhost:3000"; // Remplacez par votre URL

interface ReservationState {
  list: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  list: [],
  loading: false,
  error: null,
};

// Async Thunk pour récupérer les réservations
export const fetchReservations = createAsyncThunk(
  "reservations/fetchReservations",
  async () => {
    const response = await axios.get<Reservation[]>(
      `${API_BASE_URL}/reservations`
    );
    return response.data;
  }
);

// Async Thunk pour créer une réservation
export const createReservation = createAsyncThunk(
  "reservations/createReservation",
  async (reservationData: Omit<Reservation, "id">) => {
    const response = await axios.post<Reservation>(
      `${API_BASE_URL}/reservations`,
      reservationData
    );
    return response.data;
  }
);

// Vous pouvez ajouter des Thunks pour la mise à jour et la suppression

export const reservationSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    // Reducers synchrones (si nécessaire)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReservations.fulfilled,
        (state, action: PayloadAction<Reservation[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Erreur lors de la récupération des réservations.";
      })
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createReservation.fulfilled,
        (state, action: PayloadAction<Reservation>) => {
          state.loading = false;
          state.list.push(action.payload); // Ajouter la nouvelle réservation à la liste
        }
      )
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Erreur lors de la création de la réservation.";
      });
    // Ajoutez les cas pour les autres Async Thunks (update, delete)
  },
});

// Exportez les actions synchrones (si vous en avez)
// export const { } = reservationSlice.actions;

// Exportez le reducer
export default reservationSlice.reducer;

// Exportez les sélecteurs pour accéder à l'état
export const selectAllReservations = (state: RootState) =>
  state.reservations.list;
export const selectReservationsLoading = (state: RootState) =>
  state.reservations.loading;
export const selectReservationsError = (state: RootState) =>
  state.reservations.error;
