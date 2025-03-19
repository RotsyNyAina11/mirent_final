import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Pour la navigation vers la page Facturation

const DevisForm = () => {
  const [devisList, setDevisList] = useState<any[]>([]); // Liste des devis
  const [devis, setDevis] = useState({
    ref: "",
    voiture: "",
    numeroVoiture: "",
    dateDepart: "",
    dateArrivee: "",
    nombreJours: 1,
    carburant: "",
    prixUnitaire: 0,
    prixTotal: 0,
  });

  const navigate = useNavigate(); // Utilisation de react-router-dom pour la navigation

  // Mise à jour des champs et calcul automatique du prix total
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newDevis = { ...devis, [name]: value };

    // Calcul automatique du prix total basé sur les jours et le prix unitaire
    if (name === "nombreJours" || name === "prixUnitaire") {
      newDevis.prixTotal =
        Number(newDevis.nombreJours) * Number(newDevis.prixUnitaire);
    }

    setDevis(newDevis);
  };

  // Fonction d'envoi du formulaire et ajout d'un devis à la liste
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ajouter le devis à la liste des devis
    setDevisList([...devisList, devis]);

    // Réinitialisation du formulaire
    setDevis({
      ref: "",
      voiture: "",
      numeroVoiture: "",
      dateDepart: "",
      dateArrivee: "",
      nombreJours: 1,
      carburant: "",
      prixUnitaire: 0,
      prixTotal: 0,
    });
  };

  // Fonction pour naviguer vers la page de facturation en passant la liste des devis
  const handleNavigateToFacturation = () => {
    navigate("/facturation", { state: { devisList } });
  };

  return (
    <Container maxWidth="md">
      {/* Formulaire pour ajouter un devis */}
      <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            <AddShoppingCart fontSize="large" sx={{ color: "#1976d2" }} /> Créer
            un Devis
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Référence"
                  name="ref"
                  value={devis.ref}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Voiture"
                  name="voiture"
                  value={devis.voiture}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Numéro Voiture"
                  name="numeroVoiture"
                  value={devis.numeroVoiture}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date de départ"
                  name="dateDepart"
                  value={devis.dateDepart}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date d'arrivée"
                  name="dateArrivee"
                  value={devis.dateArrivee}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Nombre de jours"
                  name="nombreJours"
                  value={devis.nombreJours}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Carburant"
                  name="carburant"
                  value={devis.carburant}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Prix Unitaire (€)"
                  name="prixUnitaire"
                  value={devis.prixUnitaire}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Prix Total (€)"
                  name="prixTotal"
                  variant="outlined"
                  value={devis.prixTotal}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Enregistrer le Devis
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Affichage des devis enregistrés */}
      {devisList.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ py: 1.5, mt: 2 }}
            onClick={handleNavigateToFacturation}
          >
            Aller à la Facturation
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default DevisForm;
