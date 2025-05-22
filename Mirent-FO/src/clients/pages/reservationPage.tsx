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
  IconButton,
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
import Navbar from "../components/Navbar";
import bgImage from "/src/assets/bg.jpeg";
import dayjs, { Dayjs } from "dayjs";

// Types
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  status: string;
  type: string;
  image: string;
  description: string;
  features: string[];
}

// Données fictives
const mockVehicles: Vehicle[] = [
  {
    id: 1,
    brand: "Toyota",
    model: "Corolla",
    status: "Disponible",
    type: "Berline",
    image: "/src/assets/1.jpg",
    description:
      "La Toyota Corolla est une berline fiable et économique, parfaite pour les trajets urbains et les longues distances.",
    features: [
      "Climatisation",
      "Système hybride",
      "Caméra de recul",
      "Bluetooth",
    ],
  },
  {
    id: 2,
    brand: "Honda",
    model: "Civic",
    status: "Réservé",
    type: "Berline",
    image: "/src/assets/1.jpg",
    description:
      "La Honda Civic combine style et performance avec une conduite dynamique.",
    features: [
      "Écran tactile",
      "Régulateur de vitesse",
      "Sièges chauffants",
      "Aide au stationnement",
    ],
  },
  {
    id: 3,
    brand: "BMW",
    model: "Serie 3",
    status: "Disponible",
    type: "Berline",
    image: "/src/assets/1.jpg",
    description:
      "La BMW Série 3 offre une expérience de conduite premium avec des finitions haut de gamme.",
    features: [
      "Suspension adaptative",
      "Toit ouvrant",
      "Système de navigation",
      "Intérieur cuir",
    ],
  },
  {
    id: 4,
    brand: "Mercedes",
    model: "Classe C",
    status: "En maintenance",
    type: "Berline",
    image: "/src/assets/1.jpg",
    description: "La Mercedes Classe C est synonyme de luxe et de confort.",
    features: [
      "Sièges électriques",
      "Éclairage d'ambiance",
      "Assistance à la conduite",
      "Son premium",
    ],
  },
  {
    id: 5,
    brand: "Volkswagen",
    model: "Tiguan",
    status: "Disponible",
    type: "SUV",
    image: "/src/assets/1.jpg",
    description:
      "Le Volkswagen Tiguan est un SUV polyvalent, idéal pour les familles.",
    features: [
      "4x4",
      "Coffre spacieux",
      "Écran multifonction",
      "Démarrage sans clé",
    ],
  },
  {
    id: 6,
    brand: "Audi",
    model: "Q5",
    status: "Réservé",
    type: "SUV",
    image: "/src/assets/1.jpg",
    description:
      "L'Audi Q5 allie élégance et robustesse avec des performances tout-terrain.",
    features: [
      "Quattro 4x4",
      "Toit panoramique",
      "Volant multifonction",
      "Écran tête haute",
    ],
  },
];

// Sous-composant pour le récapitulatif du véhicule
const VehicleSummary: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => (
  <Card
    sx={{
      borderRadius: 8,
      boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
      bgcolor: "linear-gradient(145deg, #ffffff, #f9f9f9)",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      mb: 4,
    }}
  >
    <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
      <Box
        component="img"
        src={
          vehicle.image ||
          "https://via.placeholder.com/150x100?text=Image+Indisponible"
        }
        alt={`${vehicle.brand} ${vehicle.model}`}
        sx={{ width: 150, height: 100, objectFit: "cover", borderRadius: 4 }}
      />
      <Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#0f172a", fontFamily: "'Inter', sans-serif" }}
        >
          {vehicle.brand} {vehicle.model}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Chip
            icon={<DirectionsCarIcon />}
            label={vehicle.type}
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <Chip
            icon={
              vehicle.status === "Disponible" ? (
                <CheckCircleIcon />
              ) : vehicle.status === "Réservé" ? (
                <CancelIcon />
              ) : (
                <BuildIcon />
              )
            }
            label={vehicle.status}
            sx={{
              bgcolor:
                vehicle.status === "Disponible"
                  ? "#e8f5e9"
                  : vehicle.status === "Réservé"
                  ? "#fff3e0"
                  : "#ffebee",
              color:
                vehicle.status === "Disponible"
                  ? "#2e7d32"
                  : vehicle.status === "Réservé"
                  ? "#ff9800"
                  : "#d32f2f",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Sous-composant pour le formulaire de réservation
const ReservationForm: React.FC<{
  onSubmit: (data: ReservationData) => void;
  vehicle: Vehicle;
}> = ({ onSubmit, vehicle }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!startDate) newErrors.startDate = "Date de début requise";
    if (!endDate) newErrors.endDate = "Date de fin requise";
    if (startDate && endDate && startDate.isAfter(endDate)) {
      newErrors.endDate = "La date de fin doit être après la date de début";
    }
    if (startDate && startDate.isBefore(dayjs(), "day")) {
      newErrors.startDate = "La date de début ne peut pas être dans le passé";
    }
    if (!fullName.trim()) newErrors.fullName = "Nom complet requis";
    if (!phone.trim()) newErrors.phone = "Numéro de téléphone requis";
    else if (!/^\+?\d{10,15}$/.test(phone))
      newErrors.phone = "Numéro de téléphone invalide";
    if (!email.trim()) newErrors.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email invalide";
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
      });
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 8,
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
        bgcolor: "linear-gradient(145deg, #ffffff, #f9f9f9)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        p: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#0f172a", mb: 3, fontFamily: "'Inter', sans-serif" }}
        >
          Formulaire de Réservation
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
                    sx: {
                      "& .MuiInputBase-root": {
                        fontFamily: "'Inter', sans-serif",
                      },
                    },
                    InputLabelProps: {
                      sx: { fontFamily: "'Inter', sans-serif" },
                    },
                  },
                }}
                aria-label="Sélectionner la date de début de la réservation"
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
                    sx: {
                      "& .MuiInputBase-root": {
                        fontFamily: "'Inter', sans-serif",
                      },
                    },
                    InputLabelProps: {
                      sx: { fontFamily: "'Inter', sans-serif" },
                    },
                  },
                }}
                aria-label="Sélectionner la date de fin de la réservation"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName}
              sx={{
                "& .MuiInputBase-root": { fontFamily: "'Inter', sans-serif" },
              }}
              InputLabelProps={{ sx: { fontFamily: "'Inter', sans-serif" } }}
              aria-label="Entrer votre nom complet"
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
              sx={{
                "& .MuiInputBase-root": { fontFamily: "'Inter', sans-serif" },
              }}
              InputLabelProps={{ sx: { fontFamily: "'Inter', sans-serif" } }}
              aria-label="Entrer votre numéro de téléphone"
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
              sx={{
                "& .MuiInputBase-root": { fontFamily: "'Inter', sans-serif" },
              }}
              InputLabelProps={{ sx: { fontFamily: "'Inter', sans-serif" } }}
              aria-label="Entrer votre adresse email"
            />
          </Grid>
        </Grid>
      </CardContent>
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <motion.div
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={vehicle.status !== "Disponible"}
            sx={{
              bgcolor: "#ff6f61",
              color: "#fff",
              borderRadius: 8,
              px: 6,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              "&:hover": { bgcolor: "#ff4d40" },
              "&:disabled": { bgcolor: "#bdbdbd", color: "#fff" },
            }}
            aria-label="Confirmer la réservation"
          >
            Confirmer la Réservation
          </Button>
        </motion.div>
      </Box>
    </Card>
  );
};

// Interface pour les données de réservation
interface ReservationData {
  startDate: Dayjs;
  endDate: Dayjs;
  fullName: string;
  phone: string;
  email: string;
}

const ReservationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const vehicle = mockVehicles.find((v) => v.id === parseInt(id || "0"));

  // Gestion du chargement
  const loadData = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulation API
      if (!vehicle) {
        throw new Error("Véhicule non trouvé");
      }
      if (vehicle.status !== "Disponible") {
        throw new Error("Ce véhicule n'est pas disponible pour la réservation");
      }
      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  }, [vehicle]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Gestion de la soumission du formulaire
  const handleReservationSubmit = (data: ReservationData) => {
    // Simulation d'une soumission API
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => navigate("/list-vehicule"), 2000); // Redirection après succès
    }, 1000);
  };

  // Animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)" },
    tap: { scale: 0.95 },
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#ff6f61" }} />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          py: 8,
          minHeight: "100vh",
          bgcolor: "rgba(0,0,0,0.7)",
        }}
      >
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 60, color: "#fff", opacity: 0.7 }}
        />
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            mt: 2,
            opacity: 0.9,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {error || "Véhicule non trouvé"}
        </Typography>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="contained"
            onClick={() => navigate("/list-vehicule")}
            sx={{
              mt: 3,
              bgcolor: "#ff6f61",
              color: "#fff",
              borderRadius: 8,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              "&:hover": { bgcolor: "#ff4d40" },
            }}
            aria-label="Retour à la liste des véhicules"
          >
            Retour à la Flotte
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #2b2d42 0%, #1e1e2e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Parallax Background */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
          zIndex: 0,
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
      />
      <Navbar />
      <Container
        sx={{
          py: { xs: 4, md: 8 },
          position: "relative",
          zIndex: 1,
          maxWidth: "md",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/list-vehicule`)}
            sx={{
              color: "#fff",
              mb: 3,
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              "&:hover": { color: "#ff6f61" },
            }}
            aria-label="Retour aux détails du véhicule"
          >
            Retour
          </Button>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "#ffffff",
              mb: 4,
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              textShadow: "0px 3px 8px rgba(0, 0, 0, 0.4)",
            }}
          >
            Réserver {vehicle.brand} {vehicle.model}
          </Typography>
          <VehicleSummary vehicle={vehicle} />
          {success ? (
            <Alert
              severity="success"
              sx={{ mb: 4, borderRadius: 8, fontFamily: "'Inter', sans-serif" }}
            >
              Réservation confirmée ! Vous serez redirigé vers la flotte.
            </Alert>
          ) : (
            <ReservationForm
              vehicle={vehicle}
              onSubmit={handleReservationSubmit}
            />
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default ReservationPage;
