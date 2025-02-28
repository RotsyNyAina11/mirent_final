import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import { addQuote } from "../redux/slices/proformaSlice";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";

interface Quote {
  ref: string;
  voiture: string;
  numeroVoiture: string;
  dateDepart: string;
  dateArrivee: string;
  nombreJours: number;
  destination: string;
  carburant: string;
  prixUnitaire: number;
  prixTotal: number;
}

const ProformaForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook pour la navigation

  const [quote, setQuote] = useState<Quote>({
    ref: "",
    voiture: "",
    numeroVoiture: "",
    dateDepart: "",
    destination: "",
    dateArrivee: "",
    nombreJours: 0,
    carburant: "",
    prixUnitaire: 0,
    prixTotal: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuote({ ...quote, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addQuote(quote)); // Ajouter le devis
    navigate("/tableau_proforma"); // Rediriger vers la page QuoteTable
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ajouter un devis
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {["ref", "voiture", "numeroVoiture", "carburant"].map((field) => (
            <Grid item xs={6} key={field}>
              <TextField
                fullWidth
                label={field}
                name={field}
                value={quote[field as keyof Quote]}
                onChange={handleChange}
                required
              />
            </Grid>
          ))}
          {["dateDepart", "dateArrivee"].map((field) => (
            <Grid item xs={6} key={field}>
              <TextField
                fullWidth
                type="date"
                name={field}
                value={quote[field as keyof Quote]}
                onChange={handleChange}
                required
              />
            </Grid>
          ))}
          {["nombreJours", "prixUnitaire", "prixTotal"].map((field) => (
            <Grid item xs={4} key={field}>
              <TextField
                fullWidth
                type="number"
                label={field}
                name={field}
                value={quote[field as keyof Quote]}
                onChange={handleChange}
                required
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProformaForm;
