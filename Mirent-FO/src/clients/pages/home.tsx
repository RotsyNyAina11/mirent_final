import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
  } from "@mui/material";
  import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import MenuIcon from "@mui/icons-material/Menu";
  import { useNavigate } from "react-router-dom";
  import image from "../../assets/1.jpg"; 
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

  
  const ClientHome = () => {
    const navigate = useNavigate();
  
    return (
      <Box>
        <Navbar />
        <Box
          sx={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pt: 10,
          }}
          id="hero"
        >
          <Container>
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
              Une large sélection de véhicules disponibles partout à Madagascar.
            </Typography>
            <Button
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
              sx={{ color: "#f3f4f6", fontSize: { xs: "2rem", md: "2.75rem" }, mb: 4 }}
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
  
        {/* VÉHICULES POPULAIRES */}
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
              Véhicules Populaires
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
                        Confortable, économique et parfaite pour les routes malgaches.
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
              Profitez d’un service rapide, fiable et abordable. Réservez dès maintenant !
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/catalogue")}
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
  
        {/* FOOTER */}
        <Footer />
      </Box>
    );
  };
  
  export default ClientHome;
  