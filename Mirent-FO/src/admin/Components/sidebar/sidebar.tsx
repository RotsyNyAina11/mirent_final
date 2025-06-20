import React, { useState, useEffect, useRef } from "react";
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
  Badge,
  Popover,
  Card, // Card et CardContent sont importés mais non utilisés dans ce composant direct.
  CardContent, // Ils sont utiles pour des affichages de détail de notification plus riches.
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
  Add as AddIcon,
  List as ListIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
} from "@mui/icons-material";
import PlaceIcon from "@mui/icons-material/Place";
import { NavLink, Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/horizontal.png";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";

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

// Interface pour la notification (doit correspondre à l'entité backend)
interface Notification {
  id: number;
  type: string;
  message: string;
  payload: any;
  createdAt: string; // La date vient du backend en string ISO 8601
  isRead: boolean;
}

// URL de base de votre API NestJS
const API_BASE_URL = "http://localhost:3000"; // <<--- TRÈS IMPORTANT : Assurez-vous que cette URL est correcte pour votre backend !

const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const [openCommande, setOpenCommande] = useState(false);
  const [openVehicules, setOpenVehicules] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  const isSmallScreen = useMediaQuery("(max-width: 900px)");

  // Calcul du nombre de notifications non lues
  const unreadNotificationsCount = notifications.filter(
    (notif) => !notif.isRead
  ).length;

  // --- Fonctions d'appel API pour les notifications ---

  /**
   * Récupère les notifications depuis le backend.
   */
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`); // Utilise la route GET /notifications
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      const data: Notification[] = await response.json();
      // Tri des notifications par date de création, les plus récentes d'abord
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      // Gérer l'erreur (ex: afficher un message d'erreur à l'utilisateur)
    }
  };

  /**
   * Marque une notification spécifique comme lue sur le backend.
   * Met à jour l'état local après succès.
   * @param id L'ID de la notification à marquer comme lue.
   */
  const markNotificationAsRead = async (id: number) => {
    try {
      // Note: Le backend devrait retourner un 204 No Content pour cette opération
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // Pas besoin d'envoyer un corps si le backend n'en attend pas, ou si `isRead: true` est géré côté serveur.
        // Si votre backend attend un corps, vous pouvez décommenter : body: JSON.stringify({ isRead: true }),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      // Met à jour l'état local pour refléter le changement sans refetch complet
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error(
        `Erreur lors du marquage de la notification ${id} comme lue:`,
        error
      );
    }
  };

  /**
   * Marque toutes les notifications non lues comme lues sur le backend.
   * Met à jour l'état local après succès.
   */
  const markAllNotificationsAsRead = async () => {
    try {
      // Note: Le backend devrait retourner un 204 No Content pour cette opération
      const response = await fetch(
        `${API_BASE_URL}/notifications/mark-all-read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      // Met à jour toutes les notifications locales comme lues
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error(
        "Erreur lors du marquage de toutes les notifications comme lues:",
        error
      );
    }
  };

  // --- Effets de côté ---

  // Effet pour gérer l'effondrement de la barre latérale sur les petits écrans
  useEffect(() => {
    setIsCollapsed(isSmallScreen);
    onCollapseChange(isSmallScreen);
  }, [isSmallScreen, onCollapseChange]);

  // Effet pour mettre à jour l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effet pour récupérer les notifications au chargement et les rafraîchir périodiquement
  useEffect(() => {
    fetchNotifications(); // Récupère les notifications au montage initial

    // Intervalle de polling (ex: toutes les 30 secondes)
    const intervalId = setInterval(fetchNotifications, 30000); // Poll toutes les 30 secondes

    return () => clearInterval(intervalId); // Nettoie l'intervalle au démontage du composant
  }, []); // Dépendances vides pour n'exécuter qu'une fois au montage

  // --- Gestionnaires d'événements UI ---

  const handleCommandeClick = () => {
    setOpenCommande(!openCommande);
  };

  const handleVehiculesClick = () => {
    setOpenVehicules(!openVehicules);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapseChange(!isCollapsed);
  };

  // Renommé pour éviter la confusion avec l'état 'open' du Popover
  const [openProformatSubmenu, setOpenProformatSubmenu] = useState(false);
  const handleProformatClick = () => {
    setOpenProformatSubmenu(!openProformatSubmenu);
  };

  const handleNotificationsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  // Les fonctions de gestion des actions sur les notifications sont maintenant des wrappers
  // autour des fonctions asynchrones d'appel API.
  const handleMarkAllAsReadClick = () => {
    markAllNotificationsAsRead();
  };

  const handleMarkAsReadClick = (id: number) => {
    markNotificationAsRead(id);
  };

  const openNotificationsPopover = Boolean(anchorEl);
  const id = openNotificationsPopover ? "notifications-popover" : undefined;

  //appel des API pour la deconnexion
  const navigate = useNavigate(); // Hook pour la navigation
  const handleLogout = async () => {
    const token = localStorage.getItem("access_token"); // Récupère le token stocké

    if (!token) {
      // Si aucun token n'est trouvé, l'utilisateur n'était pas vraiment connecté,
      // ou le token a déjà été supprimé. On redirige simplement.
      navigate("/login");
      return;
    }

    try {
      // Envoyer une requête POST à votre endpoint de déconnexion NestJS
      await axios.post(
        "http://localhost:3000/utilisateur/logout", // Assurez-vous que c'est l'URL correcte de votre API
        {}, // Corps de la requête vide (ou { token } si votre backend s'attendait à un corps)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Inclut le token dans l'en-tête Authorization
          },
        }
      );

      // Si la déconnexion côté serveur est réussie :
      localStorage.removeItem("access_token"); // Supprime le token du Local Storage
      navigate("/login"); // Redirige l'utilisateur vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Gérer les erreurs (par exemple, afficher un message à l'utilisateur)
      alert("Échec de la déconnexion. Veuillez réessayer."); // Utilisez une modale ou un toaster pour un meilleur UX
      // Même en cas d'erreur côté serveur, si le token est potentiellement invalide
      // ou expiré, il est souvent préférable de le supprimer côté client quand même.
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  };

  return (
    <React.Fragment>
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
        {/* Logo + Recherche */}
        <Box display="flex" alignItems="center" gap={20} width="100%">
          {/* Logo */}
          <RouterLink to="/acceuil" style={{ textDecoration: "none" }}>
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

        {/* Date, Notification, Avatar */}
        <Box display="flex" alignItems="center" gap={5} pr={2}>
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
          <IconButton
            aria-describedby={id}
            onClick={handleNotificationsClick}
            ref={notificationButtonRef}
          >
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          {/* Popover pour afficher les notifications */}
          <Popover
            id={id}
            open={openNotificationsPopover}
            anchorEl={anchorEl}
            onClose={handleCloseNotifications}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1, // Marge supérieure pour séparer de l'icône
                minWidth: "300px",
                maxWidth: "400px",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Box p={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Notifications
                </Typography>
                <IconButton
                  onClick={handleMarkAllAsReadClick} // Appel de la fonction de gestion
                  disabled={unreadNotificationsCount === 0}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                  <Typography variant="caption" ml={0.5}>
                    Tout lire
                  </Typography>
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {notifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucune nouvelle notification.
                </Typography>
              ) : (
                <List dense sx={{ maxHeight: "300px", overflowY: "auto" }}>
                  {notifications.map((notif) => (
                    <ListItemButton
                      key={notif.id}
                      onClick={() => handleMarkAsReadClick(notif.id)} // Appel de la fonction de gestion
                      sx={{
                        backgroundColor: notif.isRead ? "#fff" : "#e3f2fd",
                        borderRadius: "4px",
                        mb: 1,
                        "&:hover": {
                          backgroundColor: notif.isRead ? "#f5f5f5" : "#d0e7fc",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "30px" }}>
                        {notif.isRead ? (
                          <CheckCircleOutlineIcon
                            fontSize="small"
                            color="success"
                          />
                        ) : (
                          <HighlightOffIcon fontSize="small" color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={notif.message}
                        secondary={new Date(notif.createdAt).toLocaleString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                        primaryTypographyProps={{
                          fontWeight: notif.isRead ? "normal" : "bold",
                        }}
                        sx={{ wordBreak: "break-word" }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Box>
          </Popover>
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
          width: isCollapsed ? 70 : 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isCollapsed ? 70 : 240,
            boxSizing: "border-box",
            top: "56px",
            height: "calc(100% - 56px)",
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)",
            borderRight: "none",
            backgroundColor: "#ffffff",
          },
        }}
      >
        {/* Bouton de collapse */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
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
              to="/admin/home"
              selected={window.location.pathname === "/admin/home"}
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
              {/* Nouveau Commande */}
              <Tooltip title="Nouveau" placement="right">
                <NavLinkButton
                  to="/admin/createCommande"
                  selected={
                    window.location.pathname === "/admin/createCommande"
                  }
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
                    <AddCircleOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nouveau"
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
              {/* Proformat */}
              <Tooltip title="Proformat" placement="right">
                <ListItemButton
                  onClick={handleProformatClick}
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
                  {openProformatSubmenu ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </Tooltip>

              <Collapse in={openProformatSubmenu} timeout="auto" unmountOnExit>
                <NavLink
                  to="/admin/proformat/nouveau"
                  style={{ textDecoration: "none" }}
                >
                  <ListItemButton sx={{ pl: 9 }}>
                    <ListItemIcon sx={{ color: iconColor }}>
                      <AddCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Nouveau proformat"
                      primaryTypographyProps={{
                        fontSize: "12px",
                        color: textColor,
                      }}
                    />
                  </ListItemButton>
                </NavLink>
                <NavLink
                  to="/admin/proformat/liste"
                  style={{ textDecoration: "none" }}
                >
                  <ListItemButton sx={{ pl: 9 }}>
                    <ListItemIcon sx={{ color: iconColor }}>
                      <ListAltIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Liste des proformats"
                      primaryTypographyProps={{
                        fontSize: "12px",
                        color: textColor,
                      }}
                    />
                  </ListItemButton>
                </NavLink>
              </Collapse>

              {/* Facture */}
              <Tooltip title="Facture" placement="right">
                <NavLinkButton
                  to="/admin/facture"
                  selected={window.location.pathname === "/admin/facture"}
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
          <ListItemButton
            onClick={handleVehiculesClick}
            sx={{
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
              primary="Véhicules"
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
            {isCollapsed ? null : openVehicules ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItemButton>
          <Collapse in={openVehicules} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{ backgroundColor: "#f0f4f8" }}
            >
              {/* Liste des Véhicules */}
              <Tooltip title="Liste des Véhicules" placement="right">
                <NavLinkButton
                  to="/admin/vehicules"
                  selected={window.location.pathname === "/admin/vehicules"}
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
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Liste"
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
              {/* Types de Véhicules */}
              <Tooltip title="Types de Véhicules" placement="right">
                <NavLinkButton
                  to="/admin/types"
                  selected={window.location.pathname === "/admin/types"}
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
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Type"
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

          {/* Liste des Clients */}
          <Tooltip title="Liste des Clients" placement="right">
            <NavLinkButton
              to="/admin/clients"
              selected={window.location.pathname === "/admin/clients"}
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
          {/* Créer Proformas */}
          <Tooltip title="Créer Proformas" placement="right">
            <NavLinkButton
              to="/admin/proformas"
              selected={window.location.pathname === "/admin/proformas"}
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
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary="Créer Proformas"
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
              to="/admin/lieux"
              selected={window.location.pathname === "/admin/lieux"}
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
          {/* Détail du contrat d'un client*/}
          <Tooltip title="Détail du contrat" placement="right">
            <NavLinkButton
              to="/admin/client_detail"
              selected={window.location.pathname === "/admin/client_detail"}
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
                <ReceiptLong />
              </ListItemIcon>
              <ListItemText
                primary="Détail du contrat"
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
              to="/admin/contact"
              selected={window.location.pathname === "/admin/contact"}
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
        </List>
        {/* Liste de détail d'un client*/}
        <List>
          <Divider sx={{ my: 8, borderColor: "#e0e0e0" }} />

          {/* Se Déconnecter */}
          <Box sx={{ mt: "auto", pb: 2 }}>
            <Tooltip title="Se Déconnecter" placement="right">
              {/* Utilisation de ListItemButton pour la sémantique Material-UI */}
              <ListItemButton
                onClick={handleLogout} // Appelle notre fonction handleLogout
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
              </ListItemButton>
            </Tooltip>
          </Box>
        </List>
      </Drawer>
    </React.Fragment>
  );
};

export default Sidebar;
