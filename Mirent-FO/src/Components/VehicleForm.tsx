import React, { useState } from "react";
import { TextField, Button, Box, Modal, Typography, MenuItem, Grid, Fade } from "@mui/material";
import { addVehicle } from "../redux/slices/vehiclesSlice";
import { useAppDispatch } from "../hooks";

const VehicleForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [vehicle, setVehicle] = useState({
    nom: "",
    marque: "",
    modele: "",
    type: "",
    immatriculation: "",
    nombrePlace: 4,
    status: "disponible",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation des champs
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!vehicle.nom) newErrors.nom = "Le nom est requis";
    if (!vehicle.marque) newErrors.marque = "La marque est requise";
    if (!vehicle.modele) newErrors.modele = "Le modèle est requis";
    if (!vehicle.type) newErrors.type = "Le type est requis";
    if (!vehicle.immatriculation) newErrors.immatriculation = "L'immatriculation est requise";
    if (vehicle.nombrePlace <= 0) newErrors.nombrePlace = "Le nombre de places doit être supérieur à 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(addVehicle(vehicle));
      setOpen(false);
      setVehicle({
        nom: "",
        marque: "",
        modele: "",
        type: "",
        immatriculation: "",
        nombrePlace: 4,
        status: "disponible",
      });
      setErrors({});
    }
  };

  return (
    <Box mb={3} textAlign="center">
      <Button 
        variant="contained" 
        color="primary" 
        sx={{
          bgcolor: "#1976D2",
          fontSize: "16px",
          fontWeight: "bold",
          padding: "12px 20px",
          ":hover": { bgcolor: "#1565C0" }
        }}
        onClick={() => setOpen(true)}
      >
        + Ajouter un véhicule
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Fade in={open}>
          <Box
            p={4}
            bgcolor="white"
            mx="auto"
            mt={8}
            borderRadius={2}
            width={450}
            boxShadow={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "30px",
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Ajouter un véhicule 
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="nom"
                    value={vehicle.nom}
                    onChange={handleChange}
                    required
                    error={!!errors.nom}
                    helperText={errors.nom}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Marque"
                    name="marque"
                    value={vehicle.marque}
                    onChange={handleChange}
                    required
                    error={!!errors.marque}
                    helperText={errors.marque}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Modèle"
                    name="modele"
                    value={vehicle.modele}
                    onChange={handleChange}
                    required
                    error={!!errors.modele}
                    helperText={errors.modele}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Type"
                    name="type"
                    value={vehicle.type}
                    onChange={handleChange}
                    required
                    error={!!errors.type}
                    helperText={errors.type}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Immatriculation"
                    name="immatriculation"
                    value={vehicle.immatriculation}
                    onChange={handleChange}
                    required
                    error={!!errors.immatriculation}
                    helperText={errors.immatriculation}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Nombre de places"
                    name="nombrePlace"
                    type="number"
                    value={vehicle.nombrePlace}
                    onChange={handleChange}
                    required
                    error={!!errors.nombrePlace}
                    helperText={errors.nombrePlace}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Statut"
                    name="status"
                    value={vehicle.status}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="disponible">Disponible</MenuItem>
                    <MenuItem value="loué">Loué</MenuItem>
                    <MenuItem value="en maintenance">En maintenance</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                sx={{
                  mt: 3, 
                  py: 1.5, 
                  fontSize: "16px",
                  fontWeight: "bold",
                  bgcolor: "#2E7D32",
                  ":hover": { bgcolor: "#1B5E20" }
                }}
              >
                 Ajouter
              </Button>
              <Button 
                fullWidth
                variant="outlined"
                sx={{ mt: 2, py: 1.5, fontSize: "16px", fontWeight: "bold" }}
                onClick={() => setOpen(false)}
              >
                 Annuler
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default VehicleForm;
