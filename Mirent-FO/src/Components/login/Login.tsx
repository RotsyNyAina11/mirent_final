import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import loginImage from "../../assets/2.jpg"; // Image de fond
import logo from "../../assets/horizontal.png"; // Logo

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleLogin = () => {
    setError(""); 

    // Simulation de la vérification des identifiants
    if (email === "admin@mirent.com" && password === "admin123") {
      console.log("Connexion réussie : Administrateur");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", "admin");
      navigate("/admin/home"); 
    } else if (email === "client@gmail.com" && password === "client123") {
      console.log("Connexion réussie : Client");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", "client");
      navigate("/accueil"); 
    } else {
      setError("Email ou mot de passe incorrect");
      console.log("Échec de la connexion : Identifiants incorrects");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* En-tête */}
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
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <RouterLink to="/accueil" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                maxWidth: "150px",
                display: "block",
              }}
            />
          </RouterLink>
        </Box>
      </Box>

      {/* Contenu principal */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "56px",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            width: "100%",
            maxWidth: 900,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Partie gauche - Illustration */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                background: `url(${loginImage}) center/cover no-repeat`,
              }}
            />
          )}

          {/* Partie droite - Formulaire */}
          <Box sx={{ flex: 1, p: 5 }}>
            <Stack spacing={4}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Bienvenue
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Connectez-vous pour accéder à votre espace
                </Typography>
              </Box>

              <Stack spacing={2}>
                <TextField
                  label="Adresse Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error}
                />
                <TextField
                  label="Mot de passe"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                />
                {error && (
                  <Typography color="error" variant="body2" textAlign="center">
                    {error}
                  </Typography>
                )}
              </Stack>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleLogin}
                sx={{ borderRadius: 3 }}
              >
                Se connecter
              </Button>

              <Typography textAlign="center" variant="body2" color="text.secondary">
                Vous n'avez pas encore de compte ?{" "}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate("/register")}
                  sx={{ textTransform: "none" }}
                >
                  Créez-en un ici
                </Button>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;