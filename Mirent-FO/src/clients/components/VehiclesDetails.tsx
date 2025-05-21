import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BuildIcon from "@mui/icons-material/Build";
import bgImage from "/src/assets/bg.jpeg";

// Types
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  status: string;
  type: string;
  image: string[];
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
    image: ["/src/assets/1.jpg"],
    description: "La Toyota Corolla est une berline fiable et économique, parfaite pour les trajets urbains et les longues distances. Équipée d'un moteur hybride, elle offre un excellent rendement énergétique.",
    features: ["Climatisation", "Système hybride", "Caméra de recul", "Bluetooth"],
  },
  {
    id: 2,
    brand: "Honda",
    model: "Civic",
    status: "Réservé",
    type: "Berline",
    image: ["/src/assets/1.jpg"],
    description: "La Honda Civic combine style et performance avec une conduite dynamique. Idéale pour ceux qui recherchent confort et technologie.",
    features: ["Écran tactile", "Régulateur de vitesse", "Sièges chauffants", "Aide au stationnement"],
  },
  {
    id: 3,
    brand: "BMW",
    model: "Serie 3",
    status: "Disponible",
    type: "Berline",
    image: ["/src/assets/1.jpg"],
    description: "La BMW Série 3 offre une expérience de conduite premium avec des finitions haut de gamme et des technologies avancées.",
    features: ["Suspension adaptative", "Toit ouvrant", "Système de navigation", "Intérieur cuir"],
  },
  {
    id: 4,
    brand: "Mercedes",
    model: "Classe C",
    status: "En maintenance",
    type: "Berline",
    image: ["/src/assets/1.jpg"],
    description: "La Mercedes Classe C est synonyme de luxe et de confort, avec des équipements de pointe et une conduite fluide.",
    features: ["Sièges électriques", "Éclairage d'ambiance", "Assistance à la conduite", "Son premium"],
  },
  {
    id: 5,
    brand: "Volkswagen",
    model: "Tiguan",
    status: "Disponible",
    type: "SUV",
    image: ["/src/assets/1.jpg"],
    description: "Le Volkswagen Tiguan est un SUV polyvalent, idéal pour les familles et les aventures en plein air, avec un espace généreux.",
    features: ["4x4", "Coffre spacieux", "Écran multifonction", "Démarrage sans clé"],
  },
  {
    id: 6,
    brand: "Audi",
    model: "Q5",
    status: "Réservé",
    type: "SUV",
    image: ["/src/assets/1.jpg"],
    description: "L'Audi Q5 allie élégance et robustesse, avec des performances tout-terrain et un intérieur raffiné.",
    features: ["Quattro 4x4", "Toit panoramique", "Volant multifonction", "Écran tête haute"],
  },
];

// Sous-composant pour le carrousel d'images
const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box sx={{ position: "relative", height: 400, overflow: "hidden", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
      <AnimatePresence>
        <motion.img
          key={currentImage}
          src={images[currentImage] || "https://via.placeholder.com/500x400?text=Image+Indisponible"}
          alt="Véhicule"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.6)", color: "white" }}
            aria-label="Image précédente"
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.6)", color: "white" }}
            aria-label="Image suivante"
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
};

// Sous-composant pour les caractéristiques
const FeaturesGrid: React.FC<{ features: string[] }> = ({ features }) => (
  <Grid container spacing={2} sx={{ mb: 4 }}>
    {features.map((feature, index) => (
      <Grid item xs={12} sm={6} key={index}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#1976d2", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}
          >
            • {feature}
          </Typography>
        </motion.div>
      </Grid>
    ))}
  </Grid>
);

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const vehicle = mockVehicles.find((v) => v.id === parseInt(id || "0"));

  // Gestion optimisée du chargement
  const loadData = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulation API
      if (!vehicle) {
        throw new Error("Véhicule non trouvé");
      }
      setIsLoading(false);
    } catch (err) {
      setError("Impossible de charger les détails du véhicule");
      setIsLoading(false);
    }
  }, [vehicle]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={60} sx={{ color: "#ff6f61" }} />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box sx={{ width: "100%", textAlign: "center", py: 8, minHeight: "100vh", bgcolor: "rgba(0,0,0,0.7)" }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#fff", opacity: 0.7 }} />
        <Typography
          variant="h5"
          sx={{ color: "#fff", mt: 2, opacity: 0.9, fontFamily: "'Inter', sans-serif" }}
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
      <Container sx={{ py: { xs: 4, md: 8 }, position: "relative", zIndex: 1 }}>
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card
            sx={{
              borderRadius: 8,
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
              bgcolor: "linear-gradient(145deg, #ffffff, #f9f9f9)",
              maxWidth: 1000,
              mx: "auto",
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <ImageCarousel images={vehicle.image} />
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: "#0f172a",
                  mb: 3,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {vehicle.brand} {vehicle.model}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
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
                    bgcolor: vehicle.status === "Disponible" ? "#e8f5e9" : vehicle.status === "Réservé" ? "#fff3e0" : "#ffebee",
                    color: vehicle.status === "Disponible" ? "#2e7d32" : vehicle.status === "Réservé" ? "#ff9800" : "#d32f2f",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "#475569",
                  mb: 4,
                  lineHeight: 1.8,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {vehicle.description}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#0f172a", mb: 3, fontFamily: "'Inter', sans-serif" }}
              >
                Caractéristiques
              </Typography>
              <FeaturesGrid features={vehicle.features} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/voitures/${vehicle.id}/reserver`)}
                    disabled={vehicle.status !== "Disponible"}
                    sx={{
                      bgcolor: "#ff6f61",
                      color: "#fff",
                      borderRadius: 8,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontFamily: "'Inter', sans-serif",
                      "&:hover": { bgcolor: "#ff4d40" },
                      "&:disabled": { bgcolor: "#bdbdbd", color: "#fff" },
                    }}
                    aria-label={`Réserver ${vehicle.brand} ${vehicle.model}`}
                  >
                    Réserver Maintenant
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/list-vehicule")}
                    sx={{
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      borderRadius: 8,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontFamily: "'Inter', sans-serif",
                      "&:hover": { borderColor: "#1565c0", bgcolor: "rgba(25, 118, 210, 0.08)" },
                    }}
                    aria-label="Retour à la liste des véhicules"
                  >
                    Retour à la Flotte
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VehicleDetails;