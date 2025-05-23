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
import Navbar from "../components/Navbar";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Types
interface Vehicle {
  id: number;
  marque: string;
  modele: string;
  status: { status: string };
  type: { type: string };
  imageUrl: string;
  description?: string;
  features?: string[];
  immatriculation?: string;
  nombrePlace?: number;
}

// Données fictives pour les régions
const regions = [
  { name: "Paris", price: 100 },
  { name: "Lyon", price: 80 },
  { name: "Marseille", price: 90 },
  { name: "Bordeaux", price: 85 },
];

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
      src={vehicle.imageUrl || "https://via.placeholder.com/600x338?text=Image+Indisponible "}
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
      <Typography variant="h5" fontWeight="bold" color={COLORS.text} gutterBottom>
        {vehicle.marque} {vehicle.modele}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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

// Interface pour les données de réservation
interface ReservationData {
  startDate: Dayjs;
  endDate: Dayjs;
  fullName: string;
  phone: string;
  email: string;
  region: string;
}

// Formulaire de réservation
const ReservationForm: React.FC<{
  onSubmit: (data: ReservationData) => void;
  vehicle: Vehicle;
}> = ({ onSubmit, vehicle }) => {
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
    if (startDate?.isAfter(endDate)) newErrors.endDate = "La date de fin doit être après la date de début";
    if (startDate?.isBefore(dayjs(), "day")) newErrors.startDate = "La date ne peut pas être dans le passé";
    if (!fullName.trim()) newErrors.fullName = "Nom complet requis";
    if (!phone.trim()) newErrors.phone = "Numéro de téléphone requis";
    else if (!/^\+?\d{10,15}$/.test(phone)) newErrors.phone = "Numéro invalide";
    if (!email.trim()) newErrors.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email invalide";
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
      });
    }
  };

  const selectedRegion = regions.find((r) => r.name === region);
  const totalPrice = selectedRegion
    ? selectedRegion.price * Math.abs(startDate?.diff(endDate, "day") || 0)
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
                onChange={(newValue) => setStartDate(newValue)}
                minDate={dayjs()}
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
                onChange={(newValue) => setEndDate(newValue)}
                minDate={startDate || dayjs()}
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
              <InputLabel>Région</InputLabel>
              <Select value={region} onChange={(e) => setRegion(e.target.value)} label="Région">
                {regions.map((r) => (
                  <MenuItem key={r.name} value={r.name}>
                    {r.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.region && <Typography color="error">{errors.region}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ bgcolor: "#F1F5F9", p: 2, borderRadius: 2, textAlign: "center" }}>
              <Typography fontWeight="bold" color={selectedRegion ? COLORS.primary : "text.secondary"}>
                Prix par jour : {selectedRegion ? `${selectedRegion.price} €` : "Sélectionnez une région"}
              </Typography>
              {selectedRegion && (
                <Typography fontWeight="bold" color={COLORS.text} mt={1}>
                  Total : {totalPrice} €
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
              placeholder="+33612345678"
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
              placeholder="jean.dupont@example.com"
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
  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);
  const vehicle = vehicles.find((v) => v.id === parseInt(id || "0"));

  const loadData = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (!vehicle) throw new Error("Véhicule non trouvé");
      if (vehicle.status.status !== "Disponible")
        throw new Error("Ce véhicule n'est pas disponible pour la réservation");
      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  }, [vehicle]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReservationSubmit = (data: ReservationData) => {
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => navigate("/list-vehicule"), 2000);
    }, 1000);
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
        <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: "#aaa", mb: 2 }} />
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
      <Navbar />
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
          <Alert severity="success" icon={<CheckCircleOutlineIcon />} sx={{ mb: 4 }}>
            Réservation confirmée ! Vous serez redirigé vers la liste des véhicules.
          </Alert>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <VehicleSummary vehicle={vehicle} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReservationForm vehicle={vehicle} onSubmit={handleReservationSubmit} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
    
  );
};

export default ReservationPage;