import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
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
import { LineChart } from "@mui/x-charts/LineChart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchVehicles, Vehicle } from "../../redux/features/vehicle/vehiclesSlice";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

// Thème personnalisé (identique à LocationList.tsx et VehiclesList.tsx)
const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#ef4444",
    },
    background: {
      default: "#f9fafb",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: "#1f2937",
    },
    h6: {
      fontWeight: 600,
      color: "#1f2937",
    },
    body1: {
      fontSize: "0.9rem",
      color: "#1f2937",
    },
    body2: {
      fontSize: "0.85rem",
      color: "#6b7280",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
  },
});

// Styles personnalisés (alignés avec LocationList.tsx et VehiclesList.tsx)
const DashboardCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  transition: 'box-shadow 0.3s ease, transform 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'scale(1.02)',
  },
}));

const SecondaryButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#ef4444',
  color: theme.palette.common.white,
  padding: '8px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#dc2626',
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease',
  },
  '&.Mui-disabled': {
    backgroundColor: '#d1d5db',
    color: '#6b7280',
  },
}));

const CancelButton = styled(IconButton)(({ theme }) => ({
  color: '#6b7280',
  borderColor: '#d1d5db',
  padding: '8px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    borderColor: '#9ca3af',
    backgroundColor: '#f3f4f6',
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease',
  },
}));

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(recentBookings);

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
  };

  const handleEditBooking = (id: number) => {
    console.log(`Modifier la réservation ${id}`);
  };

  const handleDeleteBooking = () => {
    if (bookingToDelete) {
      setBookings(bookings.filter((booking) => booking.id !== bookingToDelete.id));
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
    setBookingToDelete(null);
  };

  const openDeleteDialogForBooking = (booking: Booking) => {
    setBookingToDelete(booking);
    setOpenDeleteDialog(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ px: isMobile ? 2 : 3, py: 2, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        {/* Afficher les erreurs s'il y en a */}
        {(error || vehiclesError) && (
          <Typography color="error" sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            {error || vehiclesError}
          </Typography>
        )}

        {/* Titre de la page */}
        <Grid container spacing={3} mb={isMobile ? 2 : 4}>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937', marginBottom: 1 }}>
              Tableau de Bord
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Aperçu des performances, véhicules disponibles et réservations récentes.
            </Typography>
          </Grid>
        </Grid>

        {/* Widgets statistiques */}
        <Grid container spacing={isMobile ? 2 : 4} mb={isMobile ? 2 : 4}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <CarIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#3b82f6", mb: 1, transition: 'all 0.3s ease' }} aria-label="Icône de véhicules disponibles" />
              <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
                Véhicules disponibles
              </Typography>
              <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"} color="#1f2937">
                {availableVehiclesCount ?? "Chargement..."}
              </Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <PeopleIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#3b82f6", mb: 1, transition: 'all 0.3s ease' }} aria-label="Icône de total clients" />
              <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
                Total Clients
              </Typography>
              <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"} color="#1f2937">
                {availableClientsCount ?? "Chargement..."}
              </Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <MoneyIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#3b82f6", mb: 1, transition: 'all 0.3s ease' }} aria-label="Icône de revenus totaux" />
              <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
                Revenus totaux
              </Typography>
              <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"} color="#1f2937">
                2 000 000 Ar
              </Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <PercentIcon sx={{ fontSize: isMobile ? 30 : 40, color: "#3b82f6", mb: 1, transition: 'all 0.3s ease' }} aria-label="Icône de taux d'occupation" />
              <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
                Taux d'occupation
              </Typography>
              <Typography variant="h5" fontSize={isMobile ? "1.2rem" : "1.5rem"} color="#1f2937">
                75%
              </Typography>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Graphique et véhicules disponibles */}
        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} md={8}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"} color="#1f2937">
                Performance <TrendingUpIcon sx={{ verticalAlign: "middle", ml: 1, fontSize: isMobile ? "1rem" : "1.25rem", color: "#3b82f6" }} />
              </Typography>
              <Box sx={{ height: isMobile ? 200 : 300 }}>
                <LineChart
                  xAxis={[{ data: [1, 2, 3, 4, 5], label: "Mois", scaleType: "point", tickFontSize: isMobile ? 10 : 12 }]}
                  series={[
                    {
                      data: [200000, 300000, 250000, 400000, 350000],
                      label: "Revenus (Ar)",
                      color: "#3b82f6",
                    },
                  ]}
                  height={isMobile ? 200 : 300}
                  margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
                  sx={{
                    '& .MuiChartsAxis-tickLabel': {
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                    },
                    '& .MuiChartsAxis-label': {
                      fontSize: isMobile ? '0.8rem' : '0.9rem',
                    },
                  }}
                />
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"} color="#1f2937">
                Véhicules disponibles
              </Typography>
              <Box
                sx={{
                  maxHeight: isMobile ? 200 : 300,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f3f4f6',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#3b82f6',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#2563eb',
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#3b82f6 #f3f4f6',
                }}
              >
                {availableCars.length > 0 ? (
                  availableCars.map((car: Vehicle) => (
                    <Box
                      key={car.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      my={isMobile ? 1 : 2}
                      sx={{
                        p: 1,
                        borderRadius: '8px',
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#f3f4f6',
                        },
                      }}
                      aria-label={`Véhicule disponible: ${car.nom}`}
                    >
                      <Avatar variant="rounded" src={car.imageUrl} sx={{ width: isMobile ? 40 : 56, height: isMobile ? 40 : 56 }} />
                      <Box>
                        <Typography variant="subtitle1" fontSize={isMobile ? "0.9rem" : "1rem"} color="#1f2937">
                          {car.nom}
                        </Typography>
                        <Typography variant="body2" color="success.main" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
                          {car.status.status}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="#6b7280" fontSize={isMobile ? "0.8rem" : "0.875rem"}>
                    Aucun véhicule disponible pour le moment.
                  </Typography>
                )}
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Réservations récentes */}
        <DashboardCard sx={{ mt: isMobile ? 2 : 4, p: isMobile ? 2 : 3 }}>
          <Typography variant="h6" gutterBottom fontSize={isMobile ? "1rem" : "1.25rem"} color="#1f2937">
            Réservations récentes
          </Typography>
          {isMobile ? (
            // Affichage sous forme de cartes sur mobile
            <Box>
              {bookings.map((booking) => (
                <Card
                  key={booking.id}
                  sx={{
                    mb: 2,
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                    transition: 'box-shadow 0.3s ease, transform 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" fontWeight="bold" color="#1f2937" fontSize={isMobile ? "0.85rem" : "0.9rem"}>
                      Client: {booking.client}
                    </Typography>
                    <Typography variant="body2" color="#1f2937" fontSize={isMobile ? "0.85rem" : "0.9rem"}>
                      Véhicule: {booking.car}
                    </Typography>
                    <Typography variant="body2" color="#1f2937" fontSize={isMobile ? "0.85rem" : "0.9rem"}>
                      Début: {booking.startDate}
                    </Typography>
                    <Typography variant="body2" color="#1f2937" fontSize={isMobile ? "0.85rem" : "0.9rem"}>
                      Fin: {booking.endDate}
                    </Typography>
                    <Typography variant="body2" color="#1f2937" fontSize={isMobile ? "0.85rem" : "0.9rem"}>
                      Statut: 
                      <Box
                        component="span"
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.5,
                          borderRadius: "4px",
                          fontSize: isMobile ? "0.75rem" : "0.8rem",
                          backgroundColor:
                            booking.status === "En cours"
                              ? "#C8E6C9"
                              : booking.status === "Confirmé"
                              ? "#BBDEFB"
                              : "#FFECB3",
                          color:
                            booking.status === "En cours"
                              ? "#fff"
                              : booking.status === "Confirmé"
                              ? "#fff"
                              : "#fff",
                          background:
                            booking.status === "En cours"
                              ? "linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)"
                              : booking.status === "Confirmé"
                              ? "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)"
                              : "linear-gradient(90deg, #FBC02D 0%, #FFD54F 100%)",
                        }}
                        aria-label={`Statut de la réservation: ${booking.status}`}
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
                        sx={{
                          color: '#3b82f6',
                          '&:hover': { backgroundColor: '#dbeafe', transition: 'background-color 0.3s ease' },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton
                        onClick={() => handleEditBooking(booking.id)}
                        aria-label={`Modifier la réservation ${booking.id}`}
                        size="small"
                        sx={{
                          color: '#3b82f6',
                          '&:hover': { backgroundColor: '#dbeafe', transition: 'background-color 0.3s ease' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        onClick={() => openDeleteDialogForBooking(booking)}
                        aria-label={`Supprimer la réservation ${booking.id}`}
                        size="small"
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: '#fee2e2', transition: 'background-color 0.3s ease' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              ))}
            </Box>
          ) : (
            // Affichage sous forme de tableau sur tablette et desktop
            <TableContainer
              sx={{
                borderRadius: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: '#f3f4f6',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: isTablet ? "0.9rem" : "0.85rem" }}>
                      Client
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: isTablet ? "0.9rem" : "0.85rem" }}>
                      Véhicule
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: isTablet ? "0.9rem" : "0.85rem" }}>
                      Date début
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: isTablet ? "0.9rem" : "0.85rem" }}>
                      Date fin
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: isTablet ? "0.9rem" : "0.85rem" }}>
                      Statut
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: isTablet ? "0.9rem" : "0.85rem" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                        '&:hover': {
                          backgroundColor: '#f3f4f6',
                          transition: 'background-color 0.3s ease',
                        },
                        '& td': { borderBottom: 'none' },
                      }}
                    >
                      <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem", color: '#1f2937' }}>
                        {booking.client}
                      </TableCell>
                      <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem", color: '#1f2937' }}>
                        {booking.car}
                      </TableCell>
                      <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem", color: '#1f2937' }}>
                        {booking.startDate}
                      </TableCell>
                      <TableCell sx={{ fontSize: isTablet ? "0.9rem" : "1rem", color: '#1f2937' }}>
                        {booking.endDate}
                      </TableCell>
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
                                ? "#fff"
                                : booking.status === "Confirmé"
                                ? "#fff"
                                : "#fff",
                            background:
                              booking.status === "En cours"
                                ? "linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)"
                                : booking.status === "Confirmé"
                                ? "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)"
                                : "linear-gradient(90deg, #FBC02D 0%, #FFD54F 100%)",
                          }}
                          aria-label={`Statut de la réservation: ${booking.status}`}
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
                            sx={{
                              color: '#3b82f6',
                              '&:hover': { backgroundColor: '#dbeafe', transition: 'background-color 0.3s ease' },
                            }}
                          >
                            <VisibilityIcon fontSize={isTablet ? "small" : "medium"} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton
                            onClick={() => handleEditBooking(booking.id)}
                            aria-label={`Modifier la réservation ${booking.id}`}
                            size={isTablet ? "small" : "medium"}
                            sx={{
                              color: '#3b82f6',
                              '&:hover': { backgroundColor: '#dbeafe', transition: 'background-color 0.3s ease' },
                            }}
                          >
                            <EditIcon fontSize={isTablet ? "small" : "medium"} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            onClick={() => openDeleteDialogForBooking(booking)}
                            aria-label={`Supprimer la réservation ${booking.id}`}
                            size={isTablet ? "small" : "medium"}
                            sx={{
                              color: '#ef4444',
                              '&:hover': { backgroundColor: '#fee2e2', transition: 'background-color 0.3s ease' },
                            }}
                          >
                            <DeleteIcon fontSize={isTablet ? "small" : "medium"} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DashboardCard>

        {/* Dialogue de confirmation de suppression */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              backgroundColor: '#fff',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: '#1f2937', textAlign: 'center', py: 3 }}>
            Confirmer la suppression
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <DialogContentText sx={{ color: '#1f2937', fontSize: '1rem', textAlign: 'center' }}>
              Êtes-vous sûr de vouloir supprimer la réservation de {bookingToDelete?.client} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, display: "flex", justifyContent: "space-between" }}>
            <CancelButton
              onClick={() => setOpenDeleteDialog(false)}
              aria-label="Annuler la suppression"
            >
              Annuler
            </CancelButton>
            <SecondaryButton
              onClick={handleDeleteBooking}
              aria-label="Confirmer la suppression"
            >
              Supprimer
            </SecondaryButton>
          </DialogActions>
        </Dialog>

        {/* Snackbar de succès */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{
              width: "100%",
              backgroundColor: "#10b981",
              color: "#fff",
              "& .MuiAlert-icon": {
                color: "#fff",
              },
            }}
          >
            Réservation supprimée avec succès !
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Accueil;