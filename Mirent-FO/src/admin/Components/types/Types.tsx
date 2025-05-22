import React, { useState, useEffect } from "react";
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
import FilterListIcon from "@mui/icons-material/FilterList";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { RootState } from "../../../redux/store";
import { fetchVehicleTypes } from "../../../redux/features/vehicle/vehiclesSlice";



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
  const [filteredTypes, setFilteredTypes] = useState<VehicleType[]>(vehiclesType);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Récupérer les types de véhicules au montage du composant
  useEffect(() => {
    dispatch(fetchVehicleTypes() as any); 
  }, [dispatch]);


  // Gérer le changement de page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gérer la recherche
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Placeholder pour les actions (à implémenter selon vos besoins)
  const handleEdit = (id: number) => {
    console.log(`Modifier le type avec l'ID: ${id}`);
    // Implémenter la logique pour modifier un type
  };

  const handleDelete = (id: number) => {
    console.log(`Supprimer le type avec l'ID: ${id}`);
    // Implémenter la logique pour supprimer un type
  };

  const handleExportCSV = () => {
    console.log("Exporter les types de véhicules en CSV");
    // Implémenter la logique pour exporter en CSV
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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
            <Table sx={{ minWidth: 650 }} aria-label="tableau des types de véhicules">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: "600", color: textColor }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      Type
                      <ArrowUpwardIcon sx={{ fontSize: "16px", color: "#888" }} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: textColor }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography color={textColor}>Aucun type de véhicule trouvé</Typography>
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
                        <TableCell sx={{ color: textColor }}>{type.type}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleEdit(type.id)}
                            sx={{ color: primaryColor }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(type.id)}
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
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            sx={{
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: textColor,
              },
            }}
          />
        </>
      )}
    </Container>
  );
};

export default VehicleTypes;