import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProformaItem {
    vehicleId: number;
    regionId: number;
    prixId: number;
    dateDepart: string;
    dateRetour: string;
}

interface ProformaState {
    clientId: number;
    date: string;
    contractReference: string;
    notes: string;
    items: ProformaItem[];
    proformaNumber: string;
    totalAmount: number;
    isLoading: boolean;
    error: string|null;
    proformaData: any | null;
}

const initialState: ProformaState = {
    clientId: 0,
    date: '',
    contractReference: '',
    notes: '',
    items: [],
    proformaNumber: '',
    totalAmount: 0,
    isLoading: false,
    error: null,
    proformaData: null
};

export const createProforma = createAsyncThunk(
    'proforma/createProforma',
    async (proformaData: any, { rejectWithValue }) => {
        try {
            const response = await fetch('/proforma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proformaData),
            });

            if (!response.ok) {
                return rejectWithValue(await response.json());
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const proformaSlice = createSlice({
    name: 'proforma',
    initialState,
    reducers: {
        setClientId: (state, action: PayloadAction<number>) => {
            state.clientId = action.payload;
        },
        setDate: (state, action: PayloadAction<string>) => {
            state.date = action.payload;
        },
        setContractReference: (state, action: PayloadAction<string>) => {
            state.contractReference = action.payload;
        },
        setNotes: (state, action: PayloadAction<string>) => {
            state.notes = action.payload;
        },
        addItem: (state, action: PayloadAction<ProformaItem>) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items.splice(action.payload, 1);
        },
        clearItems: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProforma.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProforma.fulfilled, (state, action) => {
                state.isLoading = false;
                state.proformaData = action.payload;
            })
            .addCase(createProforma.rejected, (state, action: any) => {
                state.isLoading = false;
                state.error = action.payload.message || 'Error creating proforma';
            });
    },
});

export const {
    setClientId,
    setDate,
    setContractReference,
    setNotes,
    addItem,
    removeItem,
    clearItems,
} = proformaSlice.actions;

export default proformaSlice.reducer;