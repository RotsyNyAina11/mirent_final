import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  orderId: string;
  clientName: string;
  clientCountry: string;
  expiration: string;
  priceList: string;
  paymentTerms: string;
  rentalStart: string;
  rentalEnd: string;
  duration: string;
  reference: string;
  voiture: string;
  destination: string;
  carburant: string;
  listePrix: string;
  condtionPaiement: string;
}

const initialState: OrderState = {
  orderId: "",
  clientName: "",
  clientCountry: "",
  expiration: "",
  priceList: "",
  paymentTerms: "",
  rentalStart: "",
  rentalEnd: "",
  duration: "",
  reference: "",
  voiture: "",
  destination: "",
  carburant: "",
  listePrix: "",
  condtionPaiement: "30 jours après", // Corrected placement
};

const commandeSlice = createSlice({
  name: "commande",
  initialState,
  reducers: {
    setOrderDetails: (state, action: PayloadAction<Partial<OrderState>>) => {
      Object.assign(state, action.payload);
    },
    setDuration: (state, action: PayloadAction<string>) => {
      state.duration = action.payload;
    },
    setClientName: (state, action: PayloadAction<string>) => {
      state.clientName = action.payload;
    },
    setReference: (state, action: PayloadAction<string>) => {
      state.reference = action.payload;
    },
    setRentalStart: (state, action: PayloadAction<string>) => {
      state.rentalStart = action.payload;
    },
    setRentalEnd: (state, action: PayloadAction<string>) => {
      state.rentalEnd = action.payload;
    },

    // Ajoutez d'autres reducers pour chaque champ si nécessaire
  },
});

export const {
  setOrderDetails,
  setClientName,
  setReference,
  setRentalStart,
  setRentalEnd,
  setDuration,
  // Exportez d'autres actions si nécessaire
} = commandeSlice.actions;

export default commandeSlice.reducer;
