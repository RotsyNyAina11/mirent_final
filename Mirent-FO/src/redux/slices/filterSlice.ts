import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  type: string | null;
  priceRange: {
    min: number;
    max: number;
  };
  transmission: string | null;
  seatsRange: {
    min: number;
    max: number;
  };
}

const initialState: FilterState = {
  type: null,
  priceRange: {
    min: 0,
    max: 1000,
  },
  transmission: null,
  seatsRange: {
    min: 0,
    max: 20,
  },
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setTypeFilter(state, action: PayloadAction<string | null>) {
      state.type = action.payload;
    },
    setPriceRange(state, action: PayloadAction<{ min: number; max: number }>) {
      state.priceRange = action.payload;
    },
    setTransmissionFilter(state, action: PayloadAction<string | null>) {
      state.transmission = action.payload;
    },
    setSeatsRange(state, action: PayloadAction<{ min: number; max: number }>) {
      state.seatsRange = action.payload;
    },
    clearFilters(state) {
      return initialState;
    },
  },
});

export const {
  setTypeFilter,
  setPriceRange,
  setTransmissionFilter,
  setSeatsRange,
  clearFilters,
} = filterSlice.actions;
export default filterSlice.reducer;
