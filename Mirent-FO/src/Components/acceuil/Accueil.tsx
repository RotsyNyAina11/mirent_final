import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Tooltip,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart"; // Pour le graphique
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchVehicles, Vehicle } from "../../redux/features/vehicle/vehiclesSlice";


// Interfaces pour les données
interface Booking {
  id: number;
  client: string;
  car: string;
  startDate: string;
  endDate: string;
  status: "En cours" | "Confirmé" | "En attente";
}

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

const Accueil: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, vehiclesError } = useSelector((state: RootState) => state.vehicles);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Jusqu'à 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px à 960px

  const [availableVehiclesCount, setAvailableVehiclesCount] = useState<number | null>(null);
  const [availableClientsCount, setAvailableClientsCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les véhicules via Redux
  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  // Filtrer les véhicules disponibles
  const availableCars = vehicles.filter((vehicle: Vehicle) => vehicle.status.status === "Disponible");

  // Récupérer le nombre de véhicules disponibles
  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles/available-count");
        const data = await response.json();
        setAvailableVehiclesCount(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules disponibles", error);
        setError("Erreur lors du chargement des véhicules disponibles");
      }
    };
    fetchAvailableVehicles();
  }, []);

  // Récupérer le nombre de clients
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
          setError("Erreur lors du chargement des clients");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des nombres de clients", error);
        setAvailableClientsCount(null);
        setError("Erreur lors du chargement des clients");
      }
    };
    fetchAvailableClients();
  }, []);

  // Fonctions pour les actions du tableau
  const handleViewBooking = (id: number) => {
    console.log(`Voir la réservation ${id}`);
    // Ajoutez ici la logique pour voir les détails (par exemple, ouvrir un modal ou rediriger)
  };

  const handleEditBooking = (id: number) => {
    console.log(`Modifier la réservation ${id}`);
    // Ajoutez ici la logique pour modifier (par exemple, rediriger vers une page de modification)
  };

  const handleDeleteBooking = (id: number) => {
    console.log(`Supprimer la réservation ${id}`);
    // Ajoutez ici la logique pour supprimer (par exemple, retirer de la liste statique pour l'instant)
  };

  return (
    <Box sx={{ px: isMobile ? 2 : 3, py: 2 }}>
      {/* Afficher les erreurs s'il y en a */}
      {(error || vehiclesError) && (
        <Typography color="error" sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
          {error || vehiclesError}
        </Typography>
      )}

      {/* Widgets statistiques */}
      <Grid container spacing={isMobile ? 2 : 4} mb={isMobile ? 2 : 4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CarIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#1976D2", mb: 1 }} />
            <Typography variant="body2" color="text.secondary" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
              Véhicules disponibles
            </Typography>
            <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"}>
              {availableVehiclesCount ?? "Chargement..."}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <PeopleIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#FBC02D", mb: 1 }} />
            <Typography variant="body2" color="text.secondary" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
              Total Clients
            </Typography>
            <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"}>
              {availableClientsCount ?? "Chargement..."}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <MoneyIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#4CAF50", mb: 1 }} />
            <Typography variant="body2" color="text.secondary" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
              Revenus totaux
            </Typography>
            <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"}>
              2 000 000 Ar
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <PercentIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#E91E63", mb: 1 }} />
            <Typography variant="body2" color="text.secondary" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
              Taux d'occupation
            </Typography>
            <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"}>
              75%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Graphique et véhicules disponibles */}
      <Grid container spacing={isMobile ? 2 : 4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 3 }}>
            <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"}>
              Performance <TrendingUpIcon sx={{ verticalAlign: "middle", ml: 1, fontSize: isMobile ? "1rem" : "1.25rem" }} />
            </Typography>
            <Box sx={{ height: isMobile ? 200 : 300 }}>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 4, 5], label: "Mois" }]}
                series={[
                  {
                    data: [200000, 300000, 250000, 400000, 350000],
                    label: "Revenus (Ar)",
                  },
                ]}
                height={isMobile ? 200 : 300}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 3 }}>
            <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"}>
              Véhicules disponibles
            </Typography>
            {availableCars.length > 0 ? (
              availableCars.map((car: Vehicle) => (
                <Box key={car.id} display="flex" alignItems="center" gap={2} my={isMobile ? 1 : 2}>
                  <Avatar variant="rounded" src={car.imageUrl} sx={{ width: isMobile ? 40 : 56, height: isMobile ? 40 : 56 }} />
                  <Box>
                    <Typography variant="subtitle1" fontSize={isMobile ? "0.9rem" : "1rem"}>
                      {car.nom}
                    </Typography>
                    <Typography variant="body2" color="success.main" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
                      {car.status.status}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
                Aucun véhicule disponible pour le moment.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Réservations récentes */}
      <Paper elevation={3} sx={{ mt: isMobile ? 2 : 4, p: isMobile ? 2 : 3 }}>
        <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"}>
          Réservations récentes
        </Typography>
        {isMobile ? (
          // Affichage sous forme de cartes sur mobile
          <Box>
            {recentBookings.map((booking) => (
              <Card key={booking.id} sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Client: {booking.client}
                  </Typography>
                  <Typography variant="body2">Véhicule: {booking.car}</Typography>
                  <Typography variant="body2">Début: {booking.startDate}</Typography>
                  <Typography variant="body2">Fin: {booking.endDate}</Typography>
                  <Typography variant="body2">
                    Statut: 
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        px: 1,
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
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", p: 1 }}>
                  <Tooltip title="Voir">
                    <IconButton
                      onClick={() => handleViewBooking(booking.id)}
                      aria-label={`Voir la réservation ${booking.id}`}
                      size="small"
                    >
                      <VisibilityIcon color="info" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Modifier">
                    <IconButton
                      onClick={() => handleEditBooking(booking.id)}
                      aria-label={`Modifier la réservation ${booking.id}`}
                      size="small"
                    >
                      <EditIcon color="primary" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton
                      onClick={() => handleDeleteBooking(booking.id)}
                      aria-label={`Supprimer la réservation ${booking.id}`}
                      size="small"
                    >
                      <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
          </Box>
        ) : (
          // Affichage sous forme de tableau sur tablette et desktop
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>Client</TableCell>
                  <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>Véhicule</TableCell>
                  <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>Date début</TableCell>
                  <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>Date fin</TableCell>
                  <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>Statut</TableCell>
                  <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>{booking.client}</TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>{booking.car}</TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>{booking.startDate}</TableCell>
                    <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem" }}>{booking.endDate}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: "4px",
                          fontSize: isTablet ? "0.75rem" : "0.8rem",
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
                        <IconButton
                          onClick={() => handleViewBooking(booking.id)}
                          aria-label={`Voir la réservation ${booking.id}`}
                          size={isTablet ? "small" : "medium"}
                        >
                          <VisibilityIcon color="info" fontSize={isTablet ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          onClick={() => handleEditBooking(booking.id)}
                          aria-label={`Modifier la réservation ${booking.id}`}
                          size={isTablet ? "small" : "medium"}
                        >
                          <EditIcon color="primary" fontSize={isTablet ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          onClick={() => handleDeleteBooking(booking.id)}
                          aria-label={`Supprimer la réservation ${booking.id}`}
                          size={isTablet ? "small" : "medium"}
                        >
                          <DeleteIcon color="error" fontSize={isTablet ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Accueil;