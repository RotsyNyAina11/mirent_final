import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; role: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Thunk pour le login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", credentials);
      const token = response.data.access_token;

      // Décoder le JWT pour récupérer email et role
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { email: payload.email, role: payload.role, token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Thunk pour le logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        await axios.post(
          "http://localhost:3000/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      
      // Nettoyage côté client se fait dans le reducer
      return null;
    } catch (err: any) {
      // Même en cas d'erreur API, on procède au logout côté client
      console.error("Logout API error:", err);
      return null;
    }
  }
);

// Thunk pour vérifier le token
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue(null);
      }

      // Vérifier l'expiration du token (JWT)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; 
      if (Date.now() > expiry) {
        return rejectWithValue(null);
      }

      return { email: payload.email, role: payload.role, token };
    } catch (err: any) {
      return rejectWithValue(err.message || "Token verification failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logout synchrone (pour une déconnexion immédiate sans appel API)
    logoutImmediate(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ email: string; role: string; token: string }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = { email: action.payload.email, role: action.payload.role };
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        // Même en cas d'erreur, on procède au logout côté client
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        state.error = action.payload as string;
      })
      
      // Verify token cases
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action: PayloadAction<{ email: string; role: string; token: string }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = { email: action.payload.email, role: action.payload.role };
        state.token = action.payload.token;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        state.error = action.payload as string;
      });
  },
});

export const { logoutImmediate, clearError } = authSlice.actions;
export default authSlice.reducer;