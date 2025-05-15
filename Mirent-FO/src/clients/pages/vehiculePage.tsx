import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Skeleton,
  TextField,
  Typography,
  IconButton,
  Select,
  Popover,
  Chip,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EuroIcon from "@mui/icons-material/Euro";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import image from "/src/assets/bg.jpeg";

// Données fictives pour les voitures
const mockVehicles = [
  {
    id: 1,
    brand: "Toyota",
    model: "Corolla",
    price: 50,
    type: "Berline",
    image: "/src/assets/1.jpg",
    description: "La Toyota Corolla est une berline fiable et économique, parfaite pour les trajets urbains et les longues distances. Équipée d'un moteur hybride, elle offre un excellent rendement énergétique.",
    features: ["Climatisation", "Système hybride", "Caméra de recul", "Bluetooth"],
  },
  {
    id: 2,
    brand: "Honda",
    model: "Civic",
    price: 55,
    type: "Berline",
    image: "/src/assets/1.jpg",
    description: "La Honda Civic combine style et performance avec une conduite dynamique. Idéale pour ceux qui recherchent confort et technologie.",
    features: ["Écran tactile", "Régulateur de vitesse", "Sièges chauffants", "Aide au stationnement"],
  },
  {
    id: 3,
    brand: "BMW",
    model: "Serie 3",
    price: 80,
    type: "Berline",
    image: "/src/assets/1.jpg",
    description: "La BMW Série 3 offre une expérience de conduite premium avec des finitions haut de gamme et des technologies avancées.",
    features: ["Suspension adaptative", "Toit ouvrant", "Système de navigation", "Intérieur cuir"],
  },
  {
    id: 4,
    brand: "Mercedes",
    model: "Classe C",
    price: 90,
    type: "Berline",
    image: "/src/assets/1.jpg",
    description: "La Mercedes Classe C est synonyme de luxe et de confort, avec des équipements de pointe et une conduite fluide.",
    features: ["Sièges électriques", "Éclairage d'ambiance", "Assistance à la conduite", "Son premium"],
  },
  {
    id: 5,
    brand: "Volkswagen",
    model: "Tiguan",
    price: 65,
    type: "SUV",
    image: "/src/assets/1.jpg",
    description: "Le Volkswagen Tiguan est un SUV polyvalent, idéal pour les familles et les aventures en plein air, avec un espace généreux.",
    features: ["4x4", "Coffre spacieux", "Écran multifonction", "Démarrage sans clé"],
  },
  {
    id: 6,
    brand: "Audi",
    model: "Q5",
    price: 85,
    type: "SUV",
    image: "/src/assets/1.jpg",
    description: "L'Audi Q5 allie élégance et robustesse, avec des performances tout-terrain et un intérieur raffiné.",
    features: ["Quattro 4x4", "Toit panoramique", "Volant multifonction", "Écran tête haute"],
  },
];

// Marques et types disponibles pour les filtres
const brands = ["Toutes", "Toyota", "Honda", "BMW", "Mercedes", "Volkswagen", "Audi"];
const types = ["Tous", "Berline", "SUV", "Coupé", "Cabriolet"];

// Composant VehicleDetails pour le popover
const VehicleDetails: React.FC<{ vehicle: typeof mockVehicles[0] | null; onClose: () => void }> = ({ vehicle, onClose }) => {
  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.9 },
  };

  if (!vehicle) {
    return (
      <Box sx={{ p: 4, bgcolor: "#fff", borderRadius: 4, textAlign: "center" }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "#0f172a", mb: 2 }}>
          Véhicule non trouvé
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: "#ffd700",
            color: "#0f172a",
            borderRadius: 3,
            px: 4,
            py: 1,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { bgcolor: "#ffca28" },
          }}
        >
          Fermer
        </Button>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ maxWidth: 500, borderRadius: 4, boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)", bgcolor: "#fff" }}>
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(255, 255, 255, 0.8)" }}
          >
            <CloseIcon />
          </IconButton>
          <CardMedia
            component="img"
            height="200"
            image={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            sx={{ objectFit: "cover", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          />
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#0f172a", mb: 2 }}>
            {vehicle.brand} {vehicle.model}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip
              icon={<DirectionsCarIcon />}
              label={vehicle.type}
              sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 600 }}
            />
            <Chip
              icon={<EuroIcon />}
              label={`${vehicle.price} €/jour`}
              sx={{ bgcolor: "#fff3e0", color: "#ffd700", fontWeight: 600 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#555", mb: 2, lineHeight: 1.6 }}>
            {vehicle.description}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#0f172a", mb: 1 }}>
            Caractéristiques
          </Typography>
          <Grid container spacing={1}>
            {vehicle.features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 500 }}>
                  • {feature}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
        <CardActions sx={{ p: 3, pt: 0, display: "flex", gap: 2 }}>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="contained"
              sx={{
                bgcolor: "#ffd700",
                color: "#0f172a",
                borderRadius: 3,
                px: 3,
                py: 1,
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
              onClick={onClose}
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { borderColor: "#1565c0", bgcolor: "rgba(25, 118, 210, 0.04)" },
              }}
            >
              Fermer
            </Button>
          </motion.div>
        </CardActions>
      </Card>
    </motion.div>
  );
};

const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [brandFilter, setBrandFilter] = useState("Toutes");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [priceFilter, setPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const itemsPerPage = 6;

  // Simuler un chargement
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Filtrage des voitures
  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesBrand = brandFilter === "Toutes" || vehicle.brand === brandFilter;
    const matchesType = typeFilter === "Tous" || vehicle.type === typeFilter;
    const matchesPrice = priceFilter ? vehicle.price <= parseInt(priceFilter) : true;
    const matchesSearch = searchQuery
      ? vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesBrand && matchesType && matchesPrice && matchesSearch;
  });

  // Réinitialiser les filtres
  const resetFilters = () => {
    setBrandFilter("Toutes");
    setTypeFilter("Tous");
    setPriceFilter("");
    setSearchQuery("");
    setPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Animations
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.9 },
  };

  // Parallax effect for background
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  // Gestion du popover
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, vehicleId: number) => {
    setPopoverAnchor(event.currentTarget);
    setSelectedVehicleId(vehicleId);
  };

  const handleClosePopover = () => {
    setPopoverAnchor(null);
    setSelectedVehicleId(null);
  };

  const selectedVehicle = mockVehicles.find((v) => v.id === selectedVehicleId) || null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
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
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          zIndex: 0,
          y,
        }}
      />
      <Navbar />
      <Container
        sx={{
          p: 4,
          pt: 15,
          pb: 8,
          position: "relative",
          zIndex: 1,
          transition: "filter 0.3s",
          ...(popoverAnchor && { filter: "blur(3px) brightness(0.7)" }), // Effet de flou et assombrissement
        }}
      >
        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
            sx={{
              color: "#ffffff",
              mb: 5,
              textShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Découvrez Notre Flotte
          </Typography>
        </motion.div>

        {/* Filtres */}
        <Box
          sx={{
            mb: 6,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.97)",
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TextField
            label="Rechercher (marque, modèle)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: { xs: 120, sm: 200 }, bgcolor: "#fff", "&:hover": { bgcolor: "#f5f5f5" } }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "#1976d2" }} />,
              sx: { borderRadius: 2, py: 0.5 },
            }}
          />
          <FormControl sx={{ minWidth: { xs: 120, sm: 190 }, bgcolor: "#fff", borderRadius: 2, "&:hover": { bgcolor: "#f5f5f5" } }}>
            <InputLabel sx={{ fontWeight: 500, color: "#1976d2" }}>Marque</InputLabel>
            <Select
              value={brandFilter}
              label="Marque"
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setPage(1);
              }}
              startAdornment={<DirectionsCarIcon sx={{ mr: 1, color: "#1976d2" }} />}
              sx={{ borderRadius: 2, "& .MuiSelect-select": { py: 1.5 } }}
            >
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: { xs: 120, sm: 160 }, bgcolor: "#fff", borderRadius: 2, "&:hover": { bgcolor: "#f5f5f5" } }}>
            <InputLabel sx={{ fontWeight: 500, color: "#1976d2" }}>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              startAdornment={<DirectionsCarIcon sx={{ mr: 1, color: "#1976d2" }} />}
              sx={{ borderRadius: 2, "& .MuiSelect-select": { py: 1.5 } }}
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Prix max (€/jour)"
            type="number"
            value={priceFilter}
            onChange={(e) => {
              setPriceFilter(e.target.value);
              setPage(1);
            }}
            sx={{ maxWidth: { xs: 120, sm: 160 }, bgcolor: "#fff", "&:hover": { bgcolor: "#f5f5f5" } }}
            InputProps={{
              startAdornment: <EuroIcon sx={{ mr: 1, color: "#1976d2" }} />,
              sx: { borderRadius: 2, py: 0.5 },
            }}
          />
          <IconButton
            onClick={resetFilters}
            aria-label="Réinitialiser les filtres"
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              "&:hover": { bgcolor: "#f5f5f5" },
              p: 1,
            }}
          >
            <RestartAltIcon sx={{ color: "#d32f2f", fontSize: "1.8rem" }} />
          </IconButton>
        </Box>

        {/* Grille des voitures */}
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {isLoading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={220}
                    sx={{ borderRadius: 3 }}
                    animation="wave"
                  />
                  <Skeleton variant="text" width="60%" sx={{ mt: 2 }} animation="wave" />
                  <Skeleton variant="text" width="40%" animation="wave" />
                  <Skeleton
                    variant="rectangular"
                    width="100px"
                    height={36}
                    sx={{ mt: 2, borderRadius: 2 }}
                    animation="wave"
                  />
                </Grid>
              ))
            : paginatedVehicles.length > 0
            ? paginatedVehicles.map((vehicle, index) => (
                <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                  <motion.div
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 4,
                        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
                        bgcolor: "#fff",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0px 10px 28px rgba(0, 0, 0, 0.25)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="220"
                        image={vehicle.image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        sx={{ objectFit: "cover", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          fontWeight="bold"
                          sx={{ color: "#0f172a", fontSize: "1.25rem" }}
                        >
                          {vehicle.brand} {vehicle.model}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555", mb: 1.5 }}>
                          {vehicle.type}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <EuroIcon sx={{ color: "#ffd700", fontSize: "1.2rem" }} />
                          <Typography variant="body1" sx={{ color: "#ffd700", fontWeight: 600 }}>
                            {vehicle.price} €/jour
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 3, pt: 0, display: "flex", gap: 2 }}>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <Button
                            size="medium"
                            variant="contained"
                            onClick={() => navigate(`/voitures/${vehicle.id}`)}
                            sx={{
                              bgcolor: "#ffd700",
                              color: "#0f172a",
                              borderRadius: 3,
                              px: 3,
                              py: 1,
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
                            size="medium"
                            variant="outlined"
                            onClick={(e) => handleOpenPopover(e, vehicle.id)}
                            sx={{
                              borderColor: "#1976d2",
                              color: "#1976d2",
                              borderRadius: 3,
                              px: 2,
                              py: 1,
                              fontWeight: 600,
                              textTransform: "none",
                              "&:hover": { borderColor: "#1565c0", bgcolor: "rgba(25, 118, 210, 0.04)" },
                            }}
                            startIcon={<InfoIcon />}
                          >
                            Détails
                          </Button>
                        </motion.div>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            : (
                <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
                  <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#fff", opacity: 0.7 }} />
                  <Typography variant="h5" sx={{ color: "#fff", mt: 2, opacity: 0.9 }}>
                    Aucune voiture trouvée
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#fff", mt: 1, opacity: 0.7 }}>
                    Modifiez vos filtres ou réinitialisez-les pour voir plus de résultats.
                  </Typography>
                </Box>
              )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.25)" },
                    "&.Mui-selected": { bgcolor: "#ffd700", color: "#0f172a" },
                  },
                }}
              />
            </motion.div>
          </Box>
        )}

        {/* Popover pour les détails */}
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          sx={{
            "& .MuiPopover-paper": {
              borderRadius: 4,
              overflow: "visible",
            },
          }}
        >
          <VehicleDetails vehicle={selectedVehicle} onClose={handleClosePopover} />
        </Popover>
      </Container>
    </Box>
  );
};

export default VehiclesPage;