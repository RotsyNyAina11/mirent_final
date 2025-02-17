import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vehicle } from "../../types/vehicule";

interface VehiclesState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: VehiclesState = {
  vehicles: [
    {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      price: 50,
      imageUrl: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a",
      available: true,
      category: "economy",
    },
    {
      id: "2",
      brand: "BMW",
      model: "X5",
      year: 2023,
      price: 120,
      imageUrl: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b",
      available: true,
      category: "luxury",
    },
  ],
  loading: false,
  error: null,
};

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    toggleVehicleAvailability: (state, action: PayloadAction<string>) => {
      const vehicle = state.vehicles.find((v) => v.id === action.payload);
      if (vehicle) {
        vehicle.available = !vehicle.available;
      }
    },
  },
});

export const { setVehicles, toggleVehicleAvailability } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
