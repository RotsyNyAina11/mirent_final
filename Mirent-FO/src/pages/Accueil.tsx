import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  Button,
  Avatar,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
<<<<<<< HEAD
import { CarRental, Home, Person, MonetizationOn } from "@mui/icons-material";

// Styles
=======

>>>>>>> ac809f5fd4ad9b3b82de6fbe20600ca9af67b006
const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
<<<<<<< HEAD
  backgroundColor: "#f5f5f5",
  padding: "2rem 1.5rem",
=======
  background: "#f7fafc",
  padding: "2rem",
>>>>>>> ac809f5fd4ad9b3b82de6fbe20600ca9af67b006
  textAlign: "center",
  fontFamily: "'Roboto', sans-serif",
});

// Carte du tableau de bord
const DashboardCard = styled(Card)({
<<<<<<< HEAD
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#fafafa",
  },
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
});

const AvatarStyled = styled(Avatar)({
  width: 80,
  height: 80,
  marginBottom: "1rem",
  backgroundColor: "#3f51b5",
  fontSize: "2rem",
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
});

const ActionButton = styled(Button)({
  padding: "0.8rem 1.2rem",
  fontWeight: "bold",
  borderRadius: "8px",
  fontSize: "0.95rem",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    backgroundColor: "#3f51b5",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
=======
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
>>>>>>> ac809f5fd4ad9b3b82de6fbe20600ca9af67b006
  },
});

const LoadingIndicator = styled(CircularProgress)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});


const Accueil: React.FC = () => {
  const theme = useTheme();


  const [availableVehiclesCount, setAvailableVehiclesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles/available-count"); 
        const data = await response.json();
        console.log("Réponse complète de l'API:", data);
        console.log("Type de data:", typeof data);
        console.log("Clés disponibles dans data:", Object.keys(data));
        setAvailableVehiclesCount(data);

      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules disponibles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableVehicles();
  }, []);




  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
<<<<<<< HEAD
      <StyledBox>
        <AvatarStyled>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
            A
          </Typography>
        </AvatarStyled>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}>
          Bienvenue, Administrateur !
        </Typography>
        <Typography variant="subtitle1" paragraph sx={{ fontSize: "1rem", color: theme.palette.text.secondary }}>
          Découvrez vos statistiques et gérez votre flotte de véhicules de manière optimisée.
        </Typography>
      </StyledBox>

      <Box sx={{ py: 4 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
          Tableau de bord
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <IconButton sx={{ fontSize: "2.5rem", color: theme.palette.primary.main }}>
                <CarRental />
              </IconButton>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Véhicules disponibles
              </Typography>
              {loading ? (
                <LoadingIndicator />
              ) : (
                <Typography variant="h4" color="text.primary">
                  {availableVehiclesCount !== null ? availableVehiclesCount : "Erreur"}
=======
      {/* Section de bienvenue */}
      <StyledBox>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: theme.palette.primary.main,
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: "#fff" }}>
            A
          </Typography>
        </Avatar>

        <Typography variant="h4" gutterBottom>
          Bienvenue, Administrateur !
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Consultez les dernières statistiques et gérez votre entreprise depuis
          ce tableau de bord.
        </Typography>
      </StyledBox>

      {/* Section de tableau de bord */}
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Tableau de bord
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Nombre total de véhicules */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Véhicules disponibles
                </Typography>
                <Typography variant="h4" align="center" color="text.primary">
                  125
>>>>>>> ac809f5fd4ad9b3b82de6fbe20600ca9af67b006
                </Typography>
              )}
            </DashboardCard>
          </Grid>

<<<<<<< HEAD
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <IconButton sx={{ fontSize: "2.5rem", color: theme.palette.secondary.main }}>
                <Home />
              </IconButton>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Locations en cours
              </Typography>
              <Typography variant="h4" color="text.primary">
                42
              </Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <IconButton sx={{ fontSize: "2.5rem", color: theme.palette.info.main }}>
                <Person />
              </IconButton>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Nouveaux clients
              </Typography>
              <Typography variant="h4" color="text.primary">
                15
              </Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <IconButton sx={{ fontSize: "2.5rem", color: theme.palette.success.main }}>
                <MonetizationOn />
              </IconButton>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Revenus totaux
              </Typography>
              <Typography variant="h4" color="text.primary">
                2 000 000 Ar
              </Typography>
=======
          {/* Locations en cours */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Locations en cours
                </Typography>
                <Typography variant="h4" align="center" color="text.primary">
                  42
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          {/* Nombre du  Nouveaux clients */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Nouveaux clients
                </Typography>
                <Typography variant="h4" align="center" color="text.primary">
                  15
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          {/* Revenus totaux */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenus totaux
                </Typography>
                <Typography variant="h4" align="center" color="text.primary">
                  2 000 000 Ar
                </Typography>
              </CardContent>
>>>>>>> ac809f5fd4ad9b3b82de6fbe20600ca9af67b006
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>

<<<<<<< HEAD
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
          Actions rapides
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <ActionButton variant="contained" color="primary" fullWidth href="/vehicules">
=======
      {/* Actions rapides */}
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Actions rapides
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {/* Bouton 1 : Gérer les véhicules */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              href="/vehicules"
              sx={{ height: "100%", py: 2 }}
            >
>>>>>>> ac809f5fd4ad9b3b82de6fbe20600ca9af67b006
              Gérer les véhicules
            </ActionButton>
          </Grid>

<<<<<<< HEAD
          <Grid item xs={12} sm={6} md={3}>
            <ActionButton variant="contained" color="secondary" fullWidth href="/clients">
=======
          {/* Bouton 2 : Gérer les clients */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              href="/clients"
              sx={{ height: "100%", py: 2 }}
            >
>>>>>>> ac809f5fd4ad9b3b82de6fbe20600ca9af67b006
              Gérer les clients
            </ActionButton>
          </Grid>

<<<<<<< HEAD
          <Grid item xs={12} sm={6} md={3}>
            <ActionButton variant="contained" color="primary" fullWidth href="/reservations">
              Voir les réservations
            </ActionButton>
=======
          {/* Bouton 3 : Voir les réservations */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              href="/reservations"
              sx={{ height: "100%", py: 2 }}
            >
              Voir les réservations
            </Button>
          </Grid>

          {/* Bouton 4 : Ajouter un nouveau véhicule */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              href="/ajouter-vehicule"
              sx={{ height: "100%", py: 2 }}
            >
              Ajouter un véhicule
            </Button>
>>>>>>> ac809f5fd4ad9b3b82de6fbe20600ca9af67b006
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Accueil;
