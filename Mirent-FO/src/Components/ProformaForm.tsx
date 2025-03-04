import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addQuote } from "../redux/slices/proformaSlice";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";

interface Quote {
  ref: string;
  voiture: string;
  numeroVoiture: string;
  destination: string;
  dateDepart: string;
  dateArrivee: string;
  nombreJours: number;
  carburant: number;
  prixUnitaire: number;
  prixTotal: number;
}

const ProformaForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quote, setQuote] = useState<Quote>({
    ref: "",
    voiture: "",
    numeroVoiture: "",
    destination: "",
    dateDepart: "",
    dateArrivee: "",
    nombreJours: 0,
    carburant: 0,
    prixUnitaire: 0,
    prixTotal: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setQuote((prevQuote) => ({
      ...prevQuote,
      [name]: [
        "nombreJours",
        "carburant",
        "prixUnitaire",
        "prixTotal",
      ].includes(name)
        ? value
          ? Number(value)
          : 0
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Quote à envoyer :", quote);

    if (Object.values(quote).some((value) => value === "" || value === 0)) {
      alert("Veuillez remplir tous les champs correctement !");
      return;
    }

    dispatch(addQuote(quote));
    navigate("/tableau_proforma");
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ajouter un devis
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Référence"
              name="ref"
              value={quote.ref}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Voiture"
              name="voiture"
              value={quote.voiture}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Numéro de voiture"
              name="numeroVoiture"
              value={quote.numeroVoiture}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Destination"
              name="destination"
              value={quote.destination}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Date de départ"
              name="dateDepart"
              value={quote.dateDepart}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Date d'arrivée"
              name="dateArrivee"
              value={quote.dateArrivee}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Nombre de jours"
              name="nombreJours"
              value={quote.nombreJours}
              onChange={handleChange}
              required
              inputProps={{ min: 1 }} // Ensuring at least 1 day
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Carburant"
              name="carburant"
              value={quote.carburant}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }} // Ensure non-negative value
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Prix unitaire"
              name="prixUnitaire"
              value={quote.prixUnitaire}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }} // Ensure non-negative value
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Prix total"
              name="prixTotal"
              value={quote.prixTotal}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }} // Ensure non-negative value
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" type="submit">
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProformaForm;
