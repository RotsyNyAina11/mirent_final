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
  useTheme,
  Typography,
  Avatar,
  Badge,
  Popover,
  ListSubheader,
  Menu,
  MenuItem,
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Home,
  DirectionsCar,
  People,
  ContactMail,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  List as ListIcon,
  Category as CategoryIcon,
  Notifications as NotificationsIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  ReceiptLong,
  Payment,
  LocalShipping,
  Storefront,
  Logout,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation, LinkProps } from "react-router-dom";
import logo from "../../../assets/horizontal.png";
import { logout } from "../../../redux/features/auth/authSlice";
import { useAppDispatch } from "../../../hooks";

interface SidebarProps {
  onCollapseChange: (collapsed: boolean) => void;
}

const primaryColor = "#1565c0";
const secondaryColor = "e8f3ff";
const textColor = "#444";
const iconColor = "#777";
const activeIconColor = "#1565c0";

interface NavLinkWithRefProps extends LinkProps {
  selected?: boolean;
}

const NavLinkWithRef = React.forwardRef<HTMLAnchorElement, NavLinkWithRefProps>(
  ({ to, selected, ...rest }, ref) => (
    <ListItemButton
      component={RouterLink}
      to={to}
      ref={ref}
      selected={selected}
      {...rest}
    />
  )
);

const NavLinkButton = styled(NavLinkWithRef)<{ selected?: boolean }>(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1, 2),
  borderRadius: "8px",
  transition: "all 0.2s ease-in-out",
  color: textColor,
  "& .MuiListItemIcon-root": {
    color: selected ? activeIconColor : iconColor,
    minWidth: "40px",
    transition: "color 0.2s ease-in-out",
  },
  "& .MuiListItemText-primary": {
    fontWeight: "500",
    fontSize: "14px",
    color: selected ? activeIconColor : textColor,
  },
  "&:hover": {
    backgroundColor: secondaryColor,
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: primaryColor,
    },
  },
  ...(selected && {
    backgroundColor: '#f0f7ff',
    "& .MuiListItemText-primary": {
      fontWeight: "600",
    },
  }),
}));

interface Notification {
  id: number;
  type: string;
  message: string;
  payload: any;
  createdAt: string;
  isRead: boolean;
}

const API_BASE_URL = "http://localhost:3000";

const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const [openVehicules, setOpenVehicules] = useState(false);
  const [openClients, setOpenClients] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // État pour la boîte de dialogue de confirmation

  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const unreadNotificationsCount = notifications.filter((notif) => !notif.isRead).length;

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      const data: Notification[] = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(sortedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: "PATCH" });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)));
    } catch (error) {
      console.error(`Erreur lors du marquage de la notification ${id} comme lue:`, error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, { method: "PATCH" });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error);
    }
  };

  useEffect(() => {
    setIsCollapsed(isSmallScreen);
    onCollapseChange(isSmallScreen);
  }, [isSmallScreen, onCollapseChange]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleToggleCollapse = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapseChange(!isCollapsed);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const openNotificationsPopover = Boolean(anchorEl);
  const id = openNotificationsPopover ? "notifications-popover" : undefined;

  // Fonction pour ouvrir le dialog de confirmation
  const handleLogout = () => {
    handleCloseUserMenu(); // Fermer le menu avant d'ouvrir le dialog
    setOpenConfirmDialog(true);
  };

  // Fonction pour fermer le dialog
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  // Fonction pour gérer la déconnexion après confirmation
  const handleConfirmLogout = async () => {
    handleCloseConfirmDialog(); 
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      navigate("/login");
    }
  };

  const renderSubheader = (text: string) => (
    <ListSubheader
      component="div"
      sx={{
        bgcolor: "transparent",
        color: "text.secondary",
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "2.5",
        textTransform: "uppercase",
        display: isCollapsed ? "none" : "block",
        pl: 3,
      }}
    >
      {text}
    </ListSubheader>
  );

  const isSelected = (path: string) => pathname === path || (path !== "/admin/home" && pathname.startsWith(path));

  return (
    <React.Fragment>
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
        sx={{ height: "65px" }}
      >
        <Box display="flex" alignItems="center" gap={20} width="50%">
          <RouterLink to="/admin/home" style={{ textDecoration: "none" }}>
            <Box component="img" src={logo} alt="Logo Mirent" sx={{ maxWidth: "150px", display: "block" }} />
          </RouterLink>
        </Box>
        <Box display="flex" alignItems="center" gap={5} pr={2}>
          <Typography
            variant="subtitle2"
            sx={{
              display: { xs: "none", md: "block" },
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            {currentTime.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })} · {currentTime.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>

          <IconButton onClick={handleNotificationsClick}>
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          <Popover
            id={id}
            open={openNotificationsPopover}
            anchorEl={anchorEl}
            onClose={handleCloseNotifications}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: "300px",
                maxWidth: "400px",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Box p={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Notifications
                </Typography>
                <IconButton onClick={markAllNotificationsAsRead} disabled={unreadNotificationsCount === 0}>
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
                      onClick={() => markNotificationAsRead(notif.id)}
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
                          <CheckCircleOutlineIcon fontSize="small" color="success" />
                        ) : (
                          <HighlightOffIcon fontSize="small" color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={notif.message}
                        secondary={new Date(notif.createdAt).toLocaleString("fr-FR")}
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
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar src="https://public.readdy.ai/ai/img_res/4e32fe8260bae0a4f879d9618e1c1763.jpg" sx={{ width: 32, height: 32 }} />
          </IconButton>
          <Menu 
            anchorEl={userMenuAnchor} 
            open={Boolean(userMenuAnchor)} 
            onClose={handleCloseUserMenu} 
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }} 
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: "200px",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuItem component={RouterLink} to="/admin/profile" onClick={handleCloseUserMenu}>
              <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
              <ListItemText>Mon Profil</ListItemText>
            </MenuItem>
            <Divider />
            {/* Le onClick appelle la fonction handleLogout pour ouvrir le dialogue de confirmation */}
            <MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
              <ListItemIcon sx={{ color: "#d32f2f" }}><Logout fontSize="small" /></ListItemIcon>
              <ListItemText>Déconnexion</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Ajout de la boîte de dialogue de confirmation */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmer la déconnexion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir vous déconnecter de votre compte?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmLogout} color="error" autoFocus>
            Déconnexion
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? 70 : 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isCollapsed ? 70 : 240,
            boxSizing: "border-box",
            top: "68px",
            height: "calc(100% - 56px)",
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.05)",
            borderRight: "1px solid #eee",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ p: 0.1, display: "flex", justifyContent: isCollapsed ? "center" : "flex-end" }}>
          <IconButton onClick={toggleCollapse} sx={{ "&:hover": { backgroundColor: "#eef1f5" } }}>
            {isCollapsed ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ flex: 1, overflowY: 'auto', pb: 0.5 }}>
          <List component="nav" sx={{ px: isCollapsed ? 0 : 1, py: 2 }}>
            {renderSubheader("Général")}
            <Tooltip title="Tableau de bord" placement="right" disableHoverListener={!isCollapsed}>
              <NavLinkButton to="/admin/home" selected={isSelected("/admin/home")}>
                <ListItemIcon><Home /></ListItemIcon>
                <ListItemText primary="Tableau de bord" sx={{ opacity: isCollapsed ? 0 : 1 }} />
              </NavLinkButton>
            </Tooltip>

            {renderSubheader("Opérations")}
            <Tooltip title="Réservations" placement="right" disableHoverListener={!isCollapsed}>
              <NavLinkButton to="/admin/reservations" selected={isSelected("/admin/reservations")}>
                <ListItemIcon><ReceiptLong /></ListItemIcon>
                <ListItemText primary="Réservations" sx={{ opacity: isCollapsed ? 0 : 1 }} />
              </NavLinkButton>
            </Tooltip>
            <Tooltip title="Contrats & Commandes" placement="right" disableHoverListener={!isCollapsed}>
              <NavLinkButton to="/admin/commandes" selected={isSelected("/admin/commandes")}>
                <ListItemIcon><LocalShipping /></ListItemIcon>
                <ListItemText primary="Contrats & Commandes" sx={{ opacity: isCollapsed ? 0 : 1 }} />
              </NavLinkButton>
            </Tooltip>
            <Tooltip title="Paiements" placement="right" disableHoverListener={!isCollapsed}>
              <NavLinkButton to="/admin/paiements" selected={isSelected("/admin/paiements")}>
                <ListItemIcon><Payment /></ListItemIcon>
                <ListItemText primary="Paiements" sx={{ opacity: isCollapsed ? 0 : 1 }} />
              </NavLinkButton>
            </Tooltip>
            <Tooltip title="Factures" placement="right" disableHoverListener={!isCollapsed}>
              <NavLinkButton to="/admin/factures" selected={isSelected("/admin/factures")}>
                <ListItemIcon><ReceiptLong /></ListItemIcon>
                <ListItemText primary="Factures" sx={{ opacity: isCollapsed ? 0 : 1 }} />
              </NavLinkButton>
            </Tooltip>

            {renderSubheader("Inventaire & Utilisateurs")}
            <Tooltip title="Véhicules" placement="right" disableHoverListener={!isCollapsed}>
              <ListItemButton onClick={() => handleToggleCollapse(setOpenVehicules)} sx={{ margin: theme.spacing(0.5, 1), borderRadius: "8px" }}>
                <ListItemIcon>
                  <DirectionsCar sx={{ color: openVehicules || pathname.startsWith("/admin/vehicules") || pathname.startsWith("/admin/types") ? activeIconColor : iconColor }} />
                </ListItemIcon>
                <ListItemText primary="Véhicules" sx={{ opacity: isCollapsed ? 0 : 1, color: openVehicules || pathname.startsWith("/admin/vehicules") || pathname.startsWith("/admin/types") ? activeIconColor : textColor }} />
                {!isCollapsed && (openVehicules ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>
            <Collapse in={openVehicules} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: isCollapsed ? 0 : 2 }}>
                <Tooltip title="Liste des Véhicules" placement="right" disableHoverListener={!isCollapsed}>
                  <NavLinkButton to="/admin/vehicules" selected={isSelected("/admin/vehicules")}>
                    <ListItemIcon><ListIcon /></ListItemIcon>
                    <ListItemText primary="Liste" sx={{ opacity: isCollapsed ? 0 : 1 }} />
                  </NavLinkButton>
                </Tooltip>
                <Tooltip title="Types de Véhicules" placement="right" disableHoverListener={!isCollapsed}>
                  <NavLinkButton to="/admin/types" selected={isSelected("/admin/types")}>
                    <ListItemIcon><CategoryIcon /></ListItemIcon>
                    <ListItemText primary="Types" sx={{ opacity: isCollapsed ? 0 : 1 }} />
                  </NavLinkButton>
                </Tooltip>
              </List>
            </Collapse>

            <Tooltip title="Clients" placement="right" disableHoverListener={!isCollapsed}>
              <ListItemButton onClick={() => handleToggleCollapse(setOpenClients)} sx={{ margin: theme.spacing(0.5, 1), borderRadius: "8px" }}>
                <ListItemIcon>
                  <People sx={{ color: openClients || pathname.startsWith("/admin/clients") || pathname.startsWith("/admin/client_detail") ? activeIconColor : iconColor }} />
                </ListItemIcon>
                <ListItemText primary="Clients" sx={{ opacity: isCollapsed ? 0 : 1, color: openClients || pathname.startsWith("/admin/clients") || pathname.startsWith("/admin/client_detail") ? activeIconColor : textColor }} />
                {!isCollapsed && (openClients ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>
            <Collapse in={openClients} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: isCollapsed ? 0 : 2 }}>
                <Tooltip title="Liste des Clients" placement="right" disableHoverListener={!isCollapsed}>
                  <NavLinkButton to="/admin/clients" selected={isSelected("/admin/clients")}>
                    <ListItemIcon><ListIcon /></ListItemIcon>
                    <ListItemText primary="Liste" sx={{ opacity: isCollapsed ? 0 : 1 }} />
                  </NavLinkButton>
                </Tooltip>
              </List>
            </Collapse>

            <Tooltip title="Lieux de Location" placement="right" disableHoverListener={!isCollapsed}>
              <NavLinkButton to="/admin/lieux" selected={isSelected("/admin/lieux")}>
                <ListItemIcon><Storefront /></ListItemIcon>
                <ListItemText primary="Lieux" sx={{ opacity: isCollapsed ? 0 : 1 }} />
              </NavLinkButton>
            </Tooltip>

            {renderSubheader("Aide")}
            <Tooltip title="Contact & Support" placement="right" disableHoverListener={!isCollapsed}>
              <NavLinkButton to="/admin/contact" selected={isSelected("/admin/contact")}>
                <ListItemIcon><ContactMail /></ListItemIcon>
                <ListItemText primary="Contact" sx={{ opacity: isCollapsed ? 0 : 1 }} />
              </NavLinkButton>
            </Tooltip>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default Sidebar;