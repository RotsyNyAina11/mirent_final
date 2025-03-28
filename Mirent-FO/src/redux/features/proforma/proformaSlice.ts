// src/redux/features/proforma/proformaSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Proforma } from "../../../models/Proforma";

// Définition de l'état initial du slice
interface ProformaState {
  proformas: Proforma[]; // Liste des proformas
  loading: boolean; // Indicateur de chargement
  error: string | null; // Erreur éventuelle
}

const initialState: ProformaState = {
  proformas: [],
  loading: false,
  error: null,
};

// Action asynchrone pour récupérer les proformas
export const fetchProformas = createAsyncThunk(
  "proforma/fetchProformas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/proforma");
      if (!response.ok) {
        throw new Error("Failed to fetch proformas.");
      }
      return (await response.json()) as Proforma[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Action asynchrone pour créer une nouvelle proforma
export const createProforma = createAsyncThunk(
  "proforma/create",
  async (proforma: Omit<Proforma, "id">, { rejectWithValue }) => {
    try {
      console.log("Données envoyées :", JSON.stringify(proforma, null, 2));

      const response = await fetch("http://localhost:3000/proforma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proforma),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse du serveur :", errorText);
        throw new Error(
          "Erreur lors de la création de la proforma : " + errorText
        );
      }

      return (await response.json()) as Proforma;
    } catch (error: any) {
      console.error("Erreur attrapée :", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Action asynchrone pour mettre à jour une proforma existante
export const updateProforma = createAsyncThunk(
  "proforma/update",
  async (proforma: Proforma, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/proforma/${proforma.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(proforma),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la proforma");
      }

      return (await response.json()) as Proforma;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice Redux pour gérer l'état des proformas
const proformaSlice = createSlice({
  name: "proforma",
  initialState,
  reducers: {},
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
          state.proformas = action.payload;
        }
      )
      .addCase(fetchProformas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProforma.fulfilled,
        (state, action: PayloadAction<Proforma>) => {
          state.loading = false;
          state.proformas.push(action.payload);
        }
      )
      .addCase(createProforma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProforma.fulfilled,
        (state, action: PayloadAction<Proforma>) => {
          state.loading = false;
          const index = state.proformas.findIndex(
            (proforma) => proforma.id === action.payload.id
          );
          if (index >= 0) {
            state.proformas[index] = action.payload;
          }
        }
      )
      .addCase(updateProforma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Sélecteurs pour récupérer les informations de l'état dans le store
export const selectProformasLoading = (state: { proforma: ProformaState }) =>
  state.proforma.loading;
export const selectProformasError = (state: { proforma: ProformaState }) =>
  state.proforma.error;
export const selectProformas = (state: { proforma: ProformaState }) =>
  state.proforma.proformas;

export default proformaSlice.reducer;
