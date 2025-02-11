// src/components/Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Location de Véhicules
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>
          Accueil
        </Button>
        <Button color="inherit" onClick={() => navigate("/search")}>
          Rechercher
        </Button>
        <Button color="inherit" onClick={() => navigate("/login")}>
          Connexion
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
