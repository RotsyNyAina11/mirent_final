import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
  imageUrl: string;
  type: {
    id: number;
    type: string;
  };
  status: {
    id: number;
    status: string;
  };
}

export interface VehicleType {
  id: number;
  type: string;
}

export interface VehicleStatus {
  id: number;
  status: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  vehiclesType: VehicleType[];
  vehiclesStatus: VehicleStatus[];
  vehiclesLoading: boolean;
  vehiclesError: string | null;
  vehiclesTypeLoading: boolean;
  vehiclesTypeError: string | null;
  vehiclesStatusLoading: boolean;
  vehiclesStatusError: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  vehiclesType: [],
  vehiclesStatus: [],
  vehiclesLoading: false,
  vehiclesError: null,
  vehiclesTypeLoading: false,
  vehiclesTypeError: null,
  vehiclesStatusLoading: false,
  vehiclesStatusError: null,
};

export const fetchVehicleStatuses = createAsyncThunk(
  "vehicles/fetchVehicleStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/status");
      return response.data as VehicleStatus[];
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching vehicle statuses:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error(
          "An unknown error occurred while fetching vehicle statuses:",
          error
        );
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Afficher les types de  vehicules
export const fetchVehicleTypes = createAsyncThunk(
  "vehicles/fetchVehicleTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/type");
      return response.data as VehicleType[];
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching vehicle types:", error.message);
        return rejectWithValue(error.message);
      } else {
        console.error(
          "An unknown error occurred while fetching vehicle types:",
          error
        );
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Affcher les vehicules
export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchVehicles",
  async () => {
    const response = await axios.get("http://localhost:3000/vehicles");
    return response.data as Vehicle[];
  }
);

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
export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  async (id: number) => {
    await axios.delete(`http://localhost:3000/vehicles/${id}`);
    return id;
  }
);

// Modifier un vehicule
export const updateVehicle = createAsyncThunk(
  "vehicles/updateVehicle",
  async (
    { id, formData }: { id: number; formData: FormData },
    { rejectWithValue }
  ) => {
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
        state.vehiclesTypeLoading = true;
        state.vehiclesTypeError = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.vehiclesTypeLoading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.vehiclesTypeLoading = false;
        state.vehiclesTypeError = action.payload as string;
        console.error("Error fetching vehicle types:", action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        console.error("Failed to create vehicle:", action.payload);
      })
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.vehiclesError = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        console.log("API response:", action.payload);
        state.vehicles = state.vehicles.map((vehicle) => {
          if (vehicle.id === action.payload.id) {
            console.log("Updated vehicle:", action.payload);
            return action.payload;
          }
          return vehicle;
        });
        console.log("Updated state:", state.vehicles);
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.vehiclesError = action.payload as string;
        console.error("Failed to update vehicle:", action.payload);
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter(
          (vehicle) => vehicle.id !== action.payload
        );
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.vehiclesTypeLoading = false;
        state.vehiclesType = action.payload;
      })
      .addCase(fetchVehicleTypes.rejected, (state, action) => {
        state.vehiclesTypeLoading = false;
        state.vehiclesTypeError = action.payload as string;
        console.error("Failed to fetch vehicle types:", action.payload);
      })
      .addCase(fetchVehicleStatuses.pending, (state) => {
        state.vehiclesStatusLoading = true;
        state.vehiclesStatusError = null;
      })
      .addCase(fetchVehicleStatuses.fulfilled, (state, action) => {
        state.vehiclesStatusLoading = false;
        state.vehiclesStatus = action.payload;
      })
      .addCase(fetchVehicleStatuses.rejected, (state, action) => {
        state.vehiclesStatusLoading = false;
        state.vehiclesStatusError = action.payload as string;
        console.error("Error fetching vehicle statuses:", action.payload);
      });
  },
});

export default vehiclesSlice.reducer;
