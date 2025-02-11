import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { RootState } from "../redux/store";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import loginHorizontal from "../assets/horizontal.png";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.email === "user@example.com" &&
      formData.password === "password123"
    ) {
      dispatch(loginSuccess({ email: formData.email }));
      alert("Connexion réussie !");
    } else {
      alert("Identifiants incorrects.");
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
          backgroundColor: "#90caf9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={loginHorizontal} alt="Mirent Logo" style={{ width: "60%" }} />
      </Grid>

      {/* Section Formulaire */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Connexion
        </Typography>

        <Box
          component="form"
          sx={{ width: "80%", maxWidth: 400 }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="E-mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />

          <TextField
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Se connecter
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
