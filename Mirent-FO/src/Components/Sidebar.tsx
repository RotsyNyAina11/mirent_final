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
import PlaceIcon from '@mui/icons-material/Place';
import { Link as RouterLink } from "react-router-dom";
import logo from "../assets/horizontal.png";


const NavLinkButton = styled(({ to, selected, ...rest }: any) => (
  <RouterLink to={to} style={{ textDecoration: "none", color: "inherit" }}>
    <ListItemButton {...rest} />
  </RouterLink>
))<{ selected?: boolean }>(({ selected }) => ({
  "&:hover": {
    backgroundColor: "#E2F0FB",
    color: "#004D99",
    borderRadius: "8px",
    transition: "all 0.2s ease-in-out",
  },
  ...(selected && {
    backgroundColor: "#E2F0FB",
    color: "#004D99",
    fontWeight: "bold",
    borderRadius: "8px",
  }),
}));

const Sidebar: React.FC = () => {
  const [openCommande, setOpenCommande] = useState(false);

  const handleCommandeClick = () => {
    setOpenCommande(!openCommande);
  };

  return (
    <>
      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open
        PaperProps={{
          sx: {
            width: "250px", 
            background: "#F7FAFC",
            borderRight: "none",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            overflowX: "hidden",
            transition: "width 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            "@media (max-width: 600px)": {
              width: "60px", 
            },
          },
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          {/* Logo */}
          <Toolbar
            sx={{
              justifyContent: "center",
              py: 3,
              px: 2,
              backgroundColor: "#FFFFFF",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: "100%",
                maxWidth: "200px",
                display: "block",
                margin: "0 auto",
                filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
              }}
            />
          </Toolbar>

          <Divider sx={{ my: 2, borderColor: "#D1E8F8" }} />

          {/* Liste des éléments */}
          <List>
            {/* Accueil */}
            <Tooltip title="Accueil" placement="right">
              <NavLinkButton
                to="/accueil"
                selected={window.location.pathname === "/accueil"}
                sx={{
                  padding: "8px 16px",
                  "& .MuiListItemIcon-root": {
                    minWidth: "36px",
                    color: "#004D99",
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
                    color: "#004D99",
                  }}
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                />
              </NavLinkButton>
            </Tooltip>

            {/* Menu Commande avec sous-menus */}
            <ListItemButton onClick={handleCommandeClick}>
              <ListItemIcon
                sx={{
                  color: "#004D99",
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
                  color: "#004D99",
                }}
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              />
              {openCommande ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openCommande} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {/* Sous-menu Proformat */}
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
                        color: "#004D99",
                      },
                      "@media (max-width: 600px)": {
                        pl: 2, 
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
                        color: "#004D99",
                      }}
                      sx={{
                        display: {
                          xs: "none",
                          sm: "block",
                        },
                      }}
                    />
                  </NavLinkButton>
                </Tooltip>

                {/* Sous-menu Devis */}
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
                        color: "#004D99",
                      },
                      "@media (max-width: 600px)": {
                        pl: 2, 
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
                        color: "#004D99",
                      }}
                      sx={{
                        display: {
                          xs: "none",
                          sm: "block",
                        },
                      }}
                    />
                  </NavLinkButton>
                </Tooltip>

                {/* Sous-menu Facture */}
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
                        color: "#004D99",
                      },
                      "@media (max-width: 600px)": {
                        pl: 2, 
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
                        color: "#004D99",
                      }}
                      sx={{
                        display: {
                          xs: "none",
                          sm: "block",
                        },
                      }}
                    />
                  </NavLinkButton>
                </Tooltip>
              </List>
            </Collapse>

            {/* Liste des Véhicules */}
            <Tooltip title="Gérer les Véhicules" placement="right">
              <NavLinkButton
                to="/vehicules"
                selected={window.location.pathname === "/vehicules"}
                sx={{
                  padding: "8px 16px",
                  "& .MuiListItemIcon-root": {
                    minWidth: "36px",
                    color: "#004D99",
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
                    color: "#004D99",
                  }}
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
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
                    color: "#004D99",
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
                    color: "#004D99",
                  }}
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                />
              </NavLinkButton>
            </Tooltip>

            {/* Lieux de location */}
            <Tooltip title="Lieux de Location" placement="right">
              <NavLinkButton
                to="/vehicules"
                selected={window.location.pathname === "/vehicules"}
                sx={{
                  padding: "8px 16px",
                  "& .MuiListItemIcon-root": {
                    minWidth: "36px",
                    color: "#004D99",
                  },
                }}
              >
                <ListItemIcon>
                  <PlaceIcon/>
                </ListItemIcon>
                <ListItemText
                  primary="Lieux de Location"
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#004D99",
                  }}
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
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
                    color: "#004D99",
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
                    color: "#004D99",
                  }}
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                />
              </NavLinkButton>
            </Tooltip>
          </List>

          {/* Se Déconnecter */}
          <Box flexGrow={1} />
          <Divider sx={{ my: 2, borderColor: "#D1E8F8" }} />
          <Tooltip title="Se Déconnecter" placement="right">
            <NavLinkButton
              to="/logout"
              sx={{
                "&:hover": {
                  backgroundColor: "#FFEBEB",
                  color: "#D32F2F",
                  borderRadius: "8px",
                },
                padding: "8px 16px",
                "& .MuiListItemIcon-root": {
                  minWidth: "36px",
                  color: "#D32F2F",
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
                  color: "#D32F2F",
                }}
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              />
            </NavLinkButton>
          </Tooltip>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
