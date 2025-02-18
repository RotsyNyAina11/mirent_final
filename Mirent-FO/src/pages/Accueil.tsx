import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import { AccessTime, DirectionsCar, People, AttachMoney } from "@mui/icons-material";

// Styled components
const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
  background: "#f7fafc",
  padding: "3rem",
  textAlign: "center",
});

const DashboardCard = styled(Card)({
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)",
  },
});

const Accueil: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* Section de bienvenue */}
      <StyledBox>
        <Avatar
          sx={{
            width: 90,
            height: 90,
            bgcolor: theme.palette.primary.main,
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600 }}>
            A
          </Typography>
        </Avatar>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Bienvenue, Administrateur !
        </Typography>
        <Typography variant="subtitle1" paragraph sx={{ fontSize: "1.1rem" }}>
          Consultez les dernières statistiques et gérez votre entreprise depuis ce tableau de bord.
        </Typography>
      </StyledBox>

      {/* Section de tableau de bord */}
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Tableau de bord
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Carte Véhicules disponibles */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DirectionsCar sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Véhicules disponibles
                  </Typography>
                </Box>
                <Typography variant="h4" align="center" color="text.primary">
                  125
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          {/* Carte Locations en cours */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTime sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Locations en cours
                  </Typography>
                </Box>
                <Typography variant="h4" align="center" color="text.primary">
                  42
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          {/* Carte Nouveaux clients */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <People sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Nouveaux clients
                  </Typography>
                </Box>
                <Typography variant="h4" align="center" color="text.primary">
                  15
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>

          {/* Carte Revenus totaux */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AttachMoney sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Revenus totaux
                  </Typography>
                </Box>
                <Typography variant="h4" align="center" color="text.primary">
                  2 000 000 Ar
                </Typography>
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>

      {/* Actions rapides */}
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Actions rapides
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {/* Bouton 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              href="/vehicules"
              sx={{ height: "100%", py: 2, borderRadius: 5 }}
            >
              Gérer les véhicules
            </Button>
          </Grid>

          {/* Bouton 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              href="/clients"
              sx={{ height: "100%", py: 2, borderRadius: 5 }}
            >
              Gérer les clients
            </Button>
          </Grid>

          {/* Bouton 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              href="/reservations"
              sx={{ height: "100%", py: 2, borderRadius: 5 }}
            >
              Voir les réservations
            </Button>
          </Grid>

          {/* Bouton 4 */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              href="/ajouter-vehicule"
              sx={{ height: "100%", py: 2, borderRadius: 5 }}
            >
              Ajouter un véhicule
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Accueil;
