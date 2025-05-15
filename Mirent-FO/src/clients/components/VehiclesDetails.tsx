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
  Fade,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EuroIcon from "@mui/icons-material/Euro";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import bgImage from "/src/assets/bg.jpeg";

// Types
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  price: number;
  type: string;
  images: string[];
  description: string;
  features: string[];
}

// Données fictives
const mockVehicles: Vehicle[] = [
  {
    id: 1,
    brand: "Toyota",
    model: "Corolla",
    price: 50,
    type: "Berline",
    images: ["/src/assets/1.jpg", "/src/assets/2.jpg", "/src/assets/3.jpg"],
    description: "La Toyota Corolla est une berline fiable et économique, parfaite pour les trajets urbains et les longues distances. Équipée d'un moteur hybride, elle offre un excellent rendement énergétique.",
    features: ["Climatisation", "Système hybride", "Caméra de recul", "Bluetooth"],
  },
  // ... autres véhicules avec images multiples
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
    <Box sx={{ position: "relative", height: 400, overflow: "hidden", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <AnimatePresence>
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt="Vehicle"
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
            sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.5)", color: "white" }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.5)", color: "white" }}
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
          <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 500 }}>
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
    hover: { scale: 1.05, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={60} sx={{ color: "#ffd700" }} />
      </Box>
    );
  }

  if (error || !vehicle) {
    return (
      <Box sx={{ width: "100%", textAlign: "center", py: 8, minHeight: "100vh", bgcolor: "rgba(0,0,0,0.7)" }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#fff", opacity: 0.7 }} />
        <Typography variant="h5" sx={{ color: "#fff", mt: 2, opacity: 0.9 }}>
          {error || "Véhicule non trouvé"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/list-vehicule")}
          sx={{
            mt: 3,
            bgcolor: "#ffd700",
            color: "#0f172a",
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Retour à la Flotte
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
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
          opacity: 0.15,
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
              borderRadius: 4,
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
              bgcolor: "rgba(255, 255, 255, 0.95)",
              maxWidth: 1000,
              mx: "auto",
              overflow: "hidden",
            }}
          >
            <ImageCarousel images={vehicle.images} />
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "#0f172a", mb: 3, fontSize: { xs: "1.8rem", md: "2.5rem" } }}
              >
                {vehicle.brand} {vehicle.model}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Chip
                  icon={<DirectionsCarIcon />}
                  label={vehicle.type}
                  sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 600 }}
                />
                <Chip
                  icon={<EuroIcon />}
                  label={`${vehicle.price} €/jour`}
                  sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600 }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{ color: "#555", mb: 4, lineHeight: 1.8, fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                {vehicle.description}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#0f172a", mb: 3 }}>
                Caractéristiques
              </Typography>
              <FeaturesGrid features={vehicle.features} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/voitures/${vehicle.id}/reserver`)}
                    sx={{
                      bgcolor: "#ffd700",
                      color: "#0f172a",
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#ffca28" },
                    }}
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
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { borderColor: "#1565c0", bgcolor: "rgba(25, 118, 210, 0.04)" },
                    }}
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