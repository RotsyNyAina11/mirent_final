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
} from "@mui/material";
import loginHorizontal from "../assets/horizontal.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Réinitialiser l'état d'erreur avant la soumission
    setSuccess(false);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
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
        }, 2000);
      } else {
        setError("Identifiants incorrects.");
      }
    } catch (error) {
      setError("Échec de la connexion. Veuillez réessayer.");
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Section Logo */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#90CAF9", // Bleu clair
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={loginHorizontal}
          alt="Mirent Logo"
          style={{ width: "60%", maxWidth: "400px" }}
        />
      </Grid>

      {/* Section Formulaire */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAFAFA", 
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        data-mss-disabled="true"
      >
        <Box
          sx={{
            width: "80%",
            maxWidth: 400,
            textAlign: "center",
            pb: 4,
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
            bgcolor: "#FFFFFF",
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Connexion
          </Typography>

          {/* Messages d'erreur/succès */}
          <Collapse in={!!error}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Collapse>
          <Collapse in={success}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Connexion réussie ! Vous serez redirigé dans quelques instants.
            </Alert>
          </Collapse>

          {/* Formulaire */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!!error && !email}
              helperText={!!error && !email ? "Veuillez entrer un e-mail valide." : ""}
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!!error && !password}
              helperText={!!error && !password ? "Veuillez entrer un mot de passe." : ""}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!email || !password}
            >
              Se connecter
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;