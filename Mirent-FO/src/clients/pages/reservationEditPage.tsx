// src/components/reservations/ReservationEditDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

// Interface de la réservation (doit correspondre à la réponse de votre API findOne)
interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  fullName: string;
  phone: string;
  email: string;
  totalPrice: number;
  status: string;
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

// Interface pour le DTO de mise à jour (ce que le frontend envoie)
interface UpdateReservationDto {
  startDate?: string;
  endDate?: string;
  fullName?: string;
  phone?: string;
  email?: string;
}

interface ReservationEditDialogProps {
  open: boolean;
  onClose: (updated?: boolean) => void; // Indique si une mise à jour a eu lieu
  reservationId: number | null;
}

const ReservationEditDialog: React.FC<ReservationEditDialogProps> = ({
  open,
  onClose,
  reservationId,
}) => {
  const [reservationData, setReservationData] = useState<UpdateReservationDto>({
    startDate: "",
    endDate: "",
    fullName: "",
    phone: "",
    email: "",
  });
  const [originalReservation, setOriginalReservation] =
    useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Charger les données de la réservation quand la modale s'ouvre ou l'ID change
  useEffect(() => {
    const fetchReservationForEdit = async () => {
      if (!reservationId || !open) {
        setOriginalReservation(null);
        setReservationData({
          startDate: "",
          endDate: "",
          fullName: "",
          phone: "",
          email: "",
        });
        setError(null);
        setSuccess(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await fetch(
          `http://localhost:3000/reservations/${reservationId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              "Échec du chargement des données pour modification."
          );
        }
        const data: Reservation = await response.json();
        setOriginalReservation(data); // Garde une copie de l'original
        setReservationData({
          startDate: data.startDate,
          endDate: data.endDate,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
        });
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données de réservation:",
          err
        );
        setError("Impossible de charger les données pour la modification.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationForEdit();
  }, [reservationId, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear errors on change
    setSuccess(null);
  };

  const handleDateChange = (
    date: Dayjs | null,
    name: "startDate" | "endDate"
  ) => {
    setReservationData((prev) => ({
      ...prev,
      [name]: date ? date.toISOString() : "", // Utilise ISOString pour le backend
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalReservation || !reservationId) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const dataToSend: UpdateReservationDto = {};

      // Construire le DTO à envoyer, seulement avec les champs qui ont changé
      if (reservationData.fullName !== originalReservation.fullName) {
        dataToSend.fullName = reservationData.fullName;
      }
      if (reservationData.phone !== originalReservation.phone) {
        dataToSend.phone = reservationData.phone;
      }
      if (reservationData.email !== originalReservation.email) {
        dataToSend.email = reservationData.email;
      }
      // Comparer les dates après conversion en Dayjs pour ignorer les différences minimes de format ou fuseau horaire
      const originalStartDate = dayjs(originalReservation.startDate);
      const originalEndDate = dayjs(originalReservation.endDate);
      const currentStartDate = dayjs(reservationData.startDate);
      const currentEndDate = dayjs(reservationData.endDate);

      if (
        !currentStartDate.isSame(originalStartDate, "day") ||
        !currentStartDate.isSame(originalStartDate, "hour")
      ) {
        dataToSend.startDate = reservationData.startDate;
      }
      if (
        !currentEndDate.isSame(originalEndDate, "day") ||
        !currentEndDate.isSame(originalEndDate, "hour")
      ) {
        dataToSend.endDate = reservationData.endDate;
      }

      // Si aucune donnée n'a changé, on ne fait pas d'appel API
      if (Object.keys(dataToSend).length === 0) {
        setSuccess("Aucune modification à sauvegarder.");
        setIsSaving(false);
        return;
      }

      const response = await fetch(
        `http://localhost:3000/reservations/${reservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer votre_token_jwt` // Si authentification requise
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la mise à jour.");
      }

      setSuccess("Réservation mise à jour avec succès !");
      // Appelez onClose avec true pour indiquer que la liste doit être rafraîchie
      onClose(true);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(
        "Erreur lors de la sauvegarde: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>Modifier la réservation #{reservationId}</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error && !isSaving ? ( // N'affiche l'erreur que si ce n'est pas une erreur de sauvegarde en cours
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        ) : originalReservation ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Informations Client */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Informations Client
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom complet"
                  name="fullName"
                  value={reservationData.fullName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Téléphone"
                  name="phone"
                  value={reservationData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={reservationData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>

              {/* Période de Réservation */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Période de Réservation
                </Typography>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de début"
                    value={dayjs(reservationData.startDate)}
                    onChange={(date) =>
                      handleDateChange(date as Dayjs | null, "startDate")
                    }
                    format="DD/MM/YYYY HH:mm" // Assurez-vous que le format inclut l'heure si pertinent
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                        required: true,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de fin"
                    value={dayjs(reservationData.endDate)}
                    onChange={(date) =>
                      handleDateChange(date as Dayjs | null, "endDate")
                    }
                    format="DD/MM/YYYY HH:mm"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "normal",
                        required: true,
                      },
                    }}
                  />
                </Grid>
              </LocalizationProvider>

              {/* Informations non modifiables affichées */}
              <Grid item xs={12} mt={2}>
                <Typography variant="h6" gutterBottom>
                  Informations Véhicule et Région (non modifiables)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Véhicule"
                  value={`${originalReservation.vehicle.marque} ${originalReservation.vehicle.modele} (${originalReservation.vehicle.immatriculation})`}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Région de prise en charge"
                  value={`${originalReservation.pickupRegion.nom_region} (${originalReservation.pickupRegion.nom_district})`}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Prix total (recalculé par le serveur si dates changent)"
                  value={`${originalReservation.totalPrice} Ar`}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
            </Grid>
            <DialogActions sx={{ px: 0, pt: 3 }}>
              <Button onClick={() => onClose()} disabled={isSaving}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <CircularProgress size={24} />
                ) : (
                  "Sauvegarder les modifications"
                )}
              </Button>
            </DialogActions>
          </form>
        ) : (
          <Typography>
            Aucune réservation sélectionnée pour modification.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReservationEditDialog;
