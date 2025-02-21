import React, { useEffect, useState, useMemo } from "react";
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, CircularProgress, Snackbar, Alert, InputAdornment, FormControl, Select, MenuItem, InputLabel, TablePagination, Dialog, DialogActions, DialogTitle, Chip, Tooltip, Typography, Grid } from "@mui/material";
import { Delete, Search, Edit, Add } from "@mui/icons-material";
import { deleteVehicle, fetchVehicles } from "../redux/slices/vehiclesSlice";
import { useAppDispatch } from "../hooks";
import { useSelector } from "react-redux";

const VehiclesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, loading } = useSelector((state: any) => state.vehicles);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);

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

        <FormControl sx={{ width: 200 }}>
          <InputLabel>Filtrer par type</InputLabel>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="">Tous</MenuItem>
            {vehicleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" startIcon={<Add />} sx={{ backgroundColor: "#4caf50" }}>
          Ajouter un véhicule
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Nom</TableCell>
                <TableCell sx={{ color: "white" }}>Marque</TableCell>
                <TableCell sx={{ color: "white" }}>Modèle</TableCell>
                <TableCell sx={{ color: "white" }}>Immatriculation</TableCell>
                <TableCell sx={{ color: "white" }}>Type</TableCell>
                <TableCell sx={{ color: "white" }}>Statut</TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVehicles.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((veh: any) => (
                <TableRow key={veh.id}>
                  <TableCell>{veh.nom}</TableCell>
                  <TableCell>{veh.marque}</TableCell>
                  <TableCell>{veh.modele}</TableCell>
                  <TableCell>{veh.immatriculation}</TableCell>
                  <TableCell>{veh.type?.type}</TableCell>
                  <TableCell>
                    <Chip label={veh.status?.status} color={veh.status?.status === "disponible" ? "success" : "error"} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Modifier">
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton color="error" onClick={() => { setVehicleToDelete(veh); setOpenDeleteDialog(true); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredVehicles.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={(event, newPage) => setCurrentPage(newPage)}
          />
        </TableContainer>
      )}

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
