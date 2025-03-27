import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Tooltip,
  Collapse,
  styled,
  IconButton,
  useMediaQuery,
  Typography,
  Avatar,
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
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import PlaceIcon from "@mui/icons-material/Place";
import { Link as RouterLink } from "react-router-dom";
import logo from "../../assets/horizontal.png";

interface SidebarProps {
  onCollapseChange: (collapsed: boolean) => void;
}

// Couleurs personnalisées
const primaryColor = "#1565c0";
const secondaryColor = "#e3f2fd";
const textColor = "#555";
const iconColor = primaryColor;

// Style personnalisé pour les boutons de navigation
const NavLinkButton = styled(
  ({
    to,
    selected,
    ...rest
  }: { to: string; selected?: boolean } & Record<string, unknown>) => (
    <RouterLink to={to} style={{ textDecoration: "none", color: "inherit" }}>
      <ListItemButton {...rest} />
    </RouterLink>
  )
)<{ selected?: boolean }>(({ selected }) => ({
  "&:hover": {
    backgroundColor: secondaryColor,
    color: primaryColor,
    borderRadius: "8px",
    transform: "translateX(4px)",
    transition: "all 0.2s ease",
  },
  ...(selected && {
    backgroundColor: secondaryColor,
    color: primaryColor,
    fontWeight: "600",
    borderLeft: `4px solid ${primaryColor}`,
    borderRadius: "0 8px 8px 0",
  }),
}));

const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const [openCommande, setOpenCommande] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const isSmallScreen = useMediaQuery("(max-width: 900px)");

  // Ajustement automatique pour petits écrans
  useEffect(() => {
    setIsCollapsed(isSmallScreen);
    onCollapseChange(isSmallScreen);
  }, [isSmallScreen, onCollapseChange]);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCommandeClick = () => {
    setOpenCommande(!openCommande);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapseChange(!isCollapsed);
  };

  return (
    <>
      {/* En-tête sticky avec le logo */}
      <Box
        bgcolor="white"
        p={1}
        pl={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1100}
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
        sx={{ height: "56px" }}
      >
        {/* Section gauche : Logo + Recherche */}
        <Box display="flex" alignItems="center" gap={20} width="100%">
          {/* Logo */}
          <RouterLink to="/accueil" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Logo Mirent"
              sx={{
                maxWidth: "150px",
                display: "block",
              }}
            />
          </RouterLink>

          {/* Barre de recherche */}
          <Box position="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              style={{
                padding: "6px 10px",
                paddingLeft: "35px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "180px",
                fontSize: "14px",
              }}
            />
            <SearchIcon
              sx={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "20px",
              }}
            />
          </Box>
        </Box>

        {/* Section droite : Date, Notification, Avatar */}
        <Box display="flex" alignItems="center" gap={5} pr={2}>
          {" "}
          {/* Réduction du gap pour compacter les éléments à droite */}
          <Typography variant="body2" color="text.secondary">
            {currentTime.toLocaleString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <IconButton onClick={() => setShowNotifications(!showNotifications)}>
            <NotificationsIcon fontSize="small" />
          </IconButton>
          <Avatar
            src="https://public.readdy.ai/ai/img_res/4e32fe8260bae0a4f879d9618e1c1763.jpg"
            sx={{ width: 32, height: 32 }}
          />
        </Box>
      </Box>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? "60px" : "250px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isCollapsed ? "60px" : "250px",
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #f8f9fa 0%, #e8ecef 100%)",
            borderRight: "none",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
            transition: "width 0.3s ease-in-out",
            top: "75px",
          },
        }}
      >
        {/* Bouton de collapse */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 1,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <IconButton
            onClick={toggleCollapse}
            sx={{
              p: 0.5,
              "&:hover": { backgroundColor: "#f0f4f8" },
            }}
          >
            {isCollapsed ? (
              <ExpandMore fontSize="small" />
            ) : (
              <ExpandLess fontSize="small" />
            )}
          </IconButton>
        </Box>

        <Divider sx={{ my: 1, borderColor: "#e0e0e0" }} />

        {/* Liste des éléments du menu */}
        <List sx={{ overflowY: "auto", flexGrow: 1 }}>
          {/* Accueil */}
          <Tooltip
            title="Accueil"
            placement="right"
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "#424242",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                },
              },
            }}
          >
            <NavLinkButton
              to="/accueil"
              selected={window.location.pathname === "/accueil"}
              sx={{
                padding: "12px 16px",
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                  color: iconColor,
                  fontSize: "1.4rem",
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
          <ListItemButton
            onClick={handleCommandeClick}
            sx={{
              "& .MuiListItemIcon-root": {
                minWidth: "40px",
                color: iconColor,
                fontSize: "1.4rem",
              },
            }}
          >
            <ListItemIcon>
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
            {isCollapsed ? null : openCommande ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItemButton>
          <Collapse in={openCommande} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ backgroundColor: "#f0f4f8" }}
            >
              {/* Proformat */}
              <Tooltip title="Proformat" placement="right">
                <NavLinkButton
                  to="/proformat"
                  selected={window.location.pathname === "/proformat"}
                  sx={{
                    pl: 6,
                    pr: 4,
                    py: 1,
                    "& .MuiListItemIcon-root": {
                      minWidth: "40px",
                      color: iconColor,
                      fontSize: "1.4rem",
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
                    "& .MuiListItemIcon-root": {
                      minWidth: "40px",
                      color: iconColor,
                      fontSize: "1.4rem",
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
                    "& .MuiListItemIcon-root": {
                      minWidth: "40px",
                      color: iconColor,
                      fontSize: "1.4rem",
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
                padding: "12px 16px",
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                  color: iconColor,
                  fontSize: "1.4rem",
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
                padding: "12px 16px",
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                  color: iconColor,
                  fontSize: "1.4rem",
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
                padding: "12px 16px",
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                  color: iconColor,
                  fontSize: "1.4rem",
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
                padding: "12px 16px",
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                  color: iconColor,
                  fontSize: "1.4rem",
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

          {/* commande */}
          <Tooltip title="Commande" placement="right">
            <NavLinkButton
              to="/commande"
              selected={window.location.pathname === "/commande"}
              sx={{
                padding: "12px 16px",
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                  color: iconColor,
                  fontSize: "1.4rem",
                },
              }}
            >
              <ListItemIcon>
                <ContactMail />
              </ListItemIcon>
              <ListItemText
                primary="Commande"
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
        <Box sx={{ mt: "auto", pb: 2 }}>
          <Tooltip title="Se Déconnecter" placement="right">
            <NavLinkButton
              to="/logout"
              sx={{
                mx: 1,
                padding: "10px 16px",
                backgroundColor: "#ffebee",
                color: "#d32f2f",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#ef9a9a",
                  color: "#b71c1c",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease",
                },
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                  color: "#d32f2f",
                  fontSize: "1.4rem",
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
                  fontWeight: "600",
                  color: "#d32f2f",
                }}
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  transition: "opacity 0.3s ease-in-out",
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
