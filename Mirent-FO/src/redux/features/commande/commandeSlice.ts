import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProformaItem {
  id: number;
  proforma: string;
  vehicleId: number;
  regionId: number;
  prixId: number;
  dateDepart: string;
  dateRetour: string;
  nombreJours: number; // Changed to number
  // destination: string;
  subTotal: number; // Changed to number
  lastaName?: string; // Added clientName property
  reference?: string; // Added reference property
  orderId?: string; // Added orderId property
  confirmed?: boolean; // Added confirmed property
  items?: ProformaItem[]; // Added items property
}

const initialState: ProformaItem = {
  id: 0,
  proforma: "",
  vehicleId: 0,
  regionId: 0,
  prixId: 0,
  dateDepart: "",
  dateRetour: "",
  nombreJours: 0,
  //destination: "",
  subTotal: 0, // Added subTotal with a default value
  items: [], // Initialized items as an empty array
};

interface Proforma {
  id: number;
  proformaNumber: string;
  contractReference: string;
  date: Date;
  clientId: number;
  totalAmount: number;
  notes: string;
  items: ProformaItem[];
}
const commandeSlice = createSlice({
  name: "commande",
  initialState,
  reducers: {
    setOrderDetails: (state, action: PayloadAction<Partial<ProformaItem>>) => {
      // Modified type
      Object.assign(state, action.payload);
    },
    setDuration: (state, action: PayloadAction<string>) => {
      state.nombreJours = parseInt(action.payload, 10);
    },

    setReference: (state, action: PayloadAction<string>) => {
      state.reference = action.payload;
    },
    setRentalStart: (state, action: PayloadAction<string>) => {
      state.dateDepart = action.payload; // Modified to dateDepart
    },
    setRentalEnd: (state, action: PayloadAction<string>) => {
      state.dateRetour = action.payload; // Modified to dateRetour
    },
    confirmOrder: (state, action: PayloadAction<string>) => {
      if (state.orderId === action.payload) {
        state.confirmed = true;
      } else {
        console.error(`Order ID ${action.payload} does not match.`);
      }
    },
    addItem: (state, action: PayloadAction<ProformaItem>) => {
      if (state.items) {
        state.items.push(action.payload);
      }
    },
  },
});

export const {
  setOrderDetails,
  setReference,
  setRentalStart,
  setRentalEnd,
  setDuration,
  confirmOrder,
} = commandeSlice.actions;

export default commandeSlice.reducer;
