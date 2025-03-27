import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Proforma, ProformaStatus } from "../../../models/Proforma"; // Assurez-vous que le chemin est correct
import axios from "axios";
import { RootState } from "../../store";

const API_BASE_URL = "http://localhost:3000"; // Remplacez par votre URL

interface ProformaState {
  list: Proforma[];
  loading: boolean;
  error: string | null;
}

const initialState: ProformaState = {
  list: [],
  loading: false,
  error: null,
};

// Async Thunk pour récupérer les proformas
export const fetchProformas = createAsyncThunk(
  "proforma/fetchProformas",
  async () => {
    const response = await axios.get<Proforma[]>(`${API_BASE_URL}/proforma`);
    return response.data;
  }
);

// Async Thunk pour créer une proforma
// Action pour créer une nouvelle proforma
export const createProforma = createAsyncThunk(
  "proforma/createProforma",
  async (proformData: Omit<Proforma, "id" | "createdAt" | "updatedAt">) => {
    const response = await axios.post<Proforma>(
      `${API_BASE_URL}/proforma`,
      proformData
    );
    return response.data;
  }
);

// Async Thunk pour mettre à jour une proforma
export const updateProforma = createAsyncThunk(
  "proformas/updateProforma",
  async (proformData: Proforma) => {
    const response = await axios.put<Proforma>(
      `${API_BASE_URL}/proforma/${proformData.id}`,
      proformData
    );
    return response.data;
  }
);

// Async Thunk pour supprimer une proforma
export const deleteProforma = createAsyncThunk(
  "proforma/deleteProforma",
  async (id: number) => {
    await axios.delete(`${API_BASE_URL}/proforma/${id}`);
    return id; // Retourner l'ID pour mettre à jour l'état
  }
);

export const proformaSlice = createSlice({
  name: "proforma",
  initialState,
  reducers: {
    // Reducers synchrones (si nécessaire)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProformas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProformas.fulfilled,
        (state, action: PayloadAction<Proforma[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(fetchProformas.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Erreur lors de la récupération des proformas.";
      })
      .addCase(createProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProforma.fulfilled,
        (state, action: PayloadAction<Proforma>) => {
          state.loading = false;
          state.list.push(action.payload);
        }
      )
      .addCase(createProforma.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la création de la proforma.";
      })
      .addCase(updateProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProforma.fulfilled,
        (state, action: PayloadAction<Proforma>) => {
          state.loading = false;
          const index = state.list.findIndex(
            (proforma: Proforma) => proforma.id === action.payload.id
          );
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        }
      )
      .addCase(updateProforma.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Erreur lors de la mise à jour de la proforma.";
      })
      .addCase(deleteProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProforma.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.list = state.list.filter(
            (proforma: Proforma): boolean => proforma.id !== action.payload
          );
        }
      )
      .addCase(deleteProforma.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Erreur lors de la suppression de la proforma.";
      });
  },
});

// Exportez les actions synchrones (si vous en avez)
// export const { } = proformaSlice.actions;

// Exportez le reducer
export default proformaSlice.reducer;

// Exportez les sélecteurs pour accéder à l'état
export const selectAllProformas = (state: RootState) => state.proforma.list;
export const selectProformasLoading = (state: RootState) =>
  state.proforma.loading;
export const selectProformasError = (state: RootState) => state.proforma.error;
