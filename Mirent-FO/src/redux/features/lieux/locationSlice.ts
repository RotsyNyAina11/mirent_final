import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RegionsService } from '../../../services/regions.service';
import { Region } from '../../../types/region';

interface RegionsState {
  regions: Region[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RegionsState = {
  regions: [],
  status: 'idle',
  error: null,
};

export const fetchRegions = createAsyncThunk(
  'regions/fetchRegions',
  async (_, { rejectWithValue }) => {
    try {
      return await RegionsService.findAllWithDetails();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addRegion = createAsyncThunk(
  'regions/addRegion',
  async (region: Omit<Region, 'id'>, { rejectWithValue }) => {
    try {
      return await RegionsService.createFull(region);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateRegion = createAsyncThunk(
  'regions/updateRegion',
  async ({ id, region }: { id: number; region: Partial<Region> }, { rejectWithValue }) => {
    try {
      return await RegionsService.updateFull(id, region);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteRegion = createAsyncThunk(
  'regions/deleteRegion',
  async (id: number, { rejectWithValue }) => {
    try {
      await RegionsService.removeRegion(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRegions.fulfilled, (state, action: PayloadAction<Region[]>) => {
        state.status = 'succeeded';
        state.regions = action.payload;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action as any).payload || null;
      })
      .addCase(addRegion.fulfilled, (state, action: PayloadAction<Region>) => {
        state.regions.push(action.payload);
      })
      .addCase(addRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action as any).payload || null;
      })
      .addCase(updateRegion.fulfilled, (state, action: PayloadAction<Region>) => {
        state.regions = state.regions.map((region) =>
          region.id === action.payload.id ? action.payload : region
        );
      })
      .addCase(updateRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action as any).payload || null;
      })
      .addCase(deleteRegion.fulfilled, (state, action: PayloadAction<number>) => {
        state.regions = state.regions.filter((region) => region.id !== action.payload);
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action as any).payload || null;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = (action as any).payload || null;
        }
      );
  },
});

export default regionsSlice.reducer;