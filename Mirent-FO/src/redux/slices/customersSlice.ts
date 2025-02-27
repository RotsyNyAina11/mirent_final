import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  logo: string; // Stocke l'URL du logo
}

interface ClientState {
  clients: Customer[];
  loading: boolean;
  error: string | null;
}

// État initial
const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
};

// 🔄 **Async Thunks**
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async () => {
    const response = await fetch("http://localhost:3000/clients");
    return (await response.json()) as Customer[];
  }
);

export const addClient = createAsyncThunk(
  "clients/addClient",
  async (client: Omit<Customer, "id">) => {
    const formData = new FormData();
    formData.append("firstName", client.firstName);
    formData.append("lastName", client.lastName);
    formData.append("email", client.email);
    formData.append("phone", client.phone);

    if (client.logo) {
      const file = await fetch(client.logo).then((res) => res.blob());
      formData.append("logo", file, "logo.jpg");
    }

    const response = await fetch("http://localhost:3000/clients", {
      method: "POST",
      body: formData,
    });

    return (await response.json()) as Customer;
  }
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async (client: Customer) => {
    const formData = new FormData();
    formData.append("firstName", client.firstName);
    formData.append("lastName", client.lastName);
    formData.append("email", client.email);
    formData.append("phone", client.phone);

    if (client.logo) {
      const file = await fetch(client.logo).then((res) => res.blob());
      formData.append("logo", file, "logo.jpg");
    }

    const response = await fetch(`http://localhost:3000/clients/${client.id}`, {
      method: "PUT",
      body: formData,
    });

    return (await response.json()) as Customer;
  }
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id: number) => {
    await fetch(`http://localhost:3000/clients/${id}`, { method: "DELETE" });
    return id;
  }
);

// **Slice Redux**
const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchClients.fulfilled,
        (state, action: PayloadAction<Customer[]>) => {
          state.loading = false;
          state.clients = action.payload;
        }
      )
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Erreur inconnue";
      })
      .addCase(
        addClient.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.clients.push(action.payload);
        }
      )
      .addCase(
        updateClient.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          const index = state.clients.findIndex(
            (c) => c.id === action.payload.id
          );
          if (index !== -1) {
            state.clients[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteClient.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.clients = state.clients.filter((c) => c.id !== action.payload);
        }
      );
  },
});

export default clientSlice.reducer;
