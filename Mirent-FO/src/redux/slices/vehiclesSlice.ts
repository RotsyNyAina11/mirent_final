import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Vehicle {
  id?: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
  type: { id: number; type: string };
  status: { id: number; status: string };
  imageUrl: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  vehiclesType: string[];
  vehiclesStatus: string[];
}

const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  vehiclesType: [],
  vehiclesStatus: [],
};

// Afficher les status de vehicules
export const fetchVehicleStatuses = createAsyncThunk("vehicles/fetchVehicleStatuses", async () => {
  const response = await axios.get("http://localhost:3000/status");
  return response.data;
});

// Afficher les types de  vehicules
export const fetchVehicleTypes = createAsyncThunk("vehicles/fetchVehicleTypes", async () => {
  const response = await axios.get("http://localhost:3000/type");
  return response.data;
});

// Affcher les vehicules
export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async () => {
  const response = await axios.get("http://localhost:3000/vehicles"); 
  return response.data;
});


// Creer un vehicule
export const createVehicle = createAsyncThunk(
  "vehicles/createVehicle",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/vehicles", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create vehicle");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Supprimer un vehicule
export const deleteVehicle = createAsyncThunk("vehicles/deleteVehicle", async (id: number) => {
  await axios.delete(`http://localhost:3000/vehicles/${id}`);
  return id;
});

// Modifier un vehicule
export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/vehicles/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to update vehicle");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  } 
);

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.map((vehicle) =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        );
      })      
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== action.payload);
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.vehiclesType = action.payload;
      })
      .addCase(fetchVehicleStatuses.fulfilled, (state, action) => {
        state.vehiclesStatus = action.payload;
      });
  },
});

export default vehiclesSlice.reducer;
