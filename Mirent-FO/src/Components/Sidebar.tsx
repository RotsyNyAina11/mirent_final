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
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Bouton de navigation */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: 16,
          left: open ? 250 : 16, 
          zIndex: 1000,
          color: "#004D99", 
        }}
      >
        <Menu />
      </IconButton>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 250,
            background: "#F7FAFC", 
            borderRight: "none",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease-in-out", 
          },
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          {/* Logo */}
          <Toolbar>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={2}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: "100%", maxWidth: "150px" }}
              />
            </Box>
          </Toolbar>

          {/* Titre du menu */}
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

          {/* Liste des éléments */}
          <List>
            <ListItem
              component={Link}
              to="/accueil"
              sx={{
                "&:hover": {
                  backgroundColor: "#E2F0FB", 
                },
              }}
            >
              <ListItemIcon>
                <Home sx={{ color: "#004D99" }} />
              </ListItemIcon>
              <ListItemText primary="Accueil" primaryTypographyProps={{ color: "#004D99" }} />
            </ListItem>

            <ListItem
              component={Link}
              to="/dashboard"
              sx={{
                "&:hover": {
                  backgroundColor: "#E2F0FB",
                },
              }}
            >
              <ListItemIcon>
                <Dashboard sx={{ color: "#004D99" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ color: "#004D99" }} />
            </ListItem>

            <ListItem
              component={Link}
              to="/car"
              sx={{
                "&:hover": {
                  backgroundColor: "#E2F0FB",
                },
              }}
            >
              <ListItemIcon>
                <CarRental sx={{ color: "#004D99" }} />
              </ListItemIcon>
              <ListItemText primary="My Rentals" primaryTypographyProps={{ color: "#004D99" }} />
            </ListItem>

            <ListItem
              component={Link}
              to="/vehicules"
              sx={{
                "&:hover": {
                  backgroundColor: "#E2F0FB",
                },
              }}
            >
              <ListItemIcon>
                <DirectionsCar sx={{ color: "#004D99" }} />
              </ListItemIcon>
              <ListItemText primary="Liste des Véhicules" primaryTypographyProps={{ color: "#004D99" }} />
            </ListItem>

            <ListItem
              component={Link}
              to="/clients"
              sx={{
                "&:hover": {
                  backgroundColor: "#E2F0FB",
                },
              }}
            >
              <ListItemIcon>
                <People sx={{ color: "#004D99" }} />
              </ListItemIcon>
              <ListItemText primary="Liste des clients" primaryTypographyProps={{ color: "#004D99" }} />
            </ListItem>

            <ListItem
              component={Link}
              to="/contact"
              sx={{
                "&:hover": {
                  backgroundColor: "#E2F0FB",
                },
              }}
            >
              <ListItemIcon>
                <ContactMail sx={{ color: "#004D99" }} />
              </ListItemIcon>
              <ListItemText primary="Contact" primaryTypographyProps={{ color: "#004D99" }} />
            </ListItem>
          </List>

          {/* Séparateur */}
          <Divider sx={{ my: 2, borderColor: "#D1E8F8" }} />

          {/* Lien vers Login */}
          <ListItem
            component={Link}
            to="/login"
            sx={{
              "&:hover": {
                backgroundColor: "#E2F0FB",
              },
            }}
          >
            <ListItemIcon>
              <AccountCircle sx={{ color: "#004D99" }} />
            </ListItemIcon>
            <ListItemText primary="Login" primaryTypographyProps={{ color: "#004D99" }} />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;