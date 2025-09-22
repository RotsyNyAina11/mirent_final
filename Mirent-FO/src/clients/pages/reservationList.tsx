// src/pages/ReservationList.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  ButtonGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Navbar from "../Components/Navbar";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // Import for isSameOrAfter
import { Link } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

// Importez les nouveaux composants Dialog
import ReservationDetails from "../pages/reservationDetailPage";
import ReservationEdit from "../pages/reservationEditPage";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter); // Extend dayjs with isSameOrAfter

// URL de base de votre API NestJS (à ajuster si nécessaire)
const API_BASE_URL = "http://localhost:3000";

// Enumération pour les statuts de réservation (doit correspondre à ReservationStatus.ts du backend)
enum ReservationStatus {
  UPCOMING = "À venir",
  IN_PROGRESS = "En cours",
  COMPLETED = "Terminée",
  CANCELLED = "Annulée",
  PENDING_PAYMENT = "En attente de paiement",
  CONFIRMED = "Confirmée", // Potentiellement utilisé si vous avez une étape de confirmation explicite
}

// Interface Reservation (assurez-vous qu'elle correspond toujours au backend)
interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  fullName: string;
  phone: string;
  email: string;
  totalPrice: number;
  status: ReservationStatus; // Utilise l'énumération du backend
  vehicle: {
    id: number;
    nom: string;
    marque: string;
    modele: string;
    immatriculation: string;
    imageUrl: string;
    type: { id: number; type: string };
    status: { id: number; status: string }; // Statut du véhicule (Disponible, Réservé, En maintenance)
  };
  pickupRegion: {
    id: number;
    nom_region: string;
    nom_district: string;
    prix: { id: number; prix: number };
  };
}

const itemsPerPage = 4;

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("Toutes"); // Filtre basé sur le statut affiché
  const [sort, setSort] = useState("recent");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  // États pour les modales
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(
    null
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);

  /**
   * Récupère la liste des réservations depuis le backend.
   */
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log("API call to fetch reservations is disabled.");
    setReservations([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // --- Fonctions de gestion des modales et actions ---

  // Ouvrir la modale de détails
  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setOpenDetailsDialog(true);
  };

  // Fermer la modale de détails
  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedReservation(null);
  };

  // Ouvrir la modale d'édition
  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setOpenEditDialog(true);
  };

  // Fermer la modale d'édition
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedReservation(null);
    fetchReservations(); // Recharger les réservations après une édition potentielle
  };

  // Demander confirmation avant d'annuler
  const handleConfirmCancel = (id: number) => {
    setReservationToCancel(id);
    setOpenCancelDialog(true);
  };

  // Annuler la réservation après confirmation (appel PATCH au lieu de DELETE)
  const handleCancelReservation = async () => {
    if (reservationToCancel === null) return;

    setOpenCancelDialog(false);
    console.log(`API call to cancel reservation ${reservationToCancel} is disabled.`);
    setReservationToCancel(null);
  };

  // Logique de filtrage, tri et pagination
  const filteredReservations = reservations.filter((res) => {
    const matchSearch =
      res.vehicle.modele.toLowerCase().includes(searchText.toLowerCase()) ||
      res.vehicle.marque.toLowerCase().includes(searchText.toLowerCase()) ||
      res.vehicle.immatriculation
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      res.fullName.toLowerCase().includes(searchText.toLowerCase()) || // Ajout du nom complet pour la recherche
      res.email.toLowerCase().includes(searchText.toLowerCase()) || // Ajout de l'email pour la recherche
      res.phone.includes(searchText); // Ajout du téléphone pour la recherche

    // La logique de détermination du statut affiché reste pertinente
    let reservationDisplayStatus: ReservationStatus;
    const today = dayjs();
    const startDate = dayjs(res.startDate);
    const endDate = dayjs(res.endDate);

    // Priorité à l'état "Annulée" ou "Terminée" s'il vient du backend
    if (res.status === ReservationStatus.CANCELLED) {
      reservationDisplayStatus = ReservationStatus.CANCELLED;
    } else if (res.status === ReservationStatus.COMPLETED) {
      reservationDisplayStatus = ReservationStatus.COMPLETED;
    } else if (today.isBefore(startDate, "day")) {
      reservationDisplayStatus = ReservationStatus.UPCOMING;
    } else if (today.isBetween(startDate, endDate, "day", "[]")) {
      // Inclut les bornes
      reservationDisplayStatus = ReservationStatus.IN_PROGRESS;
    } else if (today.isAfter(endDate, "day")) {
      reservationDisplayStatus = ReservationStatus.COMPLETED; // Redondant si le backend gère mais assure la cohérence
    } else {
      // Si le statut du backend est 'En attente de paiement' ou 'Confirmée'
      reservationDisplayStatus = res.status;
    }

    const matchFilter =
      filter === "Toutes" || reservationDisplayStatus === filter;
    return matchSearch && matchFilter;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sort === "recent") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (sort === "ancien") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (sort === "prix") {
      // Tri par prix (ascendant)
      return a.totalPrice - b.totalPrice;
    }
    return 0; // Fallback
  });

  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const paginatedReservations = sortedReservations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ pb: 8, pt: { xs: 10, md: 12 }, px: { xs: 2, md: 4 } }}>
      <Navbar />
      <Typography
        variant="h4"
        mb={4}
        fontWeight="bold"
        align="center"
        color="#1A1A2E"
      >
        Mes Réservations
      </Typography>

      {/* Barre de filtre supérieure */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          p: 2,
          borderRadius: 3,
          boxShadow: 2,
          mb: 3,
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Rechercher par modèle, marque, immatriculation, client..."
          sx={{
            flexGrow: 1,
            maxWidth: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <ButtonGroup
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          {Object.values(ReservationStatus).map(
            // Utilise les valeurs de l'énumération pour les boutons
            (label) => (
              <Button
                key={label}
                variant={filter === label ? "contained" : "outlined"}
                onClick={() => setFilter(label)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {label}
              </Button>
            )
          )}
          {/* Ajout du filtre "Toutes" si vous ne l'avez pas dans l'énumération */}
          <Button
            key="Toutes"
            variant={filter === "Toutes" ? "contained" : "outlined"}
            onClick={() => setFilter("Toutes")}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Toutes
          </Button>
        </ButtonGroup>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-label">Trier par</InputLabel>
          <Select
            labelId="sort-label"
            value={sort}
            label="Trier par"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="recent">Plus récent</MenuItem>
            <MenuItem value="ancien">Plus ancien</MenuItem>
            <MenuItem value="prix">Prix</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Chargement/Erreur/Pas de Réservations */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
            bgcolor: "#F9FAFB",
          }}
        >
          <CircularProgress size={60} sx={{ color: "#4A90E2" }} />
          <Typography variant="h6" sx={{ mt: 2, color: "#1A1A2E" }}>
            Chargement des réservations...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 5, bgcolor: "#F9FAFB" }}>
          <SentimentDissatisfiedIcon
            sx={{ fontSize: 80, color: "#FF3B30", mb: 2 }}
          />
          <Typography variant="h5" color="#FF3B30" mb={3}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchReservations}
            sx={{ bgcolor: "#4A90E2", "&:hover": { bgcolor: "#357ABD" } }}
          >
            Réessayer
          </Button>
        </Box>
      ) : paginatedReservations.length === 0 ? (
        <Alert
          severity="info"
          sx={{ mt: 4, bgcolor: "#e3f2fd", color: "#1565c0" }}
        >
          <Typography variant="body1">
            Aucune réservation trouvée.
            <Link
              to="/list-vehicule"
              style={{
                color: "#4A90E2",
                textDecoration: "none",
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              Réservez un véhicule maintenant !
            </Link>
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {paginatedReservations.map((res) => {
            let displayedStatus: ReservationStatus;
            let chipColor:
              | "success"
              | "warning"
              | "error"
              | "info"
              | "primary" = "info";

            const today = dayjs();
            const startDate = dayjs(res.startDate);
            const endDate = dayjs(res.endDate);

            // Détermination du statut affiché basé sur la logique backend et la date actuelle
            if (res.status === ReservationStatus.CANCELLED) {
              displayedStatus = ReservationStatus.CANCELLED;
            } else if (res.status === ReservationStatus.COMPLETED) {
              displayedStatus = ReservationStatus.COMPLETED;
            } else if (today.isBefore(startDate, "day")) {
              displayedStatus = ReservationStatus.UPCOMING;
            } else if (today.isBetween(startDate, endDate, "day", "[]")) {
              displayedStatus = ReservationStatus.IN_PROGRESS;
            } else if (today.isAfter(endDate, "day")) {
              // Si le backend n'a pas encore mis à jour en "Terminée", on l'affiche comme tel
              displayedStatus = ReservationStatus.COMPLETED;
            } else {
              // Pour les autres statuts comme 'En attente de paiement', 'Confirmée'
              displayedStatus = res.status;
            }

            // Définition de la couleur du chip en fonction du statut affiché
            switch (displayedStatus) {
              case ReservationStatus.UPCOMING:
                chipColor = "primary";
                break;
              case ReservationStatus.IN_PROGRESS:
                chipColor = "warning";
                break;
              case ReservationStatus.COMPLETED:
                chipColor = "success";
                break;
              case ReservationStatus.CANCELLED:
                chipColor = "error";
                break;
              case ReservationStatus.PENDING_PAYMENT:
                chipColor = "info"; // Ou une autre couleur spécifique
                break;
              case ReservationStatus.CONFIRMED:
                chipColor = "primary"; // Peut-être une nuance différente de primary
                break;
              default:
                chipColor = "info";
            }

            // Les réservations sont annulables si elles sont À venir, En cours ou En attente de paiement/confirmée
            const isCancellable =
              displayedStatus === ReservationStatus.UPCOMING ||
              displayedStatus === ReservationStatus.IN_PROGRESS ||
              displayedStatus === ReservationStatus.PENDING_PAYMENT ||
              displayedStatus === ReservationStatus.CONFIRMED;

            // Les réservations sont modifiables uniquement si elles sont À venir ou En attente de paiement
            const isEditable =
              displayedStatus === ReservationStatus.UPCOMING ||
              displayedStatus === ReservationStatus.PENDING_PAYMENT;

            return (
              <Grid item xs={12} key={res.id}>
                <Card
                  sx={{ display: "flex", p: 2, borderRadius: 3, boxShadow: 3 }}
                >
                  <Box
                    component="img"
                    src={
                      res.vehicle.imageUrl ||
                      "https://via.placeholder.com/200x150?text=Image+Vehicule"
                    }
                    alt={res.vehicle.modele}
                    sx={{
                      width: 200,
                      height: 150,
                      borderRadius: 2,
                      objectFit: "cover",
                      mr: 2,
                    }}
                  />
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 0.5,
                      p: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {res.vehicle.marque} {res.vehicle.modele}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Du {dayjs(res.startDate).format("DD/MM/YYYY")} au{" "}
                      {dayjs(res.endDate).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Immatriculation: {res.vehicle.immatriculation || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Région: {res.pickupRegion.nom_region} (
                      {res.pickupRegion.nom_district})
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {res.totalPrice} Ar
                    </Typography>
                  </Box>
                  <Stack justifyContent="space-between" alignItems="flex-end">
                    <Chip
                      label={displayedStatus}
                      color={chipColor}
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                    <Stack direction="row" spacing={1} mt={2}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(res)}
                      >
                        Voir détails
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(res)}
                        disabled={!isEditable}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleConfirmCancel(res.id)}
                        disabled={!isCancellable}
                      >
                        Annuler
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
        />
      </Box>

      {/* Modale de confirmation d'annulation */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">
          {"Confirmer l'annulation ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Êtes-vous sûr de vouloir annuler cette réservation ? Cette action
            est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Non</Button>
          <Button onClick={handleCancelReservation} autoFocus color="error">
            Oui, Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modale de Détails */}
      {selectedReservation && (
        <ReservationDetails
          open={openDetailsDialog}
          onClose={handleCloseDetailsDialog}
          reservationId={selectedReservation.id}
        />
      )}

      {/* Modale d'Édition */}
      {selectedReservation && (
        <ReservationEdit
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          reservationId={selectedReservation.id}
        />
      )}
    </Box>
  );
};

export default ReservationList;
