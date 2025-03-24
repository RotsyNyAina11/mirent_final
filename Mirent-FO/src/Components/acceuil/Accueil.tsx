import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  DirectionsCar as CarIcon,
  People as PeopleIcon,
  BarChart as ChartIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
} from "@mui/icons-material";

// Interfaces pour les données
interface Booking {
  id: number;
  client: string;
  car: string;
  startDate: string;
  endDate: string;
  status: "En cours" | "Confirmé" | "En attente";
}
interface Car {
  id: number;
  name: string;
  status: string;
  image: string;
}

const App: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [availableVehiclesCount, setAvailableVehiclesCount] = useState<number | null>(null);
  const [availableClientsCount, setAvailableClientsCount] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles/available-count");
        const data = await response.json();
        setAvailableVehiclesCount(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules disponibles", error);
      }
    };
    fetchAvailableVehicles();
  }, []);

  useEffect(() => {
    const fetchAvailableClients = async () => {
      try {
        const response = await fetch("http://localhost:3000/clients/client-count");
        const data = await response.json();
        if (response.ok) {
          setAvailableClientsCount(data);
        } else {
          console.error("Erreur API:", data.message);
          setAvailableClientsCount(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des nombres de clients", error);
        setAvailableClientsCount(null);
      }
    };
    fetchAvailableClients();
  }, []);

  const recentBookings: Booking[] = [
    {
      id: 1,
      client: "Antoine Dupont",
      car: "Peugeot 3008",
      startDate: "24/03/2025",
      endDate: "26/03/2025",
      status: "En cours",
    },
    {
      id: 2,
      client: "Marie Leclerc",
      car: "Renault Captur",
      startDate: "25/03/2025",
      endDate: "28/03/2025",
      status: "Confirmé",
    },
    {
      id: 3,
      client: "Pierre Bernard",
      car: "Citroën C4",
      startDate: "26/03/2025",
      endDate: "29/03/2025",
      status: "En attente",
    },
  ];

  const availableCars: Car[] = [
    {
      id: 1,
      name: "Peugeot 208",
      status: "Disponible",
      image: "https://public.readdy.ai/ai/img_res/1f95fa58a2098a165a8a7af87f6f2cbb.jpg",
    },
    {
      id: 2,
      name: "Renault Clio",
      status: "Disponible",
      image: "https://public.readdy.ai/ai/img_res/284918923d6fcad08f717cc628eb3d99.jpg",
    },
  ];

  return (
    <Box display="flex" height="100vh">
      {/* Contenu principal */}
      <Box flexGrow={1} overflow="auto">

        {/* Contenu principal avec padding pour éviter le chevauchement */}
        <Box p={4} pt={10}> {/* Ajout de padding-top pour compenser la hauteur de l'en-tête */}
          {/* Widgets statistiques */}
          <Grid container spacing={4} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CarIcon sx={{ fontSize: 40, color: "#1976D2", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Véhicules disponibles
                </Typography>
                <Typography variant="h5">{availableVehiclesCount || "Chargement..."}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <PeopleIcon sx={{ fontSize: 40, color: "#FBC02D", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Total Clients
                </Typography>
                <Typography variant="h5">{availableClientsCount || "Chargement..."}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <MoneyIcon sx={{ fontSize: 40, color: "#4CAF50", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Revenus totaux
                </Typography>
                <Typography variant="h5">2 000 000 Ar</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <PercentIcon sx={{ fontSize: 40, color: "#E91E63", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Taux d'occupation
                </Typography>
                <Typography variant="h5">75%</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Graphique et véhicules disponibles */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance <TrendingUpIcon sx={{ verticalAlign: "middle", ml: 1 }} />
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Graphique de performance
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Véhicules disponibles
                </Typography>
                {availableCars.map((car) => (
                  <Box key={car.id} display="flex" alignItems="center" gap={2} my={2}>
                    <Avatar variant="rounded" src={car.image} />
                    <Box>
                      <Typography variant="subtitle1">{car.name}</Typography>
                      <Typography variant="body2" color="success.main">
                        {car.status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>

          {/* Réservations récentes */}
          <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Réservations récentes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Véhicule</TableCell>
                    <TableCell>Date début</TableCell>
                    <TableCell>Date fin</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.client}</TableCell>
                      <TableCell>{booking.car}</TableCell>
                      <TableCell>{booking.startDate}</TableCell>
                      <TableCell>{booking.endDate}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            backgroundColor:
                              booking.status === "En cours"
                                ? "#C8E6C9"
                                : booking.status === "Confirmé"
                                ? "#BBDEFB"
                                : "#FFECB3",
                            color:
                              booking.status === "En cours"
                                ? "#2E7D32"
                                : booking.status === "Confirmé"
                                ? "#1976D2"
                                : "#FBC02D",
                          }}
                        >
                          {booking.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Voir">
                          <IconButton>
                            <VisibilityIcon color="info" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton>
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default App;