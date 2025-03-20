import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Tooltip,
  Collapse,
  styled,
  IconButton,
} from "@mui/material";
import {
  Home,
  ShoppingCart,
  ReceiptLong,
  DirectionsCar,
  People,
  ContactMail,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  AddShoppingCart,
} from "@mui/icons-material";
import PlaceIcon from "@mui/icons-material/Place";
import { Link as RouterLink } from "react-router-dom";
import logo from "../../assets/horizontal.png";

// Couleurs personnalisées
const primaryColor = "#1976d2"; // Bleu principal
const secondaryColor = "#e3f2fd"; // Bleu clair pour hover
const textColor = "#333"; // Couleur du texte
const iconColor = primaryColor; // Couleur des icônes

// Style personnalisé pour les boutons de navigation
const NavLinkButton = styled(({ to, selected, ...rest }: any) => (
  <RouterLink to={to} style={{ textDecoration: "none", color: "inherit" }}>
    <ListItemButton {...rest} />
  </RouterLink>
))<{ selected?: boolean }>(({ selected }) => ({
  "&:hover": {
    backgroundColor: secondaryColor,
    color: primaryColor,
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
  },
  ...(selected && {
    backgroundColor: secondaryColor,
    color: primaryColor,
    fontWeight: "600",
    borderRadius: "8px",
  }),
}));

const Sidebar: React.FC = () => {
  const [openCommande, setOpenCommande] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // État pour le menu rétractable

  const handleCommandeClick = () => {
    setOpenCommande(!openCommande);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? "60px" : "250px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? "60px" : "250px",
          boxSizing: "border-box",
          background: "#f8f9fa",
          borderRight: "none",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "width 0.3s ease-in-out",
        },
      }}
    >
      {/* Header avec logo */}
      <Toolbar
        sx={{
          justifyContent: "center",
          py: 2,
          px: 2,
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: "100%",
            maxWidth: isCollapsed ? "40px" : "180px",
            display: "block",
            margin: "0 auto",
            filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
            transition: "max-width 0.3s ease-in-out",
          }}
        />
      </Toolbar>

      {/* Bouton pour rétracter/déplier le menu */}
      <Tooltip title={isCollapsed ? "Déplier" : "Rétracter"} placement="right">
        <IconButton
          onClick={toggleCollapse}
          sx={{
            position: "absolute",
            top: "10px",
            right: isCollapsed ? "-10px" : "-30px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "50%",
            padding: "8px",
            transition: "right 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#f0f4f8",
            },
          }}
        >
          {isCollapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Tooltip>

      <Divider sx={{ my: 1, borderColor: "#e0e0e0" }} />

      {/* Liste des éléments du menu */}
      <List sx={{ overflowY: "auto", flexGrow: 1 }}>
        {/* Accueil */}
        <Tooltip title="Accueil" placement="right">
          <NavLinkButton
            to="/accueil"
            selected={window.location.pathname === "/accueil"}
            sx={{
              padding: "8px 16px",
              "& .MuiListItemIcon-root": {
                minWidth: "36px",
                color: iconColor,
              },
            }}
          >
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText
              primary="Accueil"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: "500",
                color: textColor,
              }}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </NavLinkButton>
        </Tooltip>

        {/* Commandes avec sous-menu */}
        <ListItemButton onClick={handleCommandeClick}>
          <ListItemIcon
            sx={{
              color: iconColor,
              minWidth: "36px",
            }}
          >
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText
            primary="Commandes"
            primaryTypographyProps={{
              fontSize: "14px",
              fontWeight: "500",
              color: textColor,
            }}
            sx={{
              opacity: isCollapsed ? 0 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
          {openCommande ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCommande} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Proformat */}
            <Tooltip title="Proformat" placement="right">
              <NavLinkButton
                to="/proformat"
                selected={window.location.pathname === "/proformat"}
                sx={{
                  pl: 6,
                  pr: 4,
                  py: 1,
                  "& .MuiListItemText-root": {
                    paddingLeft: "8px",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: "36px",
                    color: iconColor,
                  },
                }}
              >
                <ListItemIcon>
                  <ReceiptLong />
                </ListItemIcon>
                <ListItemText
                  primary="Proformat"
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: textColor,
                  }}
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />
              </NavLinkButton>
            </Tooltip>

            {/* Devis */}
            <Tooltip title="Devis" placement="right">
              <NavLinkButton
                to="/devis"
                selected={window.location.pathname === "/devis"}
                sx={{
                  pl: 6,
                  pr: 4,
                  py: 1,
                  "& .MuiListItemText-root": {
                    paddingLeft: "8px",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: "36px",
                    color: iconColor,
                  },
                }}
              >
                <ListItemIcon>
                  <AddShoppingCart />
                </ListItemIcon>
                <ListItemText
                  primary="Devis"
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: textColor,
                  }}
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />
              </NavLinkButton>
            </Tooltip>

            {/* Facture */}
            <Tooltip title="Facture" placement="right">
              <NavLinkButton
                to="/facture"
                selected={window.location.pathname === "/facture"}
                sx={{
                  pl: 6,
                  pr: 4,
                  py: 1,
                  "& .MuiListItemText-root": {
                    paddingLeft: "8px",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: "36px",
                    color: iconColor,
                  },
                }}
              >
                <ListItemIcon>
                  <ReceiptLong />
                </ListItemIcon>
                <ListItemText
                  primary="Facture"
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: textColor,
                  }}
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />
              </NavLinkButton>
            </Tooltip>
          </List>
        </Collapse>

        {/* Gérer les Véhicules */}
        <Tooltip title="Gérer les Véhicules" placement="right">
          <NavLinkButton
            to="/vehicules"
            selected={window.location.pathname === "/vehicules"}
            sx={{
              padding: "8px 16px",
              "& .MuiListItemIcon-root": {
                minWidth: "36px",
                color: iconColor,
              },
            }}
          >
            <ListItemIcon>
              <DirectionsCar />
            </ListItemIcon>
            <ListItemText
              primary="Gérer les Véhicules"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: "500",
                color: textColor,
              }}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </NavLinkButton>
        </Tooltip>

        {/* Liste des Clients */}
        <Tooltip title="Liste des Clients" placement="right">
          <NavLinkButton
            to="/clients"
            selected={window.location.pathname === "/clients"}
            sx={{
              padding: "8px 16px",
              "& .MuiListItemIcon-root": {
                minWidth: "36px",
                color: iconColor,
              },
            }}
          >
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText
              primary="Liste des Clients"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: "500",
                color: textColor,
              }}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </NavLinkButton>
        </Tooltip>

        {/* Lieux de Location */}
        <Tooltip title="Lieux de Location" placement="right">
          <NavLinkButton
            to="/lieux"
            selected={window.location.pathname === "/lieux"}
            sx={{
              padding: "8px 16px",
              "& .MuiListItemIcon-root": {
                minWidth: "36px",
                color: iconColor,
              },
            }}
          >
            <ListItemIcon>
              <PlaceIcon />
            </ListItemIcon>
            <ListItemText
              primary="Lieux de Location"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: "500",
                color: textColor,
              }}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </NavLinkButton>
        </Tooltip>

        {/* Contact */}
        <Tooltip title="Contact" placement="right">
          <NavLinkButton
            to="/contact"
            selected={window.location.pathname === "/contact"}
            sx={{
              padding: "8px 16px",
              "& .MuiListItemIcon-root": {
                minWidth: "36px",
                color: iconColor,
              },
            }}
          >
            <ListItemIcon>
              <ContactMail />
            </ListItemIcon>
            <ListItemText
              primary="Contact"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: "500",
                color: textColor,
              }}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </NavLinkButton>
        </Tooltip>
      </List>

      <Divider sx={{ my: 1, borderColor: "#e0e0e0" }} />

      {/* Se Déconnecter */}
      <Tooltip title="Se Déconnecter" placement="right">
        <NavLinkButton
          to="/logout"
          sx={{
            "&:hover": {
              backgroundColor: "#ffebee",
              color: "#d32f2f",
              borderRadius: "8px",
            },
            padding: "8px 16px",
            "& .MuiListItemIcon-root": {
              minWidth: "36px",
              color: "#d32f2f",
            },
          }}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText
            primary="Se Déconnecter"
            primaryTypographyProps={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#d32f2f",
            }}
            sx={{
              opacity: isCollapsed ? 0 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        </NavLinkButton>
      </Tooltip>
    </Drawer>
  );
};

export default Sidebar;