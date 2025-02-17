import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Divider,
} from "@mui/material";
import {
  Menu,
  Home,
  CarRental,
  AccountCircle,
  DirectionsCar,
  ContactMail,
  Dashboard,
  People,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{ position: "fixed", top: 16, left: 16 }}
      >
        <Menu />
      </IconButton>

      <Drawer
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            background: "#bbdefb", // Dégradé bleu
          },
        }}
      >
        <Toolbar />
        <img
          src={logo}
          alt="Logo"
          style={{ width: "100%", maxWidth: "150px", padding: "16px" }}
        />
        <List>
          <ListItem button component={Link} to="/accueil">
            <ListItemIcon>
              <Home sx={{ color: "blue" }} /> {/* Icône colorée */}
            </ListItemIcon>
            <ListItemText primary="Accueil" sx={{ color: "darkblue" }} />{" "}
            {/* Texte coloré */}
          </ListItem>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <Dashboard sx={{ color: "blue" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: "darkblue" }} />
          </ListItem>
          <ListItem button component={Link} to="/car">
            <ListItemIcon>
              <CarRental sx={{ color: "blue" }} />
            </ListItemIcon>
            <ListItemText primary="My Rentals" sx={{ color: "darkblue" }} />
          </ListItem>
          <ListItem button component={Link} to="/vehicules">
            <ListItemIcon>
              <DirectionsCar sx={{ color: "blue" }} />
            </ListItemIcon>
            <ListItemText primary="Véhicules" sx={{ color: "darkblue" }} />
          </ListItem>
          <ListItem button component={Link} to="/clients">
            <ListItemIcon>
              <People sx={{ color: "blue" }} />
            </ListItemIcon>
            <ListItemText primary="Liste des clients" sx={{ color: "blue" }} />
          </ListItem>
          <ListItem component={Link} to="/contact">
            <ListItemIcon>
              <ContactMail sx={{ color: "blue" }} />
            </ListItemIcon>
            <ListItemText primary="Contact" sx={{ color: "darkblue" }} />
          </ListItem>
          <Divider sx={{ backgroundColor: "gray" }} /> {/* Séparateur coloré */}
          <ListItem button component={Link} to="/login">
            <ListItemIcon>
              <AccountCircle sx={{ color: "blue" }} />
            </ListItemIcon>
            <ListItemText primary="Login" sx={{ color: "darkblue" }} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
