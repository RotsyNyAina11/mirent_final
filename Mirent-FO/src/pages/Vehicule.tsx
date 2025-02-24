import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Pagination,
  Modal,
  Snackbar,
  Alert,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import { Edit, Delete, Search, DirectionsCar } from "@mui/icons-material";

import { deleteVehicle, fetchVehicles } from "../redux/slices/vehiclesSlice";
import { useAppDispatch } from "../hooks";
import { useSelector } from "react-redux";
import VehicleForm from "../Components/VehicleForm";

const VehiclesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, loading } = useSelector((state: any) => state.vehicles);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 6;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterType, setFilterType] = useState<string>("");

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const filteredVehicles = vehicles.filter(
    (veh: any) =>
      veh.nom.toLowerCase().includes(search.toLowerCase()) &&
      (filterType ? veh.type === filterType : true)
  );

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(
    indexOfFirstVehicle,
    indexOfLastVehicle
  );

  const handleDeleteVehicle = (veh: any) => {
    dispatch(deleteVehicle(veh.id));
    setOpenDeleteModal(false);
    setOpenSnackbar(true);
  };

  return (
    <Box p={3}>
      {/* Titre */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={3}
        color="primary.main"
      >
        <DirectionsCar sx={{ mr: 1 }} /> Liste des véhicules
      </Typography>

      {/* Barre de recherche et filtres */}
      <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
        <TextField
          label="Rechercher un véhicule"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: 400 }}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Filtrage par type */}
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Filtrer par type</InputLabel>
          <Select
            value={filterType}
            label="Filtrer par type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            {["SUV", "Berline", "Pick-up", "Monospace"].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Formulaire d'ajout */}
      <VehicleForm />

      {/* Liste des véhicules sous forme de cartes */}
      {loading ? (
        <Typography variant="h6" color="gray" textAlign="center">
          Chargement des véhicules...
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {currentVehicles.map((veh: any) => (
            <Grid item xs={12} sm={6} md={4} key={veh.id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {veh.nom}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {veh.marque} - {veh.modele}
                  </Typography>
                  <Typography variant="body2">Type: {veh.type}</Typography>
                  <Typography variant="body2">
                    Immatriculation: {veh.immatriculation}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: veh.status === "disponible" ? "green" : "red",
                    }}
                  >
                    Statut: {veh.status}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => alert("Modal Edit Vehicle Opened")}
                    startIcon={<Edit />}
                  >
                    Modifier
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setVehicleToDelete(veh);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredVehicles.length / vehiclesPerPage)}
        page={currentPage}
        onChange={(_, value) => setCurrentPage(value)}
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />

      {/* Modal de suppression */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-vehicle-modal"
        aria-describedby="modal-to-confirm-vehicle-deletion"
      >
        <Box
          sx={{
            padding: 3,
            bgcolor: "white",
            borderRadius: 2,
            width: "300px",
            margin: "auto",
            marginTop: "20%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Êtes-vous sûr de vouloir supprimer ce véhicule ?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteModal(false)}
              color="secondary"
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteVehicle(vehicleToDelete)}
              startIcon={<Delete />}
            >
              Supprimer
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar de confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Véhicule supprimé avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VehiclesList;
