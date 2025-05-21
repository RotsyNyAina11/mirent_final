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
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BuildIcon from "@mui/icons-material/Build";
import image from "/src/assets/bg.jpeg";
import { Vehicle, fetchVehicles, fetchVehicleTypes, fetchVehicleStatuses } from "../../redux/features/vehicle/vehiclesSlice";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks";

// Composant VehicleDetails
const VehicleDetails: React.FC<{ vehicle: Vehicle | null; onClose: () => void }> = ({ vehicle, onClose }) => {
  const navigate = useNavigate();
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)" },
    tap: { scale: 0.95 },
  };

  if (!vehicle) {
    return (
      <Box sx={{ p: 4, bgcolor: "#fff", borderRadius: 8, textAlign: "center" }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "#0f172a", mb: 2, fontFamily: "'Inter', sans-serif" }}>
          Véhicule non trouvé
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
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
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        sx={{
          maxWidth: 500,
          borderRadius: 8,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
          bgcolor: "linear-gradient(145deg, #ffffff, #f9f9f9)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(255, 255, 255, 0.9)", "&:hover": { bgcolor: "#fff" } }}
            aria-label="Fermer le popover"
          >
            <CloseIcon sx={{ color: "#0f172a" }} />
          </IconButton>
          <CardMedia
            component="img"
            height="200"
            image={vehicle.imageUrl || "https://via.placeholder.com/500x200?text=Image+Indisponible"}
            alt={`${vehicle.marque} ${vehicle.modele}`}
            sx={{ objectFit: "cover", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          />
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#0f172a", mb: 2, fontFamily: "'Inter', sans-serif", fontSize: "1.5rem" }}
          >
            {vehicle.marque} {vehicle.modele}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip
              icon={<DirectionsCarIcon />}
              label={vehicle.type.type}
              sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
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
              sx={{
                bgcolor: vehicle.status.status === "Disponible" ? "#e8f5e9" : vehicle.status.status === "Réservé" ? "#fff3e0" : "#ffebee",
                color: vehicle.status.status === "Disponible" ? "#2e7d32" : vehicle.status.status === "Réservé" ? "#ff9800" : "#d32f2f",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "#475569", mb: 2, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}
          >
            Immatriculation: {vehicle.immatriculation}
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "#0f172a", mb: 1.5, fontFamily: "'Inter', sans-serif" }}
          >
            Nombre de places
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#1976d2", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}
          >
            {vehicle.nombrePlace} places
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 3, pt: 0, display: "flex", gap: 2, justifyContent: "center" }}>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="contained"
              onClick={() => navigate(`/voitures/${vehicle.id}/reserver`)}
              disabled={vehicle.status.status !== "Disponible"}
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
              aria-label={`Réserver ${vehicle.marque} ${vehicle.modele}`}
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
                borderRadius: 8,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontFamily: "'Inter', sans-serif",
                "&:hover": { borderColor: "#1565c0", bgcolor: "rgba(25, 118, 210, 0.08)" },
              }}
              aria-label="Fermer les détails"
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
  const dispatch = useAppDispatch();
  const {
    vehicles,
    vehiclesLoading,
    vehiclesError,
    vehiclesType,
    vehiclesTypeLoading,
    vehiclesTypeError,
    vehiclesStatus,
    vehiclesStatusLoading,
    vehiclesStatusError,
  } = useSelector((state: RootState) => state.vehicles);

  const [page, setPage] = useState(1);
  const [brandFilter, setBrandFilter] = useState("Toutes");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const itemsPerPage = 6;

  // Charger les données au montage du composant
  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchVehicleTypes());
    dispatch(fetchVehicleStatuses());
  }, [dispatch]);

  // Filtres dynamiques à partir des données Redux
  const brands = ["Toutes", ...new Set(vehicles.map((v) => v.marque))];
  const types = ["Tous", ...vehiclesType.map((t) => t.type)];
  const statuses = ["Tous", ...vehiclesStatus.map((s) => s.status)];

  // Filtrage des véhicules
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesBrand = brandFilter === "Toutes" || vehicle.marque === brandFilter;
    const matchesType = typeFilter === "Tous" || vehicle.type.type === typeFilter;
    const matchesStatus = statusFilter === "Tous" || vehicle.status.status === statusFilter;
    const matchesSearch = searchQuery
      ? vehicle.marque.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.modele.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.immatriculation.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesBrand && matchesType && matchesStatus && matchesSearch;
  });

  // Réinitialiser les filtres
  const resetFilters = () => {
    setBrandFilter("Toutes");
    setTypeFilter("Tous");
    setStatusFilter("Tous");
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
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)" },
    tap: { scale: 0.95 },
  };

  // Parallax effect for background
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 250]);

  // Gestion du popover
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, vehicleId: number) => {
    setPopoverAnchor(event.currentTarget);
    setSelectedVehicleId(vehicleId);
  };

  const handleClosePopover = () => {
    setPopoverAnchor(null);
    setSelectedVehicleId(null);
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || null;

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
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
          zIndex: 0,
          y,
        }}
      />
      <Navbar />
      <Container
        sx={{
          p: { xs: 3, md: 4 },
          pt: { xs: 12, md: 16 },
          pb: 8,
          position: "relative",
          zIndex: 1,
          transition: "filter 0.3s ease",
          ...(popoverAnchor && { filter: "blur(4px) brightness(0.6)" }),
        }}
      >
        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Typography
            variant="h2"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
            sx={{
              color: "#ffffff",
              mb: 6,
              textShadow: "0px 3px 8px rgba(0, 0, 0, 0.4)",
              fontSize: { xs: "2.8rem", md: "4rem" },
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Explorez Notre Flotte
          </Typography>
        </motion.div>

        {/* Affichage des erreurs */}
        {(vehiclesError || vehiclesTypeError || vehiclesStatusError) && (
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography color="error" sx={{ fontFamily: "'Inter', sans-serif" }}>
              Erreur : {vehiclesError || vehiclesTypeError || vehiclesStatusError}
            </Typography>
          </Box>
        )}

        {/* Filtres */}
        <Box
          sx={{
            mb: 6,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.95)",
            p: { xs: 2, md: 2.5 },
            borderRadius: 12,
            boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <TextField
            label="Rechercher (marque, modèle, immatriculation)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            sx={{
              minWidth: { xs: 140, sm: 220 },
              bgcolor: "#fff",
              borderRadius: 8,
              "&:hover": { bgcolor: "#f8fafc" },
              "& .MuiInputBase-root": { fontFamily: "'Inter', sans-serif" },
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "#1976d2" }} />,
              sx: { borderRadius: 8, py: 0.5 },
            }}
            InputLabelProps={{ sx: { fontFamily: "'Inter', sans-serif" } }}
            aria-label="Rechercher une voiture par marque, modèle ou immatriculation"
          />
          <FormControl
            sx={{
              minWidth: { xs: 140, sm: 200 },
              bgcolor: "#fff",
              borderRadius: 8,
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            <InputLabel sx={{ fontWeight: 500, color: "#1976d2", fontFamily: "'Inter', sans-serif" }}>
              Marque
            </InputLabel>
            <Select
              value={brandFilter}
              label="Marque"
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setPage(1);
              }}
              startAdornment={<DirectionsCarIcon sx={{ mr: 1, color: "#1976d2" }} />}
              sx={{
                borderRadius: 8,
                "& .MuiSelect-select": { py: 1.5, fontFamily: "'Inter', sans-serif" },
              }}
              aria-label="Filtrer par marque"
            >
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              minWidth: { xs: 140, sm: 180 },
              bgcolor: "#fff",
              borderRadius: 8,
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            <InputLabel sx={{ fontWeight: 500, color: "#1976d2", fontFamily: "'Inter', sans-serif" }}>
              Type
            </InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              startAdornment={<DirectionsCarIcon sx={{ mr: 1, color: "#1976d2" }} />}
              sx={{
                borderRadius: 8,
                "& .MuiSelect-select": { py: 1.5, fontFamily: "'Inter', sans-serif" },
              }}
              aria-label="Filtrer par type"
            >
              {types.map((type) => (
                <MenuItem key={type} value={type} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              minWidth: { xs: 140, sm: 180 },
              bgcolor: "#fff",
              borderRadius: 8,
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            <InputLabel sx={{ fontWeight: 500, color: "#1976d2", fontFamily: "'Inter', sans-serif" }}>
              Statut
            </InputLabel>
            <Select
              value={statusFilter}
              label="Statut"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              sx={{
                borderRadius: 8,
                "& .MuiSelect-select": { py: 1.5, fontFamily: "'Inter', sans-serif" },
              }}
              aria-label="Filtrer par statut"
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={resetFilters}
            startIcon={<RestartAltIcon />}
            sx={{
              bgcolor: "#fff",
              color: "#d32f2f",
              borderRadius: 8,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              "&:hover": { bgcolor: "#f8fafc", color: "#b71c1c" },
            }}
            aria-label="Réinitialiser tous les filtres"
          >
            Réinitialiser
          </Button>
        </Box>

        {/* Grille des voitures */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {(vehiclesLoading || vehiclesTypeLoading || vehiclesStatusLoading)
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={240}
                    sx={{ borderRadius: 8 }}
                    animation="wave"
                  />
                  <Skeleton variant="text" width="60%" sx={{ mt: 2 }} animation="wave" />
                  <Skeleton variant="text" width="40%" animation="wave" />
                  <Skeleton
                    variant="rectangular"
                    width="120px"
                    height={40}
                    sx={{ mt: 2, borderRadius: 8 }}
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
                        borderRadius: 8,
                        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
                        bgcolor: "linear-gradient(145deg, #ffffff, #f9f9f9)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-10px)",
                          boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.25)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="240"
                        image={vehicle.imageUrl || "https://via.placeholder.com/500x240?text=Image+Indisponible"}
                        alt={`${vehicle.marque} ${vehicle.modele}`}
                        sx={{ objectFit: "cover", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          fontWeight="bold"
                          sx={{
                            color: "#0f172a",
                            fontSize: "1.3rem",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {vehicle.marque} {vehicle.modele}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#475569",
                            mb: 1.5,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {vehicle.type.type}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {vehicle.status.status === "Disponible" ? (
                            <CheckCircleIcon sx={{ color: "#2e7d32", fontSize: "1.2rem" }} />
                          ) : vehicle.status.status === "Réservé" ? (
                            <CancelIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
                          ) : (
                            <BuildIcon sx={{ color: "#d32f2f", fontSize: "1.2rem" }} />
                          )}
                          <Typography
                            variant="body1"
                            sx={{
                              color:
                                vehicle.status.status === "Disponible"
                                  ? "#2e7d32"
                                  : vehicle.status.status === "Réservé"
                                  ? "#ff9800"
                                  : "#d32f2f",
                              fontWeight: 600,
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {vehicle.status.status}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 3, pt: 0, display: "flex", gap: 2, justifyContent: "center" }}>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <Button
                            size="medium"
                            variant="contained"
                            onClick={() => navigate(`/voitures/${vehicle.id}/reserver`)}
                            disabled={vehicle.status.status !== "Disponible"}
                            sx={{
                              bgcolor: "#ff6f61",
                              color: "#fff",
                              borderRadius: 8,
                              px: 3,
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: "none",
                              fontFamily: "'Inter', sans-serif",
                              "&:hover": { bgcolor: "#ff4d40" },
                              "&:disabled": { bgcolor: "#bdbdbd", color: "#fff" },
                            }}
                            aria-label={`Réserver ${vehicle.marque} ${vehicle.modele}`}
                          >
                            Réserver
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
                              borderRadius: 8,
                              px: 3,
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: "none",
                              fontFamily: "'Inter', sans-serif",
                              "&:hover": { borderColor: "#1565c0", bgcolor: "rgba(25, 118, 210, 0.08)" },
                            }}
                            startIcon={<InfoIcon />}
                            aria-label={`Voir les détails de ${vehicle.marque} ${vehicle.modele}`}
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
                <Box sx={{ width: "100%", textAlign: "center", py: 10 }}>
                  <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#fff", opacity: 0.7 }} />
                  <Typography
                    variant="h5"
                    sx={{ color: "#fff", mt: 2, opacity: 0.9, fontFamily: "'Inter', sans-serif" }}
                  >
                    Aucune voiture trouvée
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#fff", mt: 1, opacity: 0.7, fontFamily: "'Inter', sans-serif" }}
                  >
                    Modifiez vos filtres ou réinitialisez-les pour voir plus de résultats.
                  </Typography>
                </Box>
              )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && !vehiclesLoading && (
          <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
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
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 8,
                    fontFamily: "'Inter', sans-serif",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                    "&.Mui-selected": { bgcolor: "#ff6f61", color: "#fff" },
                  },
                }}
                aria-label="Navigation entre les pages des véhicules"
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
              borderRadius: 8,
              overflow: "visible",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
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