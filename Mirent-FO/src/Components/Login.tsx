import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import loginHorizontal from "../assets/horizontal.png";


const Login: React.FC = () => {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    
    
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      alert('Login successful');
    } catch (error) {
      alert('Login failed');

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />

          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
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
