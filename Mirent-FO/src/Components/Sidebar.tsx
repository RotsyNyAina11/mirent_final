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
  Box,
  Typography,
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
  Close,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Bouton pour ouvrir/fermer */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: 16,
          left: open ? 250 : 16,
          zIndex: 1300,
          backgroundColor: "white",
          boxShadow: 1,
        }}
      >
        {open ? <Close /> : <Menu />}
      </IconButton>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        PaperProps={{
          sx: {
            width: open ? 250 : 70,
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            backgroundColor: "#F7FAFC",
            borderRight: "none",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          {/* Logo */}
          <Toolbar>
            <Box
              display="flex"
              justifyContent={open ? "center" : "flex-start"}
              alignItems="center"
              p={2}
            >
              {open && (
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "100%", maxWidth: "100px" }}
                />
              )}
            </Box>
          </Toolbar>

          {/* Titre du menu */}
          {open && (
            <Box px={2} pb={2}>
              <Typography
                variant="h6"
                fontWeight="bold"
                textAlign="center"
                color="#004D99"
                sx={{ textTransform: "uppercase" }}
              >
                Menu Principal
              </Typography>
            </Box>
          )}

          {/* Liste des éléments */}
          <List>
            {[
              { text: "Accueil", icon: <Home />, path: "/accueil" },
              { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
              { text: "My Rentals", icon: <CarRental />, path: "/car" },
              {
                text: "Liste des Véhicules",
                icon: <DirectionsCar />,
                path: "/vehicules",
              },
              { text: "Liste des clients", icon: <People />, path: "/clients" },
              { text: "Contact", icon: <ContactMail />, path: "/contact" },
              { text: "Login", icon: <AccountCircle />, path: "/login" },
            ].map((item, index) => (
              <ListItem
                component={Link}
                to={item.path}
                key={index}
                sx={{
                  "&:hover": { backgroundColor: "#E2F0FB" },
                  display: "flex",
                  justifyContent: open ? "flex-start" : "center",
                  padding: "10px",
                }}
              >
                <ListItemIcon
                  sx={{ color: "#004D99", minWidth: 0, mr: open ? 2 : "auto" }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItem>
            ))}
          </List>

          {/* Séparateur */}
          <Divider sx={{ my: 2, borderColor: "#D1E8F8" }} />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
