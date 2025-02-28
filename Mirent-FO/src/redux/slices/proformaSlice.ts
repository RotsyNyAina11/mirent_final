import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Quote {
  ref: string;
  voiture: string;
  numeroVoiture: string;
  dateDepart: string;
  dateArrivee: string;
  nombreJours: number;
  carburant: string;
  prixUnitaire: number;
  prixTotal: number;
}

interface ProformaState {
  quotes: Quote[];
}

const initialState: ProformaState = {
  quotes: [],
};

const proformaSlice = createSlice({
  name: "proforma",
  initialState,
  reducers: {
    addQuote: (state, action: PayloadAction<Quote>) => {
      state.quotes.push(action.payload);
    },
    removeQuote: (state, action: PayloadAction<string>) => {
      state.quotes = state.quotes.filter(
        (quote) => quote.ref !== action.payload
      );
    },
  },
});

export const { addQuote, removeQuote } = proformaSlice.actions;
export default proformaSlice.reducer;
