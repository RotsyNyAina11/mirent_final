import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useDispatch, useSelector } from "react-redux";
import { styled, createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchVehicles, fetchAvailableVehiclesCount, Vehicle } from "../../../redux/features/vehicle/vehiclesSlice";
import { fetchReservations, Reservation, ReservationStatus, selectAllReservations } from "../../../redux/features/reservation/reservationSlice"; 
import { CalendarIcon } from "@mui/x-date-pickers";

const theme = createTheme({
  palette: {
    primary: { main: "#3b82f6" },
    secondary: { main: "#FFA500" },
    background: { default: "#f9fafb" },
    text: { primary: "#1f2937", secondary: "#6b7280" },

  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: "#1f2937" },
    h6: { fontWeight: 600, color: "#1f2937" },
    body1: { fontSize: "0.9rem", color: "#1f2937" },
    body2: { fontSize: "0.85rem", color: "#6b7280" },
  },
});

const DashboardCard = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  transition: "box-shadow 0.3s ease, transform 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.02)",
  },
}));

const Accueil: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const { vehicles, availableCount } = useSelector(
    (state: RootState) => state.vehicles
  );

  // Sélecteur pour les réservations (ajouté)
  const reservations = useSelector(selectAllReservations);

  const [availableClientsCount, setAvailableClientsCount] = React.useState<number | null>(null);

  // Charger véhicules, count et réservations au montage (ajout de fetchReservations)
  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchAvailableVehiclesCount());
    dispatch(fetchReservations()); 
  }, [dispatch]);

  const availableCars = vehicles.filter(
    (vehicle: Vehicle) => vehicle.status.status === "Disponible"
  );

  // Filtrer les réservations en attente (ajouté)
  const pendingReservations = reservations.filter(
    (res: Reservation) => res.status === ReservationStatus.DEVIS
  );

  // Fetch clients (manuel)
  useEffect(() => {
    const fetchAvailableClients = async () => {
      try {
        const response = await fetch("http://localhost:3000/clients/client-count");
        const data = await response.json();
        if (response.ok) {
          // sécuriser si data est un nombre ou un objet { count: number }
          const count = typeof data === "number" ? data : data?.count;
          setAvailableClientsCount(typeof count === "number" ? count : null);
        } else {
          console.error("Erreur API:", data.message);
          setAvailableClientsCount(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
        setAvailableClientsCount(null);
      }
    };
    fetchAvailableClients();
  }, []);

  // Fonction pour formater les montants en Ariary (ajoutée pour le tableau)
  const formatCurrencyAr = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0
    }).format(amount) + ' Ar';
  };

  // Fonction pour obtenir le nom du client (ajoutée pour le tableau)
  const getClientName = (reservation: Reservation): string => {
    return `${reservation.client?.lastName || 'N/A'}`;
  };

  // Fonction pour obtenir le nom du véhicule (ajoutée pour le tableau)
  const getVehicleName = (reservation: Reservation): string => {
    return `${reservation.vehicule?.marque || ''} ${reservation.vehicule?.modele || ''}`.trim() || 'N/A';
  };

  // Fonction pour obtenir la plaque d'immatriculation (ajoutée pour le tableau)
  const getVehicleLicensePlate = (reservation: Reservation): string => {
    return reservation.vehicule?.immatriculation || 'N/A';
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ px: isMobile ? 2 : 3, py: 2, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <Grid container spacing={3} mb={isMobile ? 2 : 4}>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 1 }}>
              Tableau de Bord
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "0.9rem", color: "#6b7280" }}>
              Aperçu des performances, véhicules disponibles et devis récents.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={isMobile ? 2 : 4} mb={isMobile ? 2 : 4}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <CarIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#3b82f6", mb: 1 }} />
              <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>Véhicules disponibles</Typography>
              <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"} color="#1f2937">
                {typeof availableCount === "number" ? availableCount : "Chargement..."}
              </Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <PeopleIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#3b82f6", mb: 1 }} />
              <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>Total Clients</Typography>
              <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"} color="#1f2937">
                {typeof availableClientsCount === "number" ? availableClientsCount : "Chargement..."}
              </Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <MoneyIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#3b82f6", mb: 1 }} />
              <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>Revenus totaux</Typography>
              <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"} color="#1f2937">2 000 000 Ar</Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <PercentIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#3b82f6", mb: 1 }} />
              <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>Taux d'occupation</Typography>
              <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"} color="#1f2937">75%</Typography>
            </DashboardCard>
          </Grid>
        </Grid>

        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} md={8}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"} color="#1f2937">
                Performance <TrendingUpIcon sx={{ verticalAlign: "middle", ml: 1, fontSize: isMobile ? "1rem" : "1.25rem", color: "#3b82f6" }} />
              </Typography>
              <Box sx={{ height: isMobile ? 200 : 300 }}>
                <LineChart
                  xAxis={[{ data: [1, 2, 3, 4, 5], label: "Mois", scaleType: "point", tickFontSize: isMobile ? 10 : 12 }]}
                  series={[{ data: [200000, 300000, 250000, 400000, 350000], label: "Revenus (Ar)", color: "#3b82f6" }]}
                  height={isMobile ? 200 : 300}
                  margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
                  sx={{
                    "& .MuiChartsAxis-tickLabel": { fontSize: isMobile ? "0.7rem" : "0.8rem" },
                    "& .MuiChartsAxis-label": { fontSize: isMobile ? "0.8rem" : "0.9rem" },
                  }}
                />
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"} color="#1f2937">Véhicules disponibles</Typography>
              <Box sx={{ maxHeight: isMobile ? 200 : 300, overflowY: "auto", overflowX: "hidden", pr: 1 }}>
                {availableCars.length > 0 ? (
                  availableCars.map((car: Vehicle) => (
                    <Box key={car.id} display="flex" alignItems="center" gap={2} my={isMobile ? 1 : 2} sx={{ p: 1, borderRadius: "8px", "&:hover": { backgroundColor: "#f3f4f6" } }}>
                      <Avatar variant="rounded" src={car.imageUrl || undefined} sx={{ width: isMobile ? 40 : 56, height: isMobile ? 40 : 56 }} />
                      <Box>
                        <Typography variant="subtitle1" fontSize={isMobile ? "0.9rem" : "1rem"} color="#1f2937">{car.marque}-({car.immatriculation})</Typography>
                        <Typography variant="body2" color="success.main" fontSize={isMobile ? "0.8rem" : "0.875rem"}>{car.status.status}</Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>Aucun véhicule disponible pour le moment.</Typography>
                )}
              </Box>
            </DashboardCard>
          </Grid>

          {/* Nouvelle section : Liste des réservations en attente (ajoutée) */}
          <Grid item xs={12}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"} color="#1f2937">
                Réservations en Attente
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Référence</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Véhicule</TableCell>
                      <TableCell>Dates</TableCell>
                      <TableCell>Prix Total</TableCell>
                      <TableCell>Statut</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingReservations.length > 0 ? (
                      pendingReservations.map((reservation: Reservation) => (
                        <TableRow key={reservation.id} hover>
                          <TableCell>{reservation.reference || 'N/A'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                              {getClientName(reservation)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CarIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                              {getVehicleName(reservation)} ({getVehicleLicensePlate(reservation)})
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                              Du {new Date(reservation.pickup_date).toLocaleDateString()} au {new Date(reservation.return_date).toLocaleDateString()}
                            </Box>
                          </TableCell>
                          <TableCell>{reservation.total_price ? formatCurrencyAr(reservation.total_price) : 'N/A'}</TableCell>
                          <TableCell>
                            <Chip label={reservation.status} color="secondary" size="small"/>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="#6b7280">Aucune réservation confirmée pour le moment.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DashboardCard>
          </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
};

export default Accueil;