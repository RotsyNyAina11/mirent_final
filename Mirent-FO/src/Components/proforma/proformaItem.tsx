import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Box,
  TextField,
} from "@mui/material";

const ProformaItemForm = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [prixList, setPrixList] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<number | string>("");
  const [selectedRegion, setSelectedRegion] = useState<number | string>("");
  const [selectedPrix, setSelectedPrix] = useState<number | string>("");

  // Charger les véhicules, régions et prix
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Appel pour récupérer les véhicules
        const vehiclesResponse = await axios.get(
          "http://localhost:3000/proforma/vehicule"
        );
        setVehicles(vehiclesResponse.data);

        // Appel pour récupérer les régions
        const regionsResponse = await axios.get(
          "http://localhost:3000/proforma/region"
        );
        setRegions(regionsResponse.data);

        // Appel pour récupérer les prix
        const prixResponse = await axios.get(
          "http://localhost:3000/proforma/prix"
        );
        setPrixList(prixResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Traiter l'envoi des données au back-end
    const formData = {
      vehicleId: selectedVehicle,
      regionId: selectedRegion,
      prixId: selectedPrix,
      // Ajoute d'autres champs nécessaires, comme les dates, etc.
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/proforma",
        formData
      );
      console.log("Proforma Item créé avec succès:", response.data);
    } catch (error) {
      console.error("Erreur lors de la création du Proforma Item:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Véhicule</InputLabel>
            <Select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              label="Véhicule"
              required
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.marque} {vehicle.modele}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Région</InputLabel>
            <Select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              label="Région"
              required
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.nom_region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Prix</InputLabel>
            <Select
              value={selectedPrix}
              onChange={(e) => setSelectedPrix(e.target.value)}
              label="Prix"
              required
            >
              {prixList.map((prix) => (
                <MenuItem key={prix.id} value={prix.id}>
                  {prix.prix}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Date de départ"
            type="date"
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Date de retour"
            type="date"
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Soumettre
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProformaItemForm;
