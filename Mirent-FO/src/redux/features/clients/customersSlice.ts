import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "../../../types/clientDetail";

interface ClientState {
  clients: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
};

const API_URL = "http://localhost:3000/clients";


export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erreur lors du chargement des clients");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addClient = createAsyncThunk(
  "clients/addClient",
  async (
    client: { lastName: string; email: string; phone: string; logo?: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("lastName", client.lastName);
      formData.append("email", client.email);
      formData.append("phone", client.phone);
      if (client.logo) {
        formData.append("logo", client.logo);
      }

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout du client");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async (
    client: { id: number; lastName: string; email: string; phone: string; logo?: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("lastName", client.lastName);
      formData.append("email", client.email);
      formData.append("phone", client.phone);
      if (client.logo) {
        formData.append("logo", client.logo);
      }

      const res = await fetch(`${API_URL}/${client.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du client");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression du client");
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ----------------------
// 📌 Slice Redux
// ----------------------
const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setClients(state, action: PayloadAction<Customer[]>) {
      state.clients = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add
      .addCase(addClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
      })
      // Update
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.clients[index] = action.payload;
      })
      // Delete
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setClients } = clientSlice.actions;
export default clientSlice.reducer;
