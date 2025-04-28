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
  import loginImage from "../../assets/2.jpg"; // Image d'illustration
  import logo from "../../assets/horizontal.png"; // Logo
  
  const Register: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleRegister = () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          console.error("Tous les champs sont requis");
          return;
        }
        if (password !== confirmPassword) {
          console.error("Les mots de passe ne correspondent pas");
          return;
        }
        console.log(
          "Prénom:",
          firstName,
          "Nom:",
          lastName,
          "Email:",
          email,
          "Mot de passe:",
          password
        );
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
            <RouterLink to="/acceuil" style={{ textDecoration: "none" }}>
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
              maxHeight: "calc(100vh - 56px)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              overflowY: isMobile ? "auto" : "hidden", 
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
            <Box sx={{ flex: 1, p: isMobile ? 3 : 4 }}>
              <Stack spacing={3}>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Créez votre compte
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Inscrivez-vous pour accéder à votre espace
                  </Typography>
                </Box>
  
                <Stack spacing={2}>
                  <TextField
                    label="Prénom"
                    type="text"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Nom"
                    type="text"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Adresse Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Mot de passe"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Confirmer le mot de passe"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    size="small"
                  />
                </Stack>
  
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="medium"
                  onClick={handleRegister}
                  sx={{ borderRadius: 3 }}
                >
                  S'inscrire
                </Button>
  
                <Typography textAlign="center" variant="caption" color="text.secondary">
                  Vous avez déjà un compte ?{" "}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate("/login")}
                    sx={{ textTransform: "none" }}
                  >
                    Connectez-vous ici
                  </Button>
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  };
  
  export default Register;