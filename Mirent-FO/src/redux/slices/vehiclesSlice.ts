import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/vehicles";

// Définition du type Vehicle
interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  type: string;
  immatriculation: string;
  nombrePlace: number;
  status: string;
}

// Définition du state initial
interface VehiclesState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: VehiclesState = {
  vehicles: [],
  loading: false,
  error: null,
};

// Récupérer tous les véhicules
export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async () => {
  const response = await axios.get(API_URL);
  return response.data as Vehicle[];
});

// Ajouter un véhicule
export const addVehicle = createAsyncThunk("vehicles/addVehicle", async (vehicle: Omit<Vehicle, "id">) => {
  const response = await axios.post(API_URL, vehicle);
  return response.data as Vehicle;
});

// Modifier un véhicule
export const updateVehicle = createAsyncThunk("vehicles/updateVehicle", async (vehicle: Vehicle) => {
  const response = await axios.put(`${API_URL}/${vehicle.id}`, vehicle);
  return response.data as Vehicle;
});

// Supprimer un véhicule
export const deleteVehicle = createAsyncThunk("vehicles/deleteVehicle", async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Création du slice Redux
const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVehicles.fulfilled, (state, action: PayloadAction<Vehicle[]>) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addVehicle.fulfilled, (state, action: PayloadAction<Vehicle>) => {
        state.vehicles.push(action.payload);
      })
      .addCase(updateVehicle.fulfilled, (state, action: PayloadAction<Vehicle>) => {
        state.vehicles = state.vehicles.map((veh) =>
          veh.id === action.payload.id ? action.payload : veh
        );
      })
      .addCase(deleteVehicle.fulfilled, (state, action: PayloadAction<number>) => {
        state.vehicles = state.vehicles.filter((veh) => veh.id !== action.payload);
      });
  },
});

export default vehiclesSlice.reducer;
