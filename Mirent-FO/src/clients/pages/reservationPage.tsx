import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BuildIcon from "@mui/icons-material/Build";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Navbar from "../Components/Navbar";

// Types
interface Vehicle {
  id: number;
  marque: string;
  modele: string;
  status: { status: string }; // Assurez-vous que ceci correspond à votre entité Status côté backend
  type: { type: string };
  imageUrl: string;
  description?: string;
  features?: string[];
  immatriculation?: string;
  nombrePlace?: number;
}

// Type pour les données de région
interface Region {
  id: number;
  nom_region: string;
  nom_district: string;
  prix: { id: number; prix: number }; // Ajout du prix pour chaque région
}
interface Prix {
  id: number;
  prix: number;
}

// Palette de couleurs
const COLORS = {
  primary: "#4A90E2",
  secondary: "#50C878",
  danger: "#FF3B30",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  text: "#1A1A2E",
};

// Sous-composant : Fiche Véhicule
const VehicleSummary: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => (
  <Card
    sx={{
      borderRadius: 4,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      bgcolor: COLORS.surface,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
      },
    }}
  >
    <Box
      component="img"
      src={
        vehicle.imageUrl ||
        "https://via.placeholder.com/600x338?text=Image+Indisponible "
      }
      alt={`${vehicle.marque} ${vehicle.modele}`}
      sx={{
        width: "100%",
        height: { xs: 200, sm: 240, md: 300 },
        objectFit: "cover",
        borderRadius: 2,
        mb: 2,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    />
    <CardContent>
      <Typography
        variant="h5"
        fontWeight="bold"
        color={COLORS.text}
        gutterBottom
      >
        {vehicle.marque} {vehicle.modele}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Chip
          icon={
            vehicle.status.status === "Disponible" ? (
              <CheckCircleIcon />
            ) : vehicle.status.status === "Réservé" ? (
              <CancelIcon />
            ) : (
              <BuildIcon />
            )
          }
          label={vehicle.status.status}
          size="small"
          sx={{
            bgcolor:
              vehicle.status.status === "Disponible"
                ? "#e8f5e9"
                : vehicle.status.status === "Réservé"
                ? "#fff3e0"
                : "#ffebee",
            color:
              vehicle.status.status === "Disponible"
                ? "#2e7d32"
                : vehicle.status.status === "Réservé"
                ? "#f57c00"
                : "#d32f2f",
            fontWeight: 600,
          }}
        />
        <Chip
          icon={<DirectionsCarIcon />}
          label={vehicle.type.type}
          size="small"
          sx={{
            bgcolor: "#e3f2fd",
            color: "#1565c0",
            fontWeight: 600,
          }}
        />
      </Box>
      {vehicle.immatriculation && (
        <Typography variant="body2" color="#64748b">
          Immatriculation: {vehicle.immatriculation}
        </Typography>
      )}
      {vehicle.nombrePlace && (
        <Typography variant="body2" color="#64748b">
          Places: {vehicle.nombrePlace}
        </Typography>
      )}
    </CardContent>
  </Card>
);

interface ReservationData {
  startDate: Dayjs;
  endDate: Dayjs;
  fullName: string;
  phone: string;
  email: string;
  region: string;
  totalPrice: number;
}

const ReservationForm: React.FC<{
  onSubmit: (data: ReservationData) => void;
  vehicle: Vehicle;
  regions: Region[];
}> = ({ onSubmit, vehicle, regions }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!startDate) newErrors.startDate = "Date de début requise";
    if (!endDate) newErrors.endDate = "Date de fin requise";
    // Si la date de début est après la date de fin, ou si les dates sont les mêmes mais endDate est invalide
    if (startDate && endDate && startDate.isAfter(endDate, "day")) {
      // Comparaison au jour près
      newErrors.endDate =
        "La date de fin doit être après ou égale à la date de début.";
    }
    if (startDate?.isBefore(dayjs(), "day"))
      newErrors.startDate = "La date de début ne peut pas être dans le passé.";
    if (!fullName.trim()) newErrors.fullName = "Nom complet requis";
    if (!phone.trim()) newErrors.phone = "Numéro de téléphone requis";
    else if (!/^\+?\d{10,15}$/.test(phone)) newErrors.phone = "Numéro invalide";
    if (!email.trim()) newErrors.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email invalide";
    if (!region) newErrors.region = "Région requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        startDate: startDate!,
        endDate: endDate!,
        fullName,
        phone,
        email,
        region,
        totalPrice, // Le totalPrice calculé ici sera envoyé
      });
    }
  };

  // Correction : Calcul du nombre de jours pour inclure la date de fin
  const numberOfDays =
    startDate &&
    endDate &&
    (endDate.isSame(startDate, "day") || endDate.isAfter(startDate, "day")) // Vérifie que endDate est après ou égale à startDate
      ? endDate.diff(startDate, "day") + 1 // Ajoute 1 pour inclure le jour de fin dans le calcul
      : 0;

  const selectedRegion = regions.find((r) => r.nom_region === region);
  const totalPrice = selectedRegion
    ? Number(selectedRegion.prix.prix) * numberOfDays
    : 0;

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        bgcolor: COLORS.surface,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Réserver ce véhicule
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue as Dayjs | null)}
                minDate={dayjs()} // Empêche les dates passées
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue as Dayjs | null)}
                minDate={startDate || dayjs()} // La date de fin ne peut pas être avant la date de début
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.region}>
              <InputLabel>Destination</InputLabel>
              <Select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                label="Destination"
              >
                {regions.map((r) => (
                  <MenuItem key={r.id} value={r.nom_region}>
                    {r.nom_region} ({r.nom_district})
                  </MenuItem>
                ))}
              </Select>
              {errors.region && (
                <Typography color="error">{errors.region}</Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                bgcolor: "#F1F5F9",
                p: 2,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography
                fontWeight="bold"
                color={selectedRegion ? COLORS.primary : "text.secondary"}
              >
                Prix par jour :{" "}
                {selectedRegion
                  ? `${selectedRegion.prix.prix} Ar`
                  : "Sélectionnez une région"}
              </Typography>
              {selectedRegion && (
                <Typography fontWeight="bold" color={COLORS.text} mt={1}>
                  Total : {totalPrice} Ar
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName}
              placeholder="Jean Dupont"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="+261 32 00 333 02"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              placeholder="jean@example.com"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={vehicle.status.status !== "Disponible"}
              fullWidth
              sx={{
                bgcolor: COLORS.primary,
                color: "#fff",
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#357ABD" },
                "&:disabled": { bgcolor: "#ccc", cursor: "not-allowed" },
              }}
            >
              Confirmer la Réservation
            </Button>
          </motion.div>
        </Box>
      </CardContent>
    </Card>
  );
};

// Page principale
const ReservationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [regionsData, setRegionsData] = useState<Region[]>([]); // State to store fetched regions

  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);
  const vehicle = vehicles.find((v) => v.id === parseInt(id || "0"));

  const fetchRegions = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/regions"); // Assurez-vous que l'URL est correcte
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRegionsData(data);
    } catch (err) {
      console.error("Error fetching regions:", err);
      setError("Erreur lors du chargement des régions.");
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simule un chargement

      if (!vehicle) {
        throw new Error("Véhicule non trouvé");
      }
      // Note: La validation de disponibilité est déjà faite côté backend.
      // Vous pouvez garder ce check pour un feedback rapide côté client.
      if (vehicle.status.status !== "Disponible") {
        throw new Error("Ce véhicule n'est pas disponible pour la réservation");
      }

      await fetchRegions();

      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  }, [vehicle, fetchRegions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReservationSubmit = async (data: ReservationData) => {
    try {
      const response = await fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: vehicle ? vehicle.id : null,
          startDate: data.startDate.format("YYYY-MM-DD"),
          endDate: data.endDate.format("YYYY-MM-DD"),
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          regionName: data.region, // Envoyer le nom de la région au lieu de l'ID si le backend l'attend
          totalPrice: data.totalPrice, // Envoyer le prix calculé par le frontend
          clientId: data.email, // Si l'email est utilisé comme ID client
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Affiche le message d'erreur spécifique du backend
        throw new Error(
          errorData.message ||
            "Une erreur est survenue lors du traitement de votre réservation."
        );
      }

      setSuccess(true);
      // Redirection après un court délai pour que l'utilisateur voie le message de succès
      setTimeout(() => navigate("/list-vehicule"), 2000);
    } catch (err) {
      console.error("Reservation error:", err);
      // Assurez-vous que le message d'erreur est bien une chaîne
      setError((err as Error).message || "Une erreur inconnue est survenue.");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: COLORS.background,
        }}
      >
        <CircularProgress size={60} sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          py: 10,
          bgcolor: COLORS.background,
        }}
      >
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 80, color: "#aaa", mb: 2 }}
        />
        <Typography variant="h5" color="#333" mb={3}>
          {error || "Véhicule non trouvé"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/list-vehicule")}
          sx={{
            bgcolor: COLORS.primary,
            color: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            "&:hover": { bgcolor: "#357ABD" },
          }}
        >
          Retour à la Flotte
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: COLORS.background, pb: 8, pt: { xs: 10, md: 12 } }}>
      <Navbar />{" "}
      {/* Assurez-vous que le Navbar est importé et rendu correctement */}
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/list-vehicule")}
          sx={{
            color: COLORS.primary,
            mb: 4,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Retour à la flotte
        </Button>

        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Réserver votre {vehicle.marque} {vehicle.modele}
        </Typography>

        {success ? (
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon />}
            sx={{ mb: 4 }}
          >
            Réservation confirmée ! Vous serez redirigé vers la liste des
            véhicules.
          </Alert>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <VehicleSummary vehicle={vehicle} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReservationForm
                vehicle={vehicle}
                onSubmit={handleReservationSubmit}
                regions={regionsData}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ReservationPage;
