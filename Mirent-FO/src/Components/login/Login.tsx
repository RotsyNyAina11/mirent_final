import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Collapse,
  Paper,
  CircularProgress,
  InputAdornment,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import loginHorizontal from "../../assets/horizontal.png";

const theme = createTheme({
  palette: {
    primary: { main: "#0f172a" },
    secondary: { main: "#475569" },
    success: { main: "#10b981" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "0.5px",
      color: "#0f172a",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.9rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.85)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "12px",
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            backgroundColor: "#0e1e40",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#f8fafc",
            "&:hover fieldset": { borderColor: "#0f172a" },
            "&.Mui-focused fieldset": { borderColor: "#0f172a" },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#0f172a",
          },
        },
      },
    },
  },
});

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/acceuil";
        }, 1500);
      } else {
        setError("Identifiants incorrects.");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Échec de la connexion. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        sx={{
          minHeight: "100vh",
          backgroundImage: `url('/bg-voiture.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: "blur(6px)",
            background:
              "linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6))",
            zIndex: 1,
          },
        }}
      >
        {/* Logo Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 3, md: 5 },
            zIndex: 2,
          }}
        >
          <Box
            component="img"
            src={loginHorizontal}
            alt="Mirent Logo"
            sx={{
              width: { xs: "80%", sm: "60%", md: "75%" },
              maxWidth: "500px",
              animation: "fadeIn 0.8s ease-in",
            }}
          />
        </Grid>

        {/* Form Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 3, md: 5 },
            zIndex: 2,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              maxWidth: 420,
              p: { xs: 3, sm: 4 },
              animation: "slideUp 0.8s ease-out",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="h4"
              sx={{ textAlign: "center", mb: 3, fontWeight: 700 }}
            >
              Portail Mirent Pro
            </Typography>

            <Collapse in={!!error}>
              <Alert severity="error">{error}</Alert>
            </Collapse>
            <Collapse in={success}>
              <Alert severity="success">Connexion réussie ! Redirection...</Alert>
            </Collapse>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Se connecter"
                )}
              </Button>
            </Box>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 2, color: "text.secondary" }}
            >
              Mot de passe oublié ?{" "}
              <Box
                component="a"
                href="#"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Réinitialiser
              </Box>
            </Typography>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 1.5, color: "text.secondary" }}
            >
              Pas encore de compte ?{" "}
              <Box
                component="a"
                href="/register"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Créer un compte
              </Box>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          "@keyframes slideUp": {
            from: { transform: "translateY(20px)", opacity: 0 },
            to: { transform: "translateY(0)", opacity: 1 },
          },
        }}
      />
    </ThemeProvider>
  );
};

export default Login;
