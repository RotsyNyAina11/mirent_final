import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"; // Importez le plugin
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

// Ajoutez le plugin isBetween à dayjs
dayjs.extend(isBetween);

// Interface de la réservation (doit correspondre à la réponse de votre API findOne)
interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  fullName: string;
  phone: string;
  email: string;
  totalPrice: number;
  status: string; // Statut brut du backend
  vehicle: {
    id: number;
    nom: string;
    marque: string;
    modele: string;
    immatriculation: string;
    imageUrl: string;
    type: { id: number; type: string };
    status: { id: number; status: string };
  };
  pickupRegion: {
    id: number;
    nom_region: string;
    nom_district: string;
    prix: { id: number; prix: number };
  };
}

interface ReservationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  reservationId: number | null;
}

// Nouvelle fonction utilitaire pour déterminer le statut affiché
const getDisplayedStatus = (
  reservation: Reservation | null
): string | undefined => {
  if (!reservation) {
    return undefined;
  }

  const today = dayjs();
  const startDate = dayjs(reservation.startDate);
  const endDate = dayjs(reservation.endDate);

  // Utilisez le statut backend si c'est Annulée ou Terminée (s'il est mis à jour)
  if (reservation.status === "Annulée") {
    return "Annulée";
  }
  // Si le backend met à jour "Terminée", on l'affiche directement
  if (reservation.status === "Terminée") {
    return "Terminée";
  }

  // Logique d'inférence basée sur les dates (comme dans ReservationList)
  if (today.isBefore(startDate, "day")) {
    return "À venir"; // Ou "Upcoming" selon votre constante
  }
  if (today.isBetween(startDate, endDate, "day", "[]")) {
    return "En cours"; // Ou "In Progress"
  }
  if (today.isAfter(endDate, "day")) {
    return "Terminée"; // Ou "Completed"
  }

  // Fallback si aucune condition ne correspond
  return reservation.status;
};

const ReservationDetailsDialog: React.FC<ReservationDetailsDialogProps> = ({
  open,
  onClose,
  reservationId,
}) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!reservationId || !open) {
        setReservation(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      console.log(`API call to fetch reservation details for ${reservationId} is disabled.`);
      setError("Les appels API sont désactivés.");
      setIsLoading(false);
    };

    fetchReservationDetails();
  }, [reservationId, open]);

  // Déterminez le statut à afficher ici
  const displayedStatus = getDisplayedStatus(reservation);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "Annulée":
        return "red";
      case "Terminée":
        return "green";
      case "En cours":
        return "orange"; // Utilisez orange pour 'En cours'
      case "À venir":
        return "blue"; // Utilisez bleu pour 'À venir'
      default:
        return "inherit";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Détails de la réservation</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : reservation ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations Véhicule
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={
                    reservation.vehicle.imageUrl ||
                    "https://via.placeholder.com/250x150?text=Image+Vehicule"
                  }
                  alt={`${reservation.vehicle.marque} ${reservation.vehicle.modele}`}
                  style={{
                    width: "100%",
                    maxWidth: 250,
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Marque:</strong> {reservation.vehicle.marque}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Modèle:</strong> {reservation.vehicle.modele}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Immatriculation:</strong>{" "}
                {reservation.vehicle.immatriculation}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Type:</strong> {reservation.vehicle.type.type}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <DirectionsCarIcon sx={{ mr: 1 }} color="action" />
                <strong>Statut du véhicule:</strong>{" "}
                {reservation.vehicle.status.status}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations Réservation
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CalendarTodayIcon sx={{ mr: 1 }} color="action" />
                <strong>Début:</strong>{" "}
                {dayjs(reservation.startDate).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <CalendarTodayIcon sx={{ mr: 1 }} color="action" />
                <strong>Fin:</strong>{" "}
                {dayjs(reservation.endDate).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <LocationOnIcon sx={{ mr: 1 }} color="action" />
                <strong>Déstination de prise en charge:</strong>{" "}
                {reservation.pickupRegion.nom_region} (
                {reservation.pickupRegion.nom_district})
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <AttachMoneyIcon sx={{ mr: 1 }} color="action" />
                <strong>Prix par jour:</strong>{" "}
                {reservation.pickupRegion.prix.prix} Ar
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{ display: "flex", alignItems: "center", mt: 2 }}
              >
                <AttachMoneyIcon sx={{ mr: 1 }} color="primary" />
                <strong>Prix total:</strong> {reservation.totalPrice} Ar
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mt: 1 }}
              >
                <strong>Statut Réservation:</strong>{" "}
                <span
                  style={{
                    marginLeft: 8,
                    fontWeight: "bold",
                    color: getStatusColor(displayedStatus), // Utilisation de la fonction de couleur
                  }}
                >
                  {displayedStatus} {/* Affichage du statut calculé */}
                </span>
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Informations Client
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <PersonIcon sx={{ mr: 1 }} color="action" />
                <strong>Nom complet:</strong> {reservation.fullName}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <PhoneIcon sx={{ mr: 1 }} color="action" />
                <strong>Téléphone:</strong> {reservation.phone}
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <EmailIcon sx={{ mr: 1 }} color="action" />
                <strong>Email:</strong> {reservation.email}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>Aucune réservation sélectionnée ou trouvée.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDetailsDialog;
