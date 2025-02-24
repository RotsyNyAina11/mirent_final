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

export const fetchVehicleStatuses = createAsyncThunk("vehicles/fetchVehicleStatuses", async () => {
  const response = await axios.get("http://localhost:3000/status");
  return response.data;
});


export const fetchVehicleTypes = createAsyncThunk("vehicles/fetchVehicleTypes", async () => {
  const response = await axios.get("http://localhost:3000/type");
  return response.data;
});

export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async () => {
  const response = await axios.get("http://localhost:3000/vehicles"); 
  return response.data;
});

export const createVehicle = createAsyncThunk("vehicles/createVehicle", async (vehicle: Vehicle) => {
  const response = await axios.post("http://localhost:3000/vehicles", vehicle);
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
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
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
