import React, { useEffect, useState, useMemo } from "react";
import { Box, TextField, Snackbar, Alert, Button, IconButton, Grid, Paper, Typography, Tooltip, FormControl, Select, MenuItem, InputLabel, TablePagination, Dialog, DialogActions, DialogTitle, Chip, Skeleton, InputAdornment } from "@mui/material";
import { Delete, Search, Edit, Add } from "@mui/icons-material";
import { deleteVehicle, fetchVehicles } from "../redux/slices/vehiclesSlice";
import { useAppDispatch } from "../hooks";
import { useSelector } from "react-redux";
import AddVehicle from "../Components/AddVehicle";

const VehiclesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, loading } = useSelector((state: any) => state.vehicles);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 6;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  useEffect(() => {
    dispatch(fetchVehicles());
    const fetchVehicleTypes = async () => {
      try {
        const response = await fetch("http://localhost:3000/type");
        const data = await response.json();
        if (Array.isArray(data)) {
          const types = data.map((item) => item.type);
          setVehicleTypes(types);
        }
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    };
    fetchVehicleTypes();
  }, [dispatch]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((veh: any) => {
      const lowercasedSearch = search.toLowerCase();
      return (
        (veh.nom.toLowerCase().includes(lowercasedSearch) ||
          veh.marque.toLowerCase().includes(lowercasedSearch) ||
          veh.modele.toLowerCase().includes(lowercasedSearch) ||
          veh.immatriculation.toLowerCase().includes(lowercasedSearch) ||
          veh.type?.type.toLowerCase().includes(lowercasedSearch) ||
          veh.status?.status.toLowerCase().includes(lowercasedSearch)) &&
        (filterType ? veh.type?.type === filterType : true)
      );
    });
  }, [vehicles, search, filterType]);

  const handleDeleteVehicle = () => {
    dispatch(deleteVehicle(vehicleToDelete.id));
    setOpenDeleteDialog(false);
    setOpenSnackbar(true);
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <Typography variant="h4" sx={{ fontWeight: "700", color: "#1976d2", marginBottom: 2 }}>
        Liste des véhicules
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#666", marginBottom: 3 }}>
        Recherchez, filtrez, modifiez ou supprimez les véhicules de votre agence.
      </Typography>

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
          sx={{ backgroundColor: "#4caf50", boxShadow: 3, "&:hover": { boxShadow: 6 } }}
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
      ) : (
        <Grid container spacing={3}>
          {filteredVehicles.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((veh: any) => (
            <Grid item xs={12} sm={6} md={4} key={veh.id}>
              <Paper
                sx={{
                  padding: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": { boxShadow: 6, transform: "scale(1.05)", cursor: "pointer" },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: 1 }}>
                  {veh.nom}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#444", marginBottom: 1 }}>
                  {veh.marque} {veh.modele}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {veh.immatriculation}
                </Typography>
                <Chip
                  label={veh.status?.status}
                  color={veh.status?.status === "disponible" ? "success" : "error"}
                  sx={{ marginTop: 1 }}
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Tooltip title="Modifier">
                    <IconButton color="primary">
                      <Edit sx={{ transform: "scale(1.1)", transition: "transform 0.3s" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton color="error" onClick={() => { setVehicleToDelete(veh); setOpenDeleteDialog(true); }}>
                      <Delete sx={{ transform: "scale(1.1)", transition: "transform 0.3s" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <TablePagination
        rowsPerPageOptions={[6, 10, 25]}
        component="div"
        count={filteredVehicles.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={(event, newPage) => setCurrentPage(newPage)}
        sx={{ marginTop: 2 }}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Êtes-vous sûr de vouloir supprimer ce véhicule ?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleDeleteVehicle} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Véhicule supprimé avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VehiclesList;
