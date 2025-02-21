// redux/slices/vehiclesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
  type: string;
  status: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
}

const initialState: VehicleState = {
  vehicles: [],
  loading: false,
};

export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async () => {
  const response = await axios.get("http://localhost:3000/vehicles"); 
  return response.data;
});

export const deleteVehicle = createAsyncThunk("vehicles/deleteVehicle", async (id: number) => {
  await axios.delete(`http://localhost:3000/vehicles/${id}`);
  return id;
});

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
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== action.payload);
      });
  },
});

export default vehiclesSlice.reducer;
