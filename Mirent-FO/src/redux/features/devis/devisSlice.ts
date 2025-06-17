// src/redux/features/devis/devisSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define interfaces for your DTOs (align with your NestJS DTOs)
export interface CreateDevisItemDto {
  quantity: 1;
  regionId: number;
  vehiculeId: number;
}

export interface CreateDevisDto {
  clientId: number;
  items: CreateDevisItemDto[];
  startDate: string; 
  endDate: string;   
  includesFuel: boolean;
  fuelCostPerDay?: number;
}

export interface UpdateDevisDto {
  clientId?: number;
  items?: CreateDevisItemDto[];
  startDate?: string;
  endDate?: string;
  includesFuel?: boolean;
  fuelCostPerDay?: number;
  status?: string;
}

// Interface for the Devis entity received from the backend
export interface Devis {
  id: string;
  clientId: number;
  items: any[]; 
  totalAmount: number;
  startDate: string;
  endDate: string;
  includesFuel: boolean;
  fuelCostPerDay?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  client?: any; 
}

interface DevisState {
  devis: Devis[];
  loading: boolean;
  error: string | null;
  selectedDevis: Devis | null; 
}

const initialState: DevisState = {
  devis: [],
  loading: false,
  error: null,
  selectedDevis: null, 
};

// Async Thunks
export const createDevis = createAsyncThunk(
  'devis/createDevis',
  async (devisData: CreateDevisDto, { rejectWithValue }) => {
    try {
      const response = await axios.post<Devis>('http://localhost:3000/devis', devisData); 
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        // More specific error handling for Axios errors
        return rejectWithValue(err.response.data.message || 'Failed to create devis');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchDevis = createAsyncThunk(
  'devis/fetchDevis',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Devis[]>('http://localhost:3000/devis'); 
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch devis');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchDevisById = createAsyncThunk(
  'devis/fetchDevisById',
  async(id: string, {rejectWithValue}) => {
    try{
      const response = await axios.get<Devis>(`http://localhost:3000/devis/${id}`);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch devis by ID');
      }
      return rejectWithValue('An unknown error occurred while fetching devis by ID');
    }
  }
);

// Interface for the arguments passed to updateDevis
interface UpdateDevisArgs {
  id: string;
  updateDevisDto: UpdateDevisDto;
}
export const updateDevis = createAsyncThunk(
  'devis/updateDevis',
  async ({ id, updateDevisDto }: UpdateDevisArgs, { rejectWithValue }) => {
    try {
      const response = await axios.patch<Devis>(`http://localhost:3000/devis/${id}`, updateDevisDto);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to update devis');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Interface for the arguments passed to deleteDevis
export const deleteDevis = createAsyncThunk(
  'devis/deleteDevis',
  async (id: string, { rejectWithValue }) => {
    try {
      // NestJS @HttpCode(HttpStatus.NO_CONTENT) for DELETE means no content is returned,
      await axios.delete(`http://localhost:3000/devis/${id}`);
      return id; 
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.message || 'Failed to delete devis');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


const devisSlice = createSlice({
  name: 'devis',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createDevis
      .addCase(createDevis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDevis.fulfilled, (state, action: PayloadAction<Devis>) => {
        state.loading = false;
        state.devis.push(action.payload); 
        state.error = null;
      })
      .addCase(createDevis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchDevis (optional, but good for management)
      .addCase(fetchDevis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevis.fulfilled, (state, action: PayloadAction<Devis[]>) => {
        state.loading = false;
        state.devis = action.payload;
        state.error = null;
      })
      .addCase(fetchDevis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //  fetchDevisById 
      .addCase(fetchDevisById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedDevis = null; 
      })
      .addCase(fetchDevisById.fulfilled, (state, action: PayloadAction<Devis>) => {
        state.loading = false;
        state.selectedDevis = action.payload; 
        state.error = null;
      })
      .addCase(fetchDevisById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedDevis = null;
      })
      // updateDevis 
      .addCase(updateDevis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevis.fulfilled, (state, action: PayloadAction<Devis>) => {
        state.loading = false;
        // Find the updated devis in the array and replace it
        const index = state.devis.findIndex(devis => devis.id === action.payload.id);
        if (index !== -1) {
          state.devis[index] = action.payload;
        }
        // If the updated devis was also the selected one, update it
        if (state.selectedDevis?.id === action.payload.id) {
          state.selectedDevis = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDevis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteDevis
      .addCase(deleteDevis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDevis.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Remove the deleted devis from the array
        state.devis = state.devis.filter(devis => devis.id !== action.payload);
        // If the selected devis was deleted, clear it
        if (state.selectedDevis?.id === action.payload) {
          state.selectedDevis = null;
        }
        state.error = null;
      })
      .addCase(deleteDevis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default devisSlice.reducer;