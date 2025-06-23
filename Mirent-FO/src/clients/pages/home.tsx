import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import image from "../../assets/bg.jpeg";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import ReservationForm from "../Components/ReservationForm";
import Footer from "../Components/Footer";

const ClientHome = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <Box sx={{ pb: 8, pt: { xs: 10, md: 12 } }}>
      <Navbar />

      {/* HERO */}
      <Box
        sx={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 10,
        }}
        id="hero"
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            {!showForm && (
              <Grid item xs={12}>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      color: "white",
                      mb: 3,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                    }}
                  >
                    Réservez votre voiture en quelques clics
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      mb: 4,
                      textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
                    }}
                  >
                    Une large sélection de véhicules disponibles partout à
                    Madagascar.
                  </Typography>
                  <Button
                    onClick={() => setShowForm(true)}
                    sx={{
                      bgcolor: "#3b82f6",
                      color: "white",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#2563eb",
                      },
                    }}
                  >
                    Réserver Maintenant
                  </Button>
                </Box>
              </Grid>
            )}

            {showForm && (
              <Grid item xs={12} md={8} lg={6} sx={{ mx: "auto" }}>
                <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Paper
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.98)",
                      p: { xs: 3, sm: 4 },
                      borderRadius: 4,
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                      position: "relative",
                      maxWidth: 700,
                      mx: "auto",
                      maxHeight: "80vh",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#3b82f6",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    <IconButton
                      onClick={() => setShowForm(false)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#0f172a",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>

                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{
                        mb: 3,
                        color: "#0f172a",
                        textAlign: "center",
                      }}
                    >
                      Formulaire de Réservation
                    </Typography>

                    <ReservationForm onClose={() => setShowForm(false)} />

                    <Box display="flex" justifyContent="center" mt={3}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setShowForm(false)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          px: 4,
                          py: 1,
                        }}
                      >
                        Annuler
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* AVANTAGES */}
      <Box sx={{ bgcolor: "#0f172a", py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight="bold"
            align="center"
            gutterBottom
            sx={{
              color: "#f3f4f6",
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 4,
            }}
          >
            Nos Avantages
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
                title: "Véhicules récents",
                desc: "Tous nos véhicules sont bien entretenus et récents.",
              },
              {
                icon: <ExpandMoreIcon sx={{ fontSize: 40 }} />,
                title: "Prix abordables",
                desc: "Des tarifs compétitifs pour tous les budgets.",
              },
              {
                icon: <MenuIcon sx={{ fontSize: 40 }} />,
                title: "Assistance 24/7",
                desc: "Nous sommes là pour vous à toute heure.",
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    bgcolor: "#1e293b",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ color: "#3b82f6", mb: 2 }}>{item.icon}</Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "#f3f4f6" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#d1d5db" }}>{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/*Nos VÉHICULES */}
      <Box sx={{ py: 10, bgcolor: "#0f172a" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight="bold"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 6,
              color: "#f3f4f6",
            }}
          >
            Nos Véhicules
          </Typography>
          <Grid container spacing={4}>
            {[1, 2, 3].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#1e293b",
                  }}
                >
                  <img
                    src={image}
                    alt="voiture populaire"
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: "#f3f4f6" }}>
                      Toyota RAV4
                    </Typography>
                    <Typography variant="body2" color="#d1d5db">
                      Confortable, économique et parfaite pour les routes
                      malgaches.
                    </Typography>
                    <Button
                      onClick={() => navigate("/catalogue")}
                      sx={{
                        mt: 2,
                        textTransform: "none",
                        bgcolor: "#3b82f6",
                        color: "#fff",
                        "&:hover": { bgcolor: "#2563eb" },
                      }}
                    >
                      Voir Détails
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA FINAL */}
      <Box
        sx={{
          bgcolor: "#3b82f6",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Prêt à réserver votre prochaine voiture ?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Profitez d’un service rapide, fiable et abordable. Réservez dès
            maintenant !
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/list-vehicule")}
            sx={{
              bgcolor: "#0f172a",
              color: "white",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": { bgcolor: "#1e293b" },
            }}
          >
            Réserver un véhicule
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default ClientHome;
