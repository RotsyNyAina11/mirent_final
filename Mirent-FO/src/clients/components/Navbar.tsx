import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../../assets/horizontal.png";
import illustration from "../../assets/horizontal.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Accueil", path: "/acceuil" },
  { label: "Nos voitures", path: "/voitures" },
  { label: "Mes réservations", path: "/reservations" },
  { label: "Contact", path: "#contact" },
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      const el = document.querySelector(path);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
    setOpenDrawer(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    handleClosePopover();
    navigate("/acceuil");
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "#0f172a",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          zIndex: 1100,
        }}
      >
        <Toolbar
          sx={{
            height: "56px",
            p: 1,
            pl: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="Mirent Logo"
            sx={{ maxWidth: "150px", display: "block", cursor: "pointer" }}
            onClick={() => navigate("/acceuil")}
          />

          {/* Menu desktop */}
          {!isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              {navItems.map((item) => (
                <Typography
                  key={item.label}
                  sx={{
                    cursor: "pointer",
                    color: "white",
                    fontWeight: 500,
                    "&:hover": { color: "GrayText" },
                  }}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </Typography>
              ))}
              {/* Bouton Me connecter ou Mon compte */}
              {isLoggedIn ? (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleOpenPopover}
                  sx={{ ml: 2, color: "white", borderColor: "white" }}
                  startIcon={<AccountCircleIcon />}
                >
                  Mon compte
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleOpenPopover}
                  sx={{ ml: 2, color: "white", borderColor: "white" }}
                >
                  Me connecter
                </Button>
              )}
            </Box>
          ) : (
            <>
              {/* Menu mobile */}
              <IconButton
                edge="start"
                sx={{ color: "white" }}
                aria-label="menu"
                onClick={() => setOpenDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
              >
                <Box sx={{ width: 250, mt: 4 }}>
                  <List>
                    {navItems.map((item) => (
                      <ListItem key={item.label} disablePadding>
                        <ListItemButton onClick={() => handleNavigation(item.path)}>
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleOpenPopover}>
                        <ListItemText primary={isLoggedIn ? "Mon compte" : "Me connecter"} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Popover pour utilisateurs non connectés */}
      {!isLoggedIn && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
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
              p: 2,
              borderRadius: 3,
              width: 300,
              boxShadow: 5,
              mt: 1,
            },
          }}
        >
          {/* Triangle/flèche */}
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: "background.paper",
              position: "absolute",
              top: -10,
              right: 20,
              transform: "rotate(45deg)",
              boxShadow: 1,
            }}
          />

          <Stack justifyContent="center" alignItems="center" spacing={1}>
            <Typography variant="h6" textAlign="center">
              Bienvenue sur
            </Typography>

            <Box
              component="img"
              src={illustration}
              alt="Mirent Illustration"
              sx={{
                height: 50,
                width: "auto",
              }}
            />

            {/* Boutons */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                navigate("/login");
                handleClosePopover();
              }}
            >
              Se connecter
            </Button>

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => {
                navigate("/register");
                handleClosePopover();
              }}
            >
              S’inscrire gratuitement
            </Button>

            <Divider />

            {/* Avantages */}
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                Avantages gratuits avec Mirent+
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography fontSize="small">
                  Des offres et réductions exclusives
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography fontSize="small">
                  Toujours informé des promos
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography fontSize="small">
                  Toutes vos réservations en vue
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Popover>
      )}

      {/* Popover pour utilisateurs connectés */}
      {isLoggedIn && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
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
              p: 2,
              borderRadius: 3,
              width: 200,
              boxShadow: 5,
              mt: 1,
            },
          }}
        >
          {/* Triangle/flèche */}
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: "background.paper",
              position: "absolute",
              top: -10,
              right: 20,
              transform: "rotate(45deg)",
              boxShadow: 1,
            }}
          />

          <Stack spacing={1}>
            <Button
              variant="text"
              fullWidth
              onClick={() => {
                navigate("/reservations");
                handleClosePopover();
              }}
              sx={{ justifyContent: "flex-start" }}
            >
              Mes réservations
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => {
                navigate("/profile");
                handleClosePopover();
              }}
              sx={{ justifyContent: "flex-start" }}
            >
              Mon profil
            </Button>
            <Divider />
            <Button
              variant="text"
              fullWidth
              onClick={handleLogout}
              sx={{ justifyContent: "flex-start", color: "error.main" }}
            >
              Me déconnecter
            </Button>
          </Stack>
        </Popover>
      )}
    </>
  );
};

export default Navbar;