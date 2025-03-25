import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/proforma";

export enum ProformaStatus {
  BROUILLON = "Brouillon",
  ENVOYEE = "Envoyée",
  CONFIRMEE = "Confirmée",
  ANNULEE = "Annulée",
}

export interface Proforma {
  id: number;
  proformaNumber: string;
  date: string;
  totalAmount: number;
  status: ProformaStatus;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProformaItem {
  id: number;
  dateDepart: string;
  dateRetour: string;
  nombreJours: number;
  subTotal: number;
  proformaId: number;
  vehicleId: number;
  prixId: number;
  regionId: number;
}

export const fetchProformas = createAsyncThunk(
  "proforma/fetchAll",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const fetchProformaStatuses = createAsyncThunk(
  "proforma/fetchStatuses",
  async () => {
    const response = await axios.get("http://localhost:3000/proforma/statuses");
    return response.data;
  }
);

export const createProforma = createAsyncThunk(
  "proforma/create",
  async (proformaData: Partial<Proforma>) => {
    const response = await axios.post(API_URL, proformaData);
    return response.data;
  }
);

export const updateProforma = createAsyncThunk(
  "proforma/update",
  async ({
    id,
    updatedData,
  }: {
    id: number;
    updatedData: Partial<Proforma>;
  }) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  }
);

export const deleteProforma = createAsyncThunk(
  "proforma/delete",
  async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

interface ProformaState {
  proformas: Proforma[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchStatusesStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  clientId: number;
  date: string;
  contractReference: string;
  notes: string;
  items: ProformaItem[]; // Ajout de items
}

const initialState: ProformaState = {
  proformas: [],
  fetchStatus: "idle",
  fetchStatusesStatus: "idle",
  createStatus: "idle",
  error: null,
  clientId: 0,
  date: "",
  contractReference: "",
  notes: "",
  items: [], // Initialisation de items
};

const proformaSlice = createSlice({
  name: "proforma",
  initialState,
  reducers: {
    setClientId: (state, action: PayloadAction<number>) => {
      state.clientId = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setContractReference: (state, action: PayloadAction<string>) => {
      state.contractReference = action.payload;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    setItems: (state, action: PayloadAction<ProformaItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProformas.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchProformas.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.proformas = action.payload;
      })
      .addCase(fetchProformas.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message || null;
      })
      .addCase(createProforma.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createProforma.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.proformas.push(action.payload);
      })
      .addCase(createProforma.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateProforma.fulfilled, (state, action) => {
        const index = state.proformas.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.proformas[index] = action.payload;
        }
      })
      .addCase(deleteProforma.fulfilled, (state, action) => {
        state.proformas = state.proformas.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(fetchProformaStatuses.pending, (state) => {
        state.fetchStatusesStatus = "loading";
      })
      .addCase(fetchProformaStatuses.fulfilled, (state) => {
        state.fetchStatusesStatus = "succeeded";
      })
      .addCase(fetchProformaStatuses.rejected, (state, action) => {
        state.fetchStatusesStatus = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const {
  setClientId,
  setDate,
  setContractReference,
  setNotes,
  setItems,
} = proformaSlice.actions;
export default proformaSlice.reducer;
