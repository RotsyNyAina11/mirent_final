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

const primaryColor = "#1976d2"; // Couleur primaire
const secondaryColor = "#e3f2fd"; // Couleur secondaire (hover, selected)
const textColor = "#333"; // Couleur du texte
const iconColor = primaryColor; // Couleur des icônes

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

    const handleCommandeClick = () => {
        setOpenCommande(!openCommande);
    };

    return (
            <Drawer
                variant="persistent"
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        width: "250px",
                        background: "#f8f9fa",
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

          {/* Se Déconnecter */}
          <Box flexGrow={1} />
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
            />
                <Box display="flex" flexDirection="column" height="100%">
                    <Toolbar
                        sx={{
                            justifyContent: "center",
                            py: 2,
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
                                maxWidth: "180px",
                                display: "block",
                                margin: "0 auto",
                                filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                            }}
                        />
                    </Toolbar>

                    <Divider sx={{ my: 1, borderColor: "#e0e0e0" }} />

                    <List>
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
                                        display: {
                                            xs: "none",
                                            sm: "block",
                                        },
                                    }}
                                />
                            </NavLinkButton>
                        </Tooltip>

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
                                                color: textColor,
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
                                <Tooltip title="Devis" placement="right">
                                    <NavLinkButton
                                        to="/devis"
                                        selected={window.location.pathname === "/devis"}
                                        sx={{
                                            pl: 6,
                                            pr: 4,
                                            py: 1,
                                            "& .MuiListItemText-root": {
                                                paddingLeft: "8px"
                                              },
                                              "& .MuiListItemIcon-root": {
                                                  minWidth: "36px",
                                                  color: iconColor,
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
                                                  color: textColor,
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
                                                  color: textColor,
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
                                          display: {
                                              xs: "none",
                                              sm: "block",
                                          },
                                      }}
                                  />
                              </NavLinkButton>
                          </Tooltip>
  
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
                                          display: {
                                              xs: "none",
                                              sm: "block",
                                          },
                                      }}
                                  />
                              </NavLinkButton>
                          </Tooltip>
  
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
                                          display: {
                                              xs: "none",
                                              sm: "block",
                                          },
                                      }}
                                  />
                              </NavLinkButton>
                          </Tooltip>
  
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
                                          display: {
                                              xs: "none",
                                              sm: "block",
                                          },
                                      }}
                                  />
                              </NavLinkButton>
                          </Tooltip>
                      </List>
  
                      <Box flexGrow={1} />
                      <Divider sx={{ my: 1, borderColor: "#e0e0e0" }} />
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
      );
  };

  export default Sidebar;