import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
  styled,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { RootState } from "../../../redux/store";
import {
  fetchVehicleTypes,
  addVehicleType as addVehicleTypeAction,
  updateVehicleType as updateVehicleTypeAction,
  deleteVehicleType as deleteVehicleTypeAction,
  VehicleType as VehicleTypeState, // Renommer pour éviter la confusion avec l'interface locale
} from "../../../redux/features/vehicle/vehiclesSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Couleurs personnalisées (alignées avec l'image)
const primaryColor = "#1976d2"; // Bleu pour les boutons et icônes
const secondaryColor = "#f5f7fa"; // Fond clair
const textColor = "#333"; // Texte principal
const errorColor = "#d32f2f"; // Rouge pour les erreurs et supprimer

// Style pour le conteneur principal
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: secondaryColor,
  minHeight: "100vh",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

// Style pour le champ de recherche
const SearchField = styled(TextField)(({ theme }) => ({
  width: "300px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: primaryColor,
    },
    "&.Mui-focused fieldset": {
      borderColor: primaryColor,
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
    fontSize: "14px",
  },
}));

// Style pour les boutons
const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  borderRadius: "4px",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

// Interface pour un type de véhicule (correspond à VehicleType dans vehiclesSlice)
interface VehicleType {
  id: number;
  type: string;
}

const VehicleTypes: React.FC = () => {
  const dispatch = useDispatch();
  const { vehiclesType, vehiclesTypeLoading, vehiclesTypeError } = useSelector(
    (state: RootState) => state.vehicles
  );
  const [filteredTypes, setFilteredTypes] =
    useState<VehicleType[]>(vehiclesType);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newVehicleType, setNewVehicleType] = useState("");
  const [editingVehicleType, setEditingVehicleType] =
    useState<VehicleType | null>(null);
  const [deletingVehicleTypeId, setDeletingVehicleTypeId] = useState<
    number | null
  >(null);

  // Récupérer les types de véhicules au montage du composant
  useEffect(() => {
    dispatch(fetchVehicleTypes() as any);
  }, [dispatch]);

  // Filtrer les types de véhicules en fonction du terme de recherche
  useEffect(() => {
    const filtered = vehiclesType.filter((type) =>
      type.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTypes(filtered);
    setPage(0); // Réinitialiser la page lors de la recherche
  }, [searchTerm, vehiclesType]);

  // Gérer le changement de page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gérer la recherche
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddDialog = () => {
    setNewVehicleType("");
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddVehicleType = () => {
    if (newVehicleType.trim()) {
      dispatch(
        addVehicleTypeAction({ id: Date.now(), type: newVehicleType }) as any
      );
      handleCloseAddDialog();
    }
  };

  const handleOpenEditDialog = (vehicleType: VehicleType) => {
    setEditingVehicleType({ ...vehicleType });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditingVehicleType(null);
    setOpenEditDialog(false);
  };

  const handleEditVehicleType = () => {
    if (editingVehicleType && editingVehicleType.type.trim()) {
      dispatch(
        updateVehicleTypeAction({
          ...editingVehicleType,
          nom: "", // Provide default or actual values for missing properties
          marque: "",
          modele: "",
          immatriculation: "",
          nombrePlace: 0, // Default or actual value
          imageUrl: "", // Default or actual value
          status: "", // Default or actual value
        }) as any
      );
      handleCloseEditDialog();
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeletingVehicleTypeId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingVehicleTypeId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteVehicleType = () => {
    if (deletingVehicleTypeId !== null) {
      dispatch(deleteVehicleTypeAction(deletingVehicleTypeId) as any);
      handleCloseDeleteDialog();
    } else {
      console.warn(
        "Tentative de suppression avec un ID de type de véhicule nul."
      );
      // Vous pourriez afficher un message d'erreur à l'utilisateur ici
    }
  };

  const handleExportCSV = () => {
    console.log("Exporter les types de véhicules en CSV");
    // Implémenter la logique pour exporter en CSV (peut-être via une librairie comme 'papaparse')
    const csvData = filteredTypes
      .map((type) => `${type.id},${type.type}`)
      .join("\n");
    const csvHeader = "ID,Type\n";
    const csvString = csvHeader + csvData;

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "vehicle_types.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container>
      {/* Titre et sous-titre */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: textColor,
          fontWeight: "600",
          mb: 1,
        }}
      >
        Gestion des Types de Véhicules
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: textColor,
          mb: 3,
        }}
      >
        Gérez les types de véhicules : ajouter, modifier ou supprimer des types.
      </Typography>

      {/* Barre d'actions */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" gap={2}>
          <SearchField
            variant="outlined"
            placeholder="Rechercher un type..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#888" }} />
                </InputAdornment>
              ),
            }}
          />
          <ActionButton
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={handleExportCSV}
            sx={{
              borderColor: "#e0e0e0",
              color: textColor,
              "&:hover": {
                borderColor: primaryColor,
                color: primaryColor,
              },
            }}
          >
            Exporter CSV
          </ActionButton>
        </Box>
        <ActionButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            backgroundColor: primaryColor,
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Ajouter un type
        </ActionButton>
      </Box>

      {/* Gestion du chargement et des erreurs */}
      {vehiclesTypeLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress sx={{ color: primaryColor }} />
        </Box>
      ) : vehiclesTypeError ? (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {vehiclesTypeError}
        </Typography>
      ) : (
        <>
          {/* Tableau des types de véhicules */}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Table
              sx={{ minWidth: 650 }}
              aria-label="tableau des types de véhicules"
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: "600", color: textColor }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      Type
                      {/* Placeholder for sorting icon, implement if needed */}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "600", color: textColor }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography color={textColor}>
                        Aucun type de véhicule trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTypes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((type) => (
                      <TableRow
                        key={type.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <TableCell sx={{ color: textColor }}>
                          {type.type}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleOpenEditDialog(type)}
                            sx={{ color: primaryColor }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpenDeleteDialog(type.id)}
                            sx={{ color: errorColor }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTypes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page :"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
            sx={{
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  color: textColor,
                },
            }}
          />
        </>
      )}

      {/* Dialog d'ajout */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Ajouter un type de véhicule</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Type de véhicule"
            fullWidth
            variant="outlined"
            value={newVehicleType}
            onChange={(e) => setNewVehicleType(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleAddVehicleType}
            sx={{ backgroundColor: primaryColor }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Modifier le type de véhicule</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Type de véhicule"
            fullWidth
            variant="outlined"
            value={editingVehicleType?.type || ""}
            onChange={(e) =>
              setEditingVehicleType((prev) =>
                prev ? { ...prev, type: e.target.value } : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleEditVehicleType}
            sx={{ backgroundColor: primaryColor }}
            disabled={!editingVehicleType?.type.trim()}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmer la suppression"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer ce type de véhicule ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button
            onClick={handleDeleteVehicleType}
            autoFocus
            sx={{ color: errorColor }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehicleTypes;
