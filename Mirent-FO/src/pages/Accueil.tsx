import React from "react";
<<<<<<< HEAD
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Sidebar from "../Components/Sidebar";
import TopBar from "../Components/TopBar";
import SearchFilters from "../Components/SearchFilter";
import VehicleCard from "../Components/VehicleCard";
import { Container } from "@mui/material";
=======
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";

>>>>>>> d5b55dd27c57553cb97b142e35d227e833a295b8

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
  background: "#f7fafc",
  padding: "2rem",
  textAlign: "center",
});

// Carte du tableau de bord
const DashboardCard = styled(Card)({
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
  },
});

const Accueil: React.FC = () => {
  const theme = useTheme();

  return (
<<<<<<< HEAD
    <Container>
      <TopBar />
      <Sidebar />
      <Box sx={{ p: 3, ml: 8 }}>
=======
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
>>>>>>> d5b55dd27c57553cb97b142e35d227e833a295b8
        <Typography variant="h4" gutterBottom>
          Bienvenue, Administrateur !
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Consultez les dernières statistiques et gérez votre entreprise depuis ce tableau de bord.
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
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

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
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
<<<<<<< HEAD
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
              Gérer les véhicules
            </Button>
          </Grid>

          {/* Bouton 2 : Gérer les clients */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              href="/clients"
              sx={{ height: "100%", py: 2 }}
            >
              Gérer les clients
            </Button>
          </Grid>

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
          </Grid>
        </Grid>
      </Box>
>>>>>>> d5b55dd27c57553cb97b142e35d227e833a295b8
    </Container>
  );
};

export default Accueil;