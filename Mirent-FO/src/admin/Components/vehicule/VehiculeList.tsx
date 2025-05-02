import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch } from "../../../hooks";
import { useSelector } from "react-redux";
import {
  deleteVehicle,
  fetchVehicles,
  fetchVehicleStatuses,
  fetchVehicleTypes,
  Vehicle,
  VehicleStatus,
  VehicleType,
} from "../../../redux/features/vehicle/vehiclesSlice";
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
  DialogContent,
  DialogContentText,
  Skeleton,
  InputAdornment,
  Checkbox,
  Collapse,
  useTheme,
  useMediaQuery,
  Toolbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import {
  Delete,
  SearchOutlined,
  Edit,
  Add,
  DirectionsCar,
  LocalShipping,
  TwoWheeler,
  FilterList,
} from "@mui/icons-material";
import AddVehicle from "./AddVehicle";
import EditVehicle from "./EditVehicle";

// Thème personnalisé (identique à LocationList.tsx)
const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#ef4444",
    },
    background: {
      default: "#f9fafb",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      color: "#1f2937",
    },
    body1: {
      fontSize: "0.9rem",
      color: "#1f2937",
    },
    body2: {
      fontSize: "0.85rem",
      color: "#6b7280",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#d1d5db",
            },
            "&:hover fieldset": {
              borderColor: "#9ca3af",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
  },
});

// Styles personnalisés (alignés avec LocationList.tsx)
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3b82f6",
  color: theme.palette.common.white,
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#2563eb",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
  "&.Mui-disabled": {
    backgroundColor: "#d1d5db",
    color: "#6b7280",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ef4444",
  color: theme.palette.common.white,
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#dc2626",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
  "&.Mui-disabled": {
    backgroundColor: "#d1d5db",
    color: "#6b7280",
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: "#6b7280",
  borderColor: "#d1d5db",
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    borderColor: "#9ca3af",
    backgroundColor: "#f3f4f6",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#9ca3af",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.9rem",
    color: "#1f2937",
  },
}));

const FilterField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#9ca3af",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.9rem",
    color: "#1f2937",
  },
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  transition: "box-shadow 0.3s ease, transform 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.02)",
  },
}));

const VehiclesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, loading, error, vehiclesType, vehiclesStatus } =
    useSelector((state: any) => state.vehicles);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Jusqu'à 600px

  const [vehicleTypesRedux, setVehicleTypesRedux] =
    useState<VehicleType[]>(vehiclesType);
  const [vehicleStatusesRedux, setVehicleStatusesRedux] =
    useState<VehicleStatus[]>(vehiclesStatus);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [vehicleStatuses, setVehicleStatuses] = useState<string[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [confirmDeleteSelectedOpen, setConfirmDeleteSelectedOpen] =
    useState(false);

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
    if (vehiclesStatus && vehiclesStatus.length > 0) {
      setVehicleStatuses(vehiclesStatus.map((s: VehicleStatus) => s.status));
    }
  }, [vehiclesType, vehiclesStatus]);

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
        (filterType ? typeName === filterType : true) &&
        (filterStatus ? statusName === filterStatus : true)
      );
    });
  }, [
    vehicles,
    search,
    filterType,
    filterStatus,
    vehicleTypesRedux,
    vehicleStatusesRedux,
  ]);

  const paginatedVehicles = filteredVehicles.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditOpen(true);
  };

  const handleDeleteVehicle = () => {
    if (vehicleToDelete) {
      dispatch(deleteVehicle(vehicleToDelete.id));
      setSelectedVehicles((prev) =>
        prev.filter((id) => id !== vehicleToDelete.id)
      );
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
    setVehicleToDelete(null);
  };

  const isValidImageUrl = (url: string) => {
    try {
      new URL(url, window.location.origin);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Gestion de la sélection des véhicules
  const handleSelectAllVehicles = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const newSelected = paginatedVehicles.map(
        (vehicle: Vehicle) => vehicle.id
      );
      setSelectedVehicles(newSelected);
    } else {
      setSelectedVehicles([]);
    }
  };

  const handleSelectVehicle = (id: number) => {
    setSelectedVehicles((prev) =>
      prev.includes(id)
        ? prev.filter((vehicleId) => vehicleId !== id)
        : [...prev, id]
    );
  };

  const openConfirmDeleteSelected = () => {
    setConfirmDeleteSelectedOpen(true);
  };

  const handleConfirmDeleteSelected = () => {
    selectedVehicles.forEach((id) => {
      dispatch(deleteVehicle(id));
    });
    setSelectedVehicles([]);
    setConfirmDeleteSelectedOpen(false);
    setOpenSnackbar(true);
  };

  const handleCloseConfirmDeleteSelected = () => {
    setConfirmDeleteSelectedOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: "95%", margin: "auto", mt: 4, mb: 8 }}>
        <Grid
          container
          spacing={3}
          sx={{
            padding: isMobile ? 2 : 3,
            backgroundColor: "#f9fafb",
            minHeight: "100vh",
          }}
        >
          {/* Header */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "text.primary", marginBottom: 1 }}
            >
              Liste des Véhicules
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "0.9rem", color: "#6b7280" }}
            >
              Recherchez, filtrez, modifiez ou supprimez les véhicules de votre
              agence.
            </Typography>
          </Grid>

          {/* Barre de recherche, filtres et bouton d'ajout */}
          <Grid item xs={12}>
            <Toolbar
              sx={{
                justifyContent: "space-between",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
                padding: 0,
                position: "sticky",
                top: "64px",
                backgroundColor: "#f9fafb",
                zIndex: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <SearchField
                  placeholder="Rechercher un véhicule..."
                  variant="outlined"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: isMobile ? "100%" : "300px" }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterOpen(!filterOpen)}
                  sx={{
                    borderColor: "#d1d5db",
                    color: "#1f2937",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  Filtres
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <PrimaryButton
                  startIcon={<Add />}
                  onClick={() => setShowAddVehicle(true)}
                  variant="contained"
                  aria-label="Ajouter un véhicule"
                >
                  Ajouter un véhicule
                </PrimaryButton>
              </Box>
            </Toolbar>
          </Grid>

          {/* Barre d'actions contextuelle pour la sélection */}
          {selectedVehicles.length > 0 && (
            <Grid item xs={12}>
              <Toolbar
                sx={{
                  justifyContent: "space-between",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 2 : 0,
                  p: 2,
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                  position: "sticky",
                  top: "120px",
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "#1f2937" }}
                >
                  {selectedVehicles.length} véhicule(s) sélectionné(s)
                </Typography>
                <SecondaryButton
                  variant="contained"
                  size="small"
                  onClick={openConfirmDeleteSelected}
                  aria-label="Supprimer les véhicules sélectionnés"
                >
                  Supprimer ({selectedVehicles.length})
                </SecondaryButton>
              </Toolbar>
            </Grid>
          )}

          {/* Section des filtres */}
          <Grid item xs={12}>
            <Collapse in={filterOpen}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, mb: 2, color: "#1f2937" }}
                >
                  Filtres
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type de véhicule</InputLabel>
                      <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        label="Type de véhicule"
                        sx={{
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#9ca3af",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                        }}
                      >
                        <MenuItem value="">Tous</MenuItem>
                        {vehicleTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Statut</InputLabel>
                      <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        label="Statut"
                        sx={{
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#9ca3af",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                        }}
                      >
                        <MenuItem value="">Tous</MenuItem>
                        {vehicleStatuses.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Grid>

          {/* Affichage des véhicules */}
          <Grid item xs={12}>
            {loading ? (
              <Grid container spacing={4}>
                {[...Array(rowsPerPage)].map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <DashboardCard>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={180}
                      />
                      <Skeleton
                        variant="text"
                        width="60%"
                        sx={{ marginTop: 1 }}
                      />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="80%" />
                    </DashboardCard>
                  </Grid>
                ))}
              </Grid>
            ) : error ? (
              <Typography color="error" variant="h6" textAlign="center">
                Erreur de chargement des données. Veuillez réessayer plus tard.
              </Typography>
            ) : filteredVehicles.length === 0 ? (
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                Aucun véhicule trouvé.
              </Typography>
            ) : (
              <Grid container spacing={4}>
                {paginatedVehicles.map((veh: Vehicle) => (
                  <Grid item xs={12} sm={6} md={4} key={veh.id}>
                    <DashboardCard>
                      {/* Case à cocher et image */}
                      <Box sx={{ position: "relative" }}>
                        <Checkbox
                          checked={selectedVehicles.includes(veh.id)}
                          onChange={() => handleSelectVehicle(veh.id)}
                          sx={{ position: "absolute", top: 8, left: 8 }}
                          aria-label={`Sélectionner le véhicule ${veh.nom}`}
                        />
                        {veh.imageUrl && isValidImageUrl(veh.imageUrl) ? (
                          <Box
                            component="img"
                            src={veh.imageUrl}
                            alt={veh.nom}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/default-vehicle.png";
                            }}
                            sx={{
                              width: "100%",
                              height: 180,
                              objectFit: "cover",
                              borderRadius: "8px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              transition: "transform 0.2s ease-in-out",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: 180,
                              backgroundColor: "#f5f5f5",
                              borderRadius: "8px",
                            }}
                          >
                            {vehicleTypesRedux
                              .find((t) => t.id === veh.type?.id)
                              ?.type.toLowerCase()
                              .includes("voiture") ? (
                              <DirectionsCar
                                sx={{ fontSize: "4rem", color: "#ccc" }}
                              />
                            ) : vehicleTypesRedux
                                .find((t) => t.id === veh.type?.id)
                                ?.type.toLowerCase()
                                .includes("camion") ? (
                              <LocalShipping
                                sx={{ fontSize: "4rem", color: "#ccc" }}
                              />
                            ) : (
                              <TwoWheeler
                                sx={{ fontSize: "4rem", color: "#ccc" }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                      {/* Informations du véhicule */}
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mt: 2 }}
                      >
                        {veh.nom}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#555" }}>
                        {veh.marque} - {veh.modele}
                      </Typography>
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
                        Places: {veh.nombrePlace}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Statut:{" "}
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
                      {/* Boutons d'action */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Tooltip title="Modifier le véhicule">
                          <IconButton
                            onClick={() => handleEditClick(veh)}
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "primary.light",
                                transition: "background-color 0.3s ease",
                              },
                            }}
                            aria-label={`Modifier le véhicule ${veh.nom}`}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            selectedVehicles.length > 0
                              ? "Désélectionnez les véhicules pour supprimer individuellement"
                              : "Supprimer le véhicule"
                          }
                        >
                          <span>
                            <IconButton
                              onClick={() => {
                                setVehicleToDelete(veh);
                                setOpenDeleteDialog(true);
                              }}
                              disabled={selectedVehicles.length > 0}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: "secondary.light",
                                  transition: "background-color 0.3s ease",
                                },
                                "&.Mui-disabled": { color: "#d1d5db" },
                              }}
                              aria-label={`Supprimer le véhicule ${veh.nom}`}
                            >
                              <Delete />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </DashboardCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {/* Pagination */}
          <Grid item xs={12}>
            <TablePagination
              rowsPerPageOptions={[6, 12, 18]}
              component="div"
              count={filteredVehicles.length}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={(_, newPage) => setCurrentPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setCurrentPage(0);
              }}
              sx={{
                "& .MuiTablePagination-selectLabel": {
                  fontSize: "0.85rem",
                  color: "text.secondary",
                },
                "& .MuiTablePagination-displayedRows": {
                  fontSize: "0.85rem",
                  color: "text.secondary",
                },
                "& .MuiTablePagination-actions": { color: "primary.main" },
                "& .MuiTablePagination-toolbar": {
                  justifyContent: "flex-end",
                  py: 1,
                },
              }}
            />
          </Grid>

          {/* Dialogue de confirmation de suppression individuelle */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "text.primary",
                py: 3,
              }}
            >
              Confirmer la suppression
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <DialogContentText
                id="confirm-delete-description"
                sx={{ color: "#1f2937", fontSize: "1rem", textAlign: "center" }}
              >
                Êtes-vous sûr de vouloir supprimer le véhicule{" "}
                {vehicleToDelete?.nom} ?
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <CancelButton
                onClick={() => setOpenDeleteDialog(false)}
                variant="outlined"
                aria-label="Annuler la suppression"
              >
                Annuler
              </CancelButton>
              <SecondaryButton
                onClick={handleDeleteVehicle}
                variant="contained"
                aria-label="Confirmer la suppression"
              >
                Supprimer
              </SecondaryButton>
            </DialogActions>
          </Dialog>

          {/* Dialogue de confirmation pour supprimer les véhicules sélectionnés */}
          <Dialog
            open={confirmDeleteSelectedOpen}
            onClose={handleCloseConfirmDeleteSelected}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "text.primary",
                py: 3,
              }}
            >
              Confirmer la suppression
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <DialogContentText
                id="confirm-delete-selected-description"
                sx={{ color: "#1f2937", fontSize: "1rem", textAlign: "center" }}
              >
                Êtes-vous sûr de vouloir supprimer {selectedVehicles.length}{" "}
                véhicule(s) sélectionné(s) ?
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <CancelButton
                onClick={handleCloseConfirmDeleteSelected}
                variant="outlined"
                aria-label="Annuler la suppression des véhicules sélectionnés"
              >
                Annuler
              </CancelButton>
              <SecondaryButton
                onClick={handleConfirmDeleteSelected}
                variant="contained"
                aria-label="Confirmer la suppression des véhicules sélectionnés"
              >
                Supprimer
              </SecondaryButton>
            </DialogActions>
          </Dialog>

          {/* Snackbar de succès */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity="success"
              sx={{
                width: "100%",
                backgroundColor: "#10b981",
                color: "#fff",
                "& .MuiAlert-icon": {
                  color: "#fff",
                },
              }}
            >
              {selectedVehicles.length > 1
                ? `${selectedVehicles.length} véhicule(s) supprimé(s) avec succès !`
                : "Véhicule supprimé avec succès !"}
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

          {/* Modal d'ajout de véhicule */}
          {showAddVehicle && (
            <AddVehicle
              open={showAddVehicle}
              onClose={() => setShowAddVehicle(false)}
            />
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default VehiclesList;
