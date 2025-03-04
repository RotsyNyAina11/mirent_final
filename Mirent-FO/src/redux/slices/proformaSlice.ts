import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Définir le type de quote
interface Quote {
  ref: string;
  voiture: string;
  numeroVoiture: string;
  dateDepart: string;
  dateArrivee: string;
  destination: string;
  nombreJours: number;
  carburant: number; // Modifier carburant pour être un nombre
  prixUnitaire: number;
  prixTotal: number;
  isInvoice: boolean; // Ajout du champ pour savoir si c'est une facture
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
    validateProforma: (state, action: PayloadAction<string>) => {
      const quote = state.quotes.find((q) => q.ref === action.payload);
      if (quote) {
        quote.isInvoice = true; // Marquer le devis comme une facture
      }
    },
    addQuote: (state, action: PayloadAction<Quote>) => {
      // Vérifier si un devis avec la même référence existe déjà
      const existingQuote = state.quotes.find(
        (quote) => quote.ref === action.payload.ref
      );
      if (!existingQuote) {
        state.quotes.push(action.payload); // Ajouter le devis dans l'état
      } else {
        alert("Un devis avec cette référence existe déjà !");
      }
    },

    // Autres actions comme ajouter un devis, etc.
  },
});

export const { validateProforma, addQuote } = proformaSlice.actions;
export default proformaSlice.reducer;
