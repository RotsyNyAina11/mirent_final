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
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Données fictives pour les voitures
const mockVehicles = [
  {
    id: 1,
    brand: "Toyota",
    model: "Corolla",
    price: 50,
    image: "/src/assets/2.jpg",
  },
  {
    id: 2,
    brand: "Honda",
    model: "Civic",
    price: 55,
    image: "/src/assets/2.jpg",
  },
  {
    id: 3,
    brand: "BMW",
    model: "Serie 3",
    price: 80,
    image: "/src/assets/2.jpg",
  },
  {
    id: 4,
    brand: "Mercedes",
    model: "Classe C",
    price: 90,
    image: "/src/assets/2.jpg",
  },
  {
    id: 5,
    brand: "Volkswagen",
    model: "Golf",
    price: 45,
    image: "/src/assets/2.jpg",
  },
  {
    id: 6,
    brand: "Audi",
    model: "A4",
    price: 85,
    image: "/src/assets/2.jpg",
  },
];

// Marques disponibles pour le filtre
const brands = ["Toutes", "Toyota", "Honda", "BMW", "Mercedes", "Volkswagen", "Audi"];

const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [brandFilter, setBrandFilter] = useState("Toutes");
  const [priceFilter, setPriceFilter] = useState("");
  const itemsPerPage = 6;

  // Filtrage des voitures
  const filteredVehicles = mockVehicles.filter((vehicle: { brand: string; price: number }) => {
    const matchesBrand = brandFilter === "Toutes" || vehicle.brand === brandFilter;
    const matchesPrice = priceFilter
      ? vehicle.price <= parseInt(priceFilter)
      : true;
    return matchesBrand && matchesPrice;
  });

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

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Container sx={{ p: 4, pt: 16, pb: 8 }}>
        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
            sx={{ color: "#0f172a", mb: 4 }}
          >
            Découvrez Nos Voitures
          </Typography>
        </motion.div>

        {/* Filtres */}
        <Box
          sx={{
            mb: 5,
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            alignItems: "center",
            background: "#ffffff",
            p: 2,
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FormControl sx={{ minWidth: 180, bgcolor: "#fff" }}>
            <InputLabel sx={{ fontWeight: 500 }}>Marque</InputLabel>
            <Select
              value={brandFilter}
              label="Marque"
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setPage(1);
              }}
              sx={{ borderRadius: 2 }}
            >
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
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
            sx={{ maxWidth: 180, bgcolor: "#fff" }}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Box>

        {/* Grille des voitures */}
        <Grid container spacing={4}>
          {paginatedVehicles.map((vehicle, index) => (
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
                    borderRadius: 3,
                    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.15)",
                    bgcolor: "#fff",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    sx={{ objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      fontWeight="bold"
                      sx={{ color: "#0f172a" }}
                    >
                      {vehicle.brand} {vehicle.model}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2e7d32", fontWeight: 500 }}>
                      {vehicle.price} €/jour
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button
                        size="medium"
                        variant="contained"
                        onClick={() => navigate(`/voitures/${vehicle.id}`)}
                        sx={{
                          bgcolor: "#1976d2",
                          color: "#fff",
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#1565c0" },
                        }}
                      >
                        Réserver
                      </Button>
                    </motion.div>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 500,
                    "&:hover": { bgcolor: "#e3f2fd" },
                    "&.Mui-selected": { bgcolor: "#1976d2", color: "#fff" },
                  },
                }}
              />
            </motion.div>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default VehiclesPage;