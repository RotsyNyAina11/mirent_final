import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Interface pour un proforma
interface Proforma {
  id: number;
  client: { id: number; lastName: string };
  proformaNumber: string;
  date: string;
  contractReference?: string;
  notes?: string;
  totalAmount: number;
  status: "En attente" | "Confirmé" | "Annulé";
  items: ProformaItem[];
  carburant?: number; // Ajouter le champ carburant pour la mise à jour
}

// Interface pour un élément de proforma
interface ProformaItem {
  id: number;
  vehicle: { id: number; nom: string };
  region: { id: number; nom_region: string };
  prix: { id: number; prix: number };
  dateDepart: string;
  dateRetour: string;
  nombreJours: number;
  subTotal: number;
  carburant: number; // Ajouter le champ carburant
  prixTotal: number; // Ajouter le champ prixTotal
}

// Interface pour les données de création de proforma
interface CreateProformaData {
  clientLastName: string;
  clientEmail?: string;
  clientPhone?: string;
  date: string;
  contractReference?: string;
  notes?: string;
  items: CreateProformaItemData[];
  carburant?: number; // Optionnel lors de la création du proforma global
  prixTotal?: number; // Optionnel lors de la création du proforma global
}

interface CreateProformaItemData {
  vehicleCriteria: { marque?: string; modele?: string; type?: string };
  regionName: string;
  dateDepart: string;
  dateRetour: string;
  // Ajoutez ici les champs nécessaires pour calculer carburant et prixTotal par item
  // Par exemple:
  prixUnitaire?: number;
  quantite?: number;
  carburant?: number;
}

// Interface pour les données de mise à jour de proforma
interface UpdateProformaData {
  id: number;
  proformaId?: number;
  vehicleId?: number;
  regionId?: number;
  prixId?: number;
  dateDepart?: string;
  dateRetour?: string;
  nombreJours?: number;
  subTotal?: number;
}

// Interface pour les critères de recherche de véhicules disponibles
interface FindAvailableVehiclesCriteria {
  marque?: string;
  modele?: string;
  type?: string;
  dateDepart: string;
  dateRetour: string;
}

// Interface pour un véhicule
interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  type: { id: number; type: string };
  status: { id: number; status: string };
}

// État initial
interface ProformasState {
  proformas: Proforma[];
  proforma: Proforma | null;
  availableVehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  updateSuccess: boolean;
  updateError: string | null;
}

const initialState: ProformasState = {
  proformas: [],
  proforma: null,
  availableVehicles: [],
  loading: false,
  error: null,
  updateSuccess: false,
  updateError: null,
};

// Thunk pour créer un proforma
export const createProforma = createAsyncThunk(
  "proformas/createProforma",
  async (proformaData: CreateProformaData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/proforma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proformaData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création du proforma"
        );
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour récupérer tous les proformas
export const fetchProformas = createAsyncThunk(
  "proformas/fetchProformas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/proforma?_expand=client&_expand=items.vehicle" // Ajustez si nécessaire pour inclure carburant et prixTotal
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la récupération des proformas"
        );
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Thunk pour récupérer un proforma par ID
export const fetchProformaById = createAsyncThunk(
  "proformas/fetchProformaById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/proforma/${id}?_expand=client&_expand=items.vehicle&_expand=items.region&_expand=items.prix` // Ajustez si nécessaire
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la récupération du proforma"
        );
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour récupérer les véhicules disponibles
export const fetchAvailableVehicles = createAsyncThunk(
  "proformas/fetchAvailableVehicles",
  async (criteria: FindAvailableVehiclesCriteria, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(criteria as any).toString();
      const response = await fetch(
        `http://localhost:3000/proforma/available-vehicles?${query}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Erreur lors de la récupération des véhicules disponibles"
        );
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour supprimer un proforma
export const deleteProforma = createAsyncThunk(
  "proformas/deleteProforma",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/proforma/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la suppression du proforma"
        );
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour mettre à jour UN SEUL ITEM de proforma
export const updateProforma = createAsyncThunk(
  "proformas/updateProformaItem", // Nom de l'action plus spécifique
  async (proformaItem: UpdateProformaData, { rejectWithValue }) => {
    try {
      const { id, proformaId, ...updateData } = proformaItem;

      const response = await fetch(
        `http://localhost:3000/proforma/${id}`, // Endpoint pour mettre à jour un item
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Erreur lors de la mise à jour de l'item du proforma"
        );
      }
      const data = await response.json();
      return data; // Retourne l'item mis à jour
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice Redux
const proformasSlice = createSlice({
  name: "proformas",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setProforma: (state, action: PayloadAction<Proforma | null>) => {
      state.proforma = action.payload;
    },
    resetUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // Création d'un proforma
    builder
      .addCase(createProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProforma.fulfilled, (state, action) => {
        state.loading = false;
        state.proformas.push(action.payload);
      })
      .addCase(createProforma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Récupération des proformas
    builder
      .addCase(fetchProformas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProformas.fulfilled, (state, action) => {
        state.loading = false;
        state.proformas = action.payload; // Assurez-vous que action.payload contient carburant et prixTotal
      })
      .addCase(fetchProformas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Récupération d'un proforma par ID
    builder
      .addCase(fetchProformaById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.proforma = null;
      })
      .addCase(fetchProformaById.fulfilled, (state, action) => {
        state.loading = false;
        state.proforma = action.payload; // Assurez-vous que action.payload contient carburant et prixTotal
      })
      .addCase(fetchProformaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.proforma = null;
      });

    // Récupération des véhicules disponibles
    builder
      .addCase(fetchAvailableVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.availableVehicles = action.payload;
      })
      .addCase(fetchAvailableVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Suppression d'un proforma
    builder
      .addCase(deleteProforma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProforma.fulfilled, (state, action) => {
        state.loading = false;
        state.proformas = state.proformas.filter(
          (proforma) => proforma.id !== action.payload
        );
      })
      .addCase(deleteProforma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mise à jour d'un proforma
    builder
      .addCase(updateProforma.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
        state.updateError = null;
      })
      .addCase(updateProforma.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.proformas = state.proformas.map((proforma) => {
          if (proforma.id === action.payload.proformaId) {
            return {
              ...proforma,
              items: proforma.items.map((item) =>
                item.id === action.payload.id ? action.payload : item
              ),
            };
          }
          return proforma;
        });
        state.proforma = action.payload; // action.payload devrait contenir les champs mis à jour
      })
      .addCase(updateProforma.rejected, (state, action) => {
        state.loading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

// Exporter les actions
export const { setError, setProforma, resetUpdateStatus } =
  proformasSlice.actions;

// Exporter le reducer
export default proformasSlice.reducer;
