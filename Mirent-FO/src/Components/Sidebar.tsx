import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Tooltip,
} from "@mui/material";
import {
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
  return (
    <>
      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open
        PaperProps={{
          sx: {
            width: "250px", // Largeur fixe de la sidebar
            background: "#F7FAFC",
            borderRight: "none",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            overflowX: "hidden",
            transition: "width 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            "@media (max-width: 600px)": {
              width: "60px", // Sidebar rétrécie sur petits écrans
            },
          },
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          {/* Logo enveloppé dans un Box pour utiliser sx */}
          <Toolbar sx={{ justifyContent: "center", py: 2 }}>
            <Box
              sx={{
                width: "100px", 
                transition: "width 0.3s ease-in-out",
                display: "block",
                margin: "0 auto",
                "@media (max-width: 600px)": {
                  width: "35px", 
                },
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "100%", 
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </Box>
          </Toolbar>

          <Divider sx={{ my: 2, borderColor: "#D1E8F8" }} />

          {/* Liste des éléments */}
          <List>
            {[{ text: "Accueil", icon: <Home />, path: "/accueil" },
              { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
              { text: "My Rentals", icon: <CarRental />, path: "/car" },
              { text: "Liste des Véhicules", icon: <DirectionsCar />, path: "/vehicules" },
              { text: "Liste des Clients", icon: <People />, path: "/clients" },
              { text: "Contact", icon: <ContactMail />, path: "/contact" },
              { text: "Login", icon: <AccountCircle />, path: "/login" }].map((item, index) => (
              <Tooltip key={index} title={item.text} placement="right">
                <ListItem
                  component={Link}
                  to={item.path}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#E2F0FB",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                    },
                    transition: "all 0.2s ease-in-out",
                    padding: "8px 16px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "#004D99",
                      minWidth: "36px", 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      color: "#004D99",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    sx={{
                      display: {
                        xs: "none", 
                        sm: "block", 
                      },
                    }}
                  />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
