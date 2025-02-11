import React from "react";
import { Container, Typography, Button, Grid } from "@mui/material"; // Utilisation de Material UI
import { useNavigate } from "react-router-dom"; // Pour la navigation

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      {/* Section Hero */}
      <Grid
        container
        spacing={4}
        alignItems="center"
        style={{ marginTop: "2rem" }}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenue sur notre service de location de véhicules
          </Typography>
          <Typography variant="body1" gutterBottom>
            Trouvez le véhicule parfait pour vos besoins, que ce soit pour un
            voyage ou une utilisation quotidienne.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/search")} // Redirection vers la page de recherche
          >
            Trouver un véhicule
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src="/assets/car-hero.jpg" // Image illustrative
            alt="Voiture de location"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Grid>
      </Grid>

      {/* Section Témoignages */}
      <section style={{ marginTop: "4rem" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Témoignages de nos clients
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" gutterBottom>
              "Service exceptionnel ! Les véhicules sont toujours en parfait
              état."
            </Typography>
            <Typography variant="subtitle2">- Jean D.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" gutterBottom>
              "Très facile à utiliser, je recommande vivement !"
            </Typography>
            <Typography variant="subtitle2">- Marie L.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1" gutterBottom>
              "Prix compétitifs et large choix de véhicules."
            </Typography>
            <Typography variant="subtitle2">- Pierre T.</Typography>
          </Grid>
        </Grid>
      </section>
    </Container>
  );
};

export default HomePage;
