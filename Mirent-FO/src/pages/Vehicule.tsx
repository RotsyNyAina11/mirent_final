import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Grid,
  Paper,
  Typography,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TablePagination,
  Dialog,
  DialogActions,
  DialogTitle,
  Skeleton,
  InputAdornment,
} from "@mui/material";
import { Delete, Search, Edit, Add } from "@mui/icons-material";

import {
  deleteVehicle,
  fetchVehicles,
  fetchVehicleStatuses,
  fetchVehicleTypes,
  Vehicle,
  VehicleStatus,
  VehicleType,
} from "../redux/features/vehicle/vehiclesSlice";
import { useAppDispatch } from "../hooks";
import { useSelector } from "react-redux";
import AddVehicle from "../Components/AddVehicle";
import EditVehicle from "../Components/EditVehicle";

const VehiclesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, loading, error, vehiclesType, vehiclesStatus } =
    useSelector((state: any) => state.vehicles);
  const [vehicleTypesRedux, setVehicleTypesRedux] =
    useState<VehicleType[]>(vehiclesType);
  const [vehicleStatusesRedux, setVehicleStatusesRedux] =
    useState<VehicleStatus[]>(vehiclesStatus);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchVehicleTypes());
    dispatch(fetchVehicleStatuses());
  }, [dispatch]);

  useEffect(() => {
    setVehicleTypesRedux(vehiclesType);
    setVehicleStatusesRedux(vehiclesStatus);

    if (vehiclesType && vehiclesType.length > 0) {
      setVehicleTypes(vehiclesType.map((t: VehicleType) => t.type));
    }
  }, [vehiclesType, vehiclesStatus]);

  useEffect(() => {
    console.log("Vehicles from Redux:", vehicles);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((veh: any) => {
      const lowercasedSearch = search.toLowerCase();
      const typeName =
        vehicleTypesRedux.find((t) => t.id === veh.type?.id)?.type || "";
      const statusName =
        vehicleStatusesRedux.find((s) => s.id === veh.status?.id)?.status || "";
      return (
        (veh.nom.toLowerCase().includes(lowercasedSearch) ||
          veh.marque.toLowerCase().includes(lowercasedSearch) ||
          veh.modele.toLowerCase().includes(lowercasedSearch) ||
          veh.immatriculation.toLowerCase().includes(lowercasedSearch) ||
          typeName.toLowerCase().includes(lowercasedSearch) ||
          statusName.toLowerCase().includes(lowercasedSearch)) &&
        (filterType ? typeName === filterType : true)
      );
    });
  }, [vehicles, search, filterType, vehicleTypesRedux, vehicleStatusesRedux]);

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditOpen(true);
  };

  const handleDeleteVehicle = () => {
    dispatch(deleteVehicle(vehicleToDelete.id));
    setOpenDeleteDialog(false);
    setOpenSnackbar(true);
  };

  const isValidImageUrl = (url: string) => {
    try {
      new URL(url, window.location.origin);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Titre */}
      <Typography
        variant="h4"
        sx={{ fontWeight: "700", color: "#1976d2", marginBottom: 2 }}
      >
        Liste des véhicules
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#666", marginBottom: 3 }}>
        Recherchez, filtrez, modifiez ou supprimez les véhicules de votre
        agence.
      </Typography>

      {/* Barre de recherche et bouton d'ajout */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Rechercher un véhicule"
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 300 }}
        />
        <FormControl sx={{ width: 200 }} variant="outlined">
          <InputLabel>Filtrer par type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Filtrer par type"
          >
            <MenuItem value="">Tous</MenuItem>
            {vehicleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{
            backgroundColor: "#1976D2",
            boxShadow: 3,
            "&:hover": { boxShadow: 6 },
          }}
          onClick={() => setShowAddVehicle(true)}
        >
          Ajouter un véhicule
        </Button>
      </Box>

      {showAddVehicle && (
        <AddVehicle
          open={showAddVehicle}
          onClose={() => setShowAddVehicle(false)}
        />
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(rowsPerPage)].map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={150} />
                <Skeleton variant="text" width="60%" sx={{ marginTop: 1 }} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="80%" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Typography color="error" variant="h6">
          Erreur de chargement des données. Veuillez réessayer plus tard.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredVehicles
            .slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
            .map((veh: any) => (
              <Grid item xs={12} sm={6} md={4} key={veh.id}>
                <Paper
                  sx={{
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.05)",
                      cursor: "pointer",
                    },
                    backgroundColor: "#ffffff",
                  }}
                >
                  {/* Image avec gestion des erreurs */}
                  {veh.imageUrl && isValidImageUrl(veh.imageUrl) ? (
                    <Box
                      component="img"
                      src={veh.imageUrl}
                      alt={veh.nom}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "../assets/img-placeholder.jpg";
                      }}
                      sx={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                      sx={{
                        py: 3,
                        backgroundColor: "#f5f5f5",
                        borderRadius: "8px",
                        height: 130,
                      }}
                    >
                      Aucune image disponible
                    </Typography>
                  )}

                  <Box
                    sx={{
                      padding: 2,
                      backgroundColor: "#fff",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Titre du véhicule */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        marginBottom: 1,
                        fontSize: "1.3rem",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {veh.nom}
                    </Typography>

                    {/* Marque et modèle */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#555",
                          fontSize: "1.1rem",
                          fontWeight: 500,
                        }}
                      >
                        {veh.marque}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#555",
                          fontSize: "1.1rem",
                          fontWeight: 500,
                        }}
                      >
                        {veh.modele}
                      </Typography>
                    </Box>

                    {/* Informations supplémentaires */}
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(2, 1fr)"
                      gap={2}
                      sx={{ marginBottom: 2 }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Immatriculation: {veh.immatriculation}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Type:{" "}
                        {
                          vehicleTypesRedux.find((t) => t.id === veh.type?.id)
                            ?.type
                        }
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status:{" "}
                        <span
                          style={{
                            color:
                              vehicleStatusesRedux.find(
                                (s) => s.id === veh.status?.id
                              )?.status === "Disponible"
                                ? "green"
                                : "red",
                          }}
                        >
                          {
                            vehicleStatusesRedux.find(
                              (s) => s.id === veh.status?.id
                            )?.status
                          }
                        </span>
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      {/* Boutons de modification et suppression */}
                      <Tooltip title="Modifier le véhicule">
                        <IconButton onClick={() => handleEditClick(veh)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer le véhicule">
                        <IconButton
                          onClick={() => {
                            setVehicleToDelete(veh);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[6, 12, 18]}
        component="div"
        count={filteredVehicles.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={(_, newPage) => setCurrentPage(newPage)}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
        sx={{
          marginTop: 3,
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "10px 15px",
        }}
      />

      {/* Dialog de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          Êtes-vous sûr de vouloir supprimer ce véhicule ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteVehicle} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de succès */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Véhicule supprimé avec succès !
        </Alert>
      </Snackbar>

      {/* Dialog d'édition */}
      {isEditOpen && selectedVehicle && (
        <EditVehicle
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          vehicle={selectedVehicle}
        />
      )}
    </Box>
  );
};

export default VehiclesList;
