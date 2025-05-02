import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Reservation } from "../../../models/Reservation";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  createReservation,
  selectReservationsLoading,
  selectReservationsError,
} from "../../../redux/features/reservation/reservationSlice";

interface ReservationFormProps {}

const ReservationForm: React.FC<ReservationFormProps> = () => {
  // Initialisation correcte avec des valeurs par défaut appropriées
  const [formData, setFormData] = useState<Omit<Reservation, "id">>({
    dateDepart: "",
    dateRetour: "",
    nombreJours: 0, // Nombre au lieu de chaîne
    subTotal: 0, // Nombre au lieu de chaîne
    proformald: null,
    vehicleld: 0,
    regionld: 0,
    prixld: 0,
  });

  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectReservationsLoading);
  const error = useAppSelector(selectReservationsError);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;

    // Conversion des nombres si nécessaire
    const finalValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number | null>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Données soumises :", formData);
    dispatch(createReservation(formData));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Départ"
              type="date"
              name="dateDepart"
              value={formData.dateDepart || ""} // Gestion explicite des valeurs undefined
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Retour"
              type="date"
              name="dateRetour"
              value={formData.dateRetour || ""}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre de Jours"
              type="number"
              name="nombreJours"
              value={formData.nombreJours || 0}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sous-Total"
              type="number"
              name="subTotal"
              value={formData.subTotal || 0}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="proformald-label">Proforma ID</InputLabel>
              <Select
                labelId="proformald-label"
                name="proformald"
                value={formData.proformald || ""}
                onChange={handleSelectChange}
                label="Proforma ID"
              >
                <MenuItem value={""}>Aucune</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="vehicleld-label">Véhicule ID</InputLabel>
              <Select
                labelId="vehicleld-label"
                name="vehicleld"
                value={formData.vehicleld || ""}
                onChange={handleSelectChange}
                label="Véhicule ID"
              >
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={16}>16</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="regionld-label">Région ID</InputLabel>
              <Select
                labelId="regionld-label"
                name="regionld"
                value={formData.regionld || ""}
                onChange={handleSelectChange}
                label="Région ID"
              >
                <MenuItem value={1}>1</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="prixld-label">Prix ID</InputLabel>
              <Select
                labelId="prixld-label"
                name="prixld"
                value={formData.prixld || ""}
                onChange={handleSelectChange}
                label="Prix ID"
              >
                <MenuItem value={1}>1</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Créer
            </Button>
          </Grid>
        </Grid>
      </form>
      {loading && <div>Envoi des données...</div>}
      {error && <div>Erreur lors de la création : {error}</div>}
    </div>
  );
};

export default ReservationForm;
