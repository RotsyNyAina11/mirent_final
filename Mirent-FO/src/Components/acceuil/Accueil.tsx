import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Avatar,
  IconButton,
  useTheme,
  CircularProgress,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  CarRental,
  Person,
  MonetizationOn,
  PieChart,
  Speed,
  AttachMoney,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Styles
export const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "30vh",
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "2rem 1.5rem",
  textAlign: "center",
  fontFamily: "'Roboto', sans-serif",
});

export const DashboardCard = styled(Paper)({
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
});

export const AvatarStyled = styled(Avatar)({
  width: 60,
  height: 60,
  marginBottom: "1rem",
  backgroundColor: "#fff",
  color: "#1976d2",
  fontSize: "1.5rem",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
});

export const ActionButton = styled(Button)({
  padding: "0.8rem 1.2rem",
  fontWeight: "600",
  borderRadius: "4px",
  fontSize: "0.9rem",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    backgroundColor: "#1565c0",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
});

export const LoadingIndicator = styled(CircularProgress)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const Accueil: React.FC = () => {
  const theme = useTheme();
  const [availableVehiclesCount, setAvailableVehiclesCount] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableClientsCount, setAvailableClientsCount] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/vehicles/available-count"
        );
        const data = await response.json();
        setAvailableVehiclesCount(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des véhicules disponibles",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableVehicles();
  }, []);

  useEffect(() => {
    const fetchAvailableClients = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/clients/client-count"
        );
        const data = await response.json();
        if (response.ok) {
          setAvailableClientsCount(data);
        } else {
          console.error("Erreur API:", data.message);
          setAvailableClientsCount(null);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des nombres de clients",
          error
        );
        setAvailableClientsCount(null);
      }
    };
    fetchAvailableClients();
  }, []);

  // Exemple de données pour le graphique à barres
  const chartData = {
    labels: ["Véhicules", "Clients", "Locations"],
    datasets: [
      {
        label: "Nombre",
        data: [
          availableVehiclesCount || 0,
          availableClientsCount || 0,
          42, // Exemple de nombre de locations
        ],
        backgroundColor: [
          "rgba(25, 118, 210, 0.6)",
          "rgba(255, 193, 7, 0.6)",
          "rgba(76, 175, 80, 0.6)",
        ],
        borderColor: [
          "rgba(25, 118, 210, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(76, 175, 80, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Statistiques principales",
      },
    },
  };

  // Exemple de données pour le graphique circulaire
  const pieChartData = {
    labels: ["Disponibles", "Occupés"],
    datasets: [
      {
        label: "Véhicules",
        data: [availableVehiclesCount || 0, 10], // Exemple : 10 véhicules occupés
        backgroundColor: ["#4CAF50", "#F44336"],
        borderWidth: 0,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Répartition des véhicules",
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Section de bienvenue */}
      <StyledBox>
        <AvatarStyled>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            A
          </Typography>
        </AvatarStyled>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Bienvenue, Administrateur !
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Analysez vos données et gérez votre flotte efficacement.
        </Typography>
      </StyledBox>

      {/* Section des statistiques principales */}
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Tableau de bord Analytique
        </Typography>

        {/* Graphique principal */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <DashboardCard>
              <Bar options={chartOptions} data={chartData} />
            </DashboardCard>
          </Grid>

          {/* Cartes principales */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {/* Véhicules disponibles */}
              <Grid item xs={12} sm={6} md={12}>
                <DashboardCard>
                  <IconButton
                    sx={{ fontSize: "2.5rem", color: theme.palette.primary.main }}
                  >
                    <CarRental />
                  </IconButton>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Véhicules disponibles
                  </Typography>
                  {loading ? (
                    <LoadingIndicator />
                  ) : (
                    <Typography variant="h4" color="text.primary">
                      {availableVehiclesCount !== null
                        ? availableVehiclesCount
                        : "Erreur"}
                    </Typography>
                  )}
                </DashboardCard>
              </Grid>

              {/* Total Clients */}
              <Grid item xs={12} sm={6} md={12}>
                <DashboardCard>
                  <IconButton
                    sx={{ fontSize: "2.5rem", color: theme.palette.warning.main }}
                  >
                    <Person />
                  </IconButton>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Total Clients
                  </Typography>
                  {availableClientsCount !== null ? (
                    <Typography variant="h4" color="text.primary">
                      {availableClientsCount}
                    </Typography>
                  ) : (
                    <Typography variant="h4" color="text.primary">
                      Erreur
                    </Typography>
                  )}
                </DashboardCard>
              </Grid>

              {/* Revenus totaux */}
              <Grid item xs={12} sm={6} md={12}>
                <DashboardCard>
                  <IconButton
                    sx={{ fontSize: "2.5rem", color: theme.palette.success.main }}
                  >
                    <MonetizationOn />
                  </IconButton>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Revenus totaux
                  </Typography>
                  <Typography variant="h4" color="text.primary">
                    2 000 000 Ar
                  </Typography>
                </DashboardCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Cartes secondaires */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: theme.palette.text.secondary }}
          >
            Détails supplémentaires
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Répartition des véhicules */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard>
                <IconButton
                  sx={{ fontSize: "2.5rem", color: theme.palette.info.main }}
                >
                  <PieChart />
                </IconButton>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Répartition des véhicules
                </Typography>
                <Pie options={pieChartOptions} data={pieChartData} />
              </DashboardCard>
            </Grid>

            {/* Taux d'occupation */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard>
                <IconButton
                  sx={{ fontSize: "2.5rem", color: theme.palette.warning.main }}
                >
                  <Speed />
                </IconButton>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Taux d'occupation (est.)
                </Typography>
                <Typography variant="h4" color="text.primary">
                  75%
                </Typography>
              </DashboardCard>
            </Grid>

            {/* Revenu moyen / location */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard>
                <IconButton
                  sx={{ fontSize: "2.5rem", color: theme.palette.success.main }}
                >
                  <AttachMoney />
                </IconButton>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Revenu moyen / location
                </Typography>
                <Typography variant="h4" color="text.primary">
                  50 000 Ar
                </Typography>
              </DashboardCard>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Section des actions rapides */}
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Actions rapides
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <ActionButton
              variant="contained"
              color="primary"
              fullWidth
              href="/vehicules"
            >
              Gérer les véhicules
            </ActionButton>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ActionButton
              variant="contained"
              color="secondary"
              fullWidth
              href="/clients"
            >
              Gérer les clients
            </ActionButton>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ActionButton
              variant="contained"
              color="primary"
              fullWidth
              href="/reservations"
            >
              Voir les réservations
            </ActionButton>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Accueil;