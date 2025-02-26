import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Grid } from "@mui/material";
import { Proforma } from "../types/Proforma";
import { useProformaStore } from "../redux/store";

const NewProforma: React.FC = () => {
  const { addProforma } = useProformaStore();
  const [form, setForm] = useState<Proforma>({
    ref: "",
    voiture: "",
    numeroVoiture: "",
    dateDepart: "",
    dateArrivee: "",
    nombreJours: 0,
    carburant: "",
    prixUnitaire: 0,
    prixTotal: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "nombreJours" || name === "prixUnitaire"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProforma = {
      ...form,
      prixTotal: form.nombreJours * form.prixUnitaire,
    };
    addProforma(newProforma);
    setForm({
      ref: "",
      voiture: "",
      numeroVoiture: "",
      dateDepart: "",
      dateArrivee: "",
      nombreJours: 0,
      carburant: "",
      prixUnitaire: 0,
      prixTotal: 0,
    });
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Créer un Nouveau Proforma
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Référence"
              name="ref"
              value={form.ref}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Voiture"
              name="voiture"
              value={form.voiture}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Numéro de voiture"
              name="numeroVoiture"
              value={form.numeroVoiture}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Date départ"
              name="dateDepart"
              value={form.dateDepart}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Date arrivée"
              name="dateArrivee"
              value={form.dateArrivee}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Nombre de jours"
              name="nombreJours"
              value={form.nombreJours}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Carburant"
              name="carburant"
              value={form.carburant}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Prix unitaire (Ar)"
              name="prixUnitaire"
              value={form.prixUnitaire}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Enregistrer
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default NewProforma;
