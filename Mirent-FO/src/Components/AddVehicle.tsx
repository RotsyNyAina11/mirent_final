import React, { useState, useEffect } from "react";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, Grid, IconButton } from "@mui/material";
import { createVehicle } from "../redux/slices/vehiclesSlice";
import { SelectChangeEvent } from "@mui/material/Select";
import { useAppDispatch } from "../hooks";
import { AiOutlineCar, AiOutlineTag, AiOutlineNumber, AiOutlineClose } from "react-icons/ai";

interface AddVehicleProps {
  open: boolean;
  onClose: () => void;
}

const AddVehicle: React.FC<AddVehicleProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const [vehicle, setVehicle] = useState({
    nom: "",
    marque: "",
    modele: "",
    immatriculation: "",
    nombrePlace: 0,
    type: { id: 0, type: "" },
    status: { id: 0, status: "" },
  });

  const [vehicleTypes, setVehicleTypes] = useState<{ id: number; type: string }[]>([]);
  const [vehicleStatuses, setVehicleStatuses] = useState<{ id: number; status: string }[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      const response = await fetch("http://localhost:3000/type");
      const data = await response.json();
      setVehicleTypes(data);
      if (data.length > 0 && vehicle.type.type === "") {
        setVehicle((prev) => ({ ...prev, type: { id: data[0].id, type: data[0].type } }));
      }
    };
    const fetchVehicleStatuses = async () => {
      const response = await fetch("http://localhost:3000/status");
      const data = await response.json();
      setVehicleStatuses(data);
      if (data.length > 0 && vehicle.status.status === "") {
        setVehicle((prev) => ({ ...prev, status: { id: data[0].id, status: data[0].status } }));
      }
    };

    fetchVehicleTypes();
    fetchVehicleStatuses();
  }, [isInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSelectType = (event: SelectChangeEvent) => {
      const value = event.target.value;
      if (!value) return; 
      const selectedType = vehicleTypes.find((type) => type.type === value);
      if (selectedType) {
        setVehicle((prev) => ({
          ...prev,
          type: { id: selectedType.id, type: selectedType.type },
        }));
      }
    };
    
    const handleSelectStatus = (event: SelectChangeEvent) => {
      const value = event.target.value;
      if (!value) return; 
      const selectedStatus = vehicleStatuses.find((status) => status.status === value);
      if (selectedStatus) {
        setVehicle((prev) => ({
          ...prev,
          status: { id: selectedStatus.id, status: selectedStatus.status },
        }));
      }
    };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createVehicle(vehicle));
    // Réinitialiser le formulaire et fermer le dialogue
    setVehicle({
      nom: "",
      marque: "",
      modele: "",
      immatriculation: "",
      nombrePlace: 0,
      type: { id: 0, type: "" },
      status: { id: 0, status: "" },
    });
    onClose();
  };

  const handleCancel = () => {
    // Réinitialiser et fermer le dialogue
    setVehicle({
      nom: "",
      marque: "",
      modele: "",
      immatriculation: "",
      nombrePlace: 0,
      type: { id: 0, type: "" },
      status: { id: 0, status: "" },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600, color: "#1976d2" }}>
        Ajouter un véhicule
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCancel}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <AiOutlineClose />
        </IconButton>
      </DialogTitle>
      <Box component="form" p={3} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nom"
              fullWidth
              variant="outlined"
              name="nom"
              value={vehicle.nom}
              onChange={handleInputChange}
              sx={{ marginBottom: 2, "& .MuiInputBase-root": { borderRadius: "12px" } }}
              InputProps={{
                startAdornment: (
                  <IconButton sx={{ color: "#1976d2" }}>
                    <AiOutlineCar />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Marque"
              fullWidth
              variant="outlined"
              name="marque"
              value={vehicle.marque}
              onChange={handleInputChange}
              sx={{ marginBottom: 2, "& .MuiInputBase-root": { borderRadius: "12px" } }}
              InputProps={{
                startAdornment: (
                  <IconButton sx={{ color: "#1976d2" }}>
                    <AiOutlineTag />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Modèle"
              fullWidth
              variant="outlined"
              name="modele"
              value={vehicle.modele}
              onChange={handleInputChange}
              sx={{ marginBottom: 2, "& .MuiInputBase-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Immatriculation"
              fullWidth
              variant="outlined"
              name="immatriculation"
              value={vehicle.immatriculation}
              onChange={handleInputChange}
              sx={{ marginBottom: 2, "& .MuiInputBase-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre de places"
              fullWidth
              variant="outlined"
              name="nombrePlace"
              type="number"
              value={vehicle.nombrePlace}
              onChange={handleInputChange}
              sx={{ marginBottom: 2, "& .MuiInputBase-root": { borderRadius: "12px" } }}
              InputProps={{
                startAdornment: (
                  <IconButton sx={{ color: "#1976d2" }}>
                    <AiOutlineNumber />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
              <InputLabel>Type de véhicule</InputLabel>
              <Select
                value={vehicle.type.type}
                onChange={handleSelectType}
                label="Type de véhicule"
                sx={{ borderRadius: "12px" }}
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type.id} value={type.type}>
                    {type.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={vehicle.status.status}
                onChange={handleSelectStatus}
                label="Status"
                sx={{ borderRadius: "12px" }}
              >
                {vehicleStatuses.map((status) => (
                  <MenuItem key={status.id} value={status.status}>
                    {status.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit" sx={{ borderRadius: "12px" }}>
            Ajouter
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ borderRadius: "12px", marginLeft: 2 }}>
            Annuler
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddVehicle;
