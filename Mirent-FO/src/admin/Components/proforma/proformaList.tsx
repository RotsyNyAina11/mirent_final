import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { AppDispatch, RootState } from "../../../redux/store";
import { deleteProforma, fetchProformas } from "../../../redux/features/proforma/proformaSlice";

// Thème personnalisé
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
    h4: {
      fontWeight: 600,
      color: "#1f2937",
    },
    h6: {
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
  },
});

// Styles personnalisés
const DashboardCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  transition: 'box-shadow 0.3s ease, transform 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'scale(1.02)',
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3b82f6',
  color: theme.palette.common.white,
  padding: '6px 12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#2563eb',
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease',
  },
  '&.Mui-disabled': {
    backgroundColor: '#d1d5db',
    color: '#6b7280',
  },
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ef4444',
  color: theme.palette.common.white,
  padding: '6px 12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#dc2626',
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease',
  },
}));

const ProformasList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { proformas, loading, error } = useSelector((state: RootState) => state.proformas);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Jusqu'à 600px

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Récupérer les proformas via API
  useEffect(() => {
    dispatch(fetchProformas());
  }, [dispatch]);

  // Fonction pour gérer la suppression
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProforma(id)).unwrap();
      setSnackbarMessage("Proforma supprimé avec succès !");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error instanceof Error ? error.message : "Erreur lors de la suppression du proforma");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  // Fonction pour gérer la modification
  const handleEdit = (id: number) => {
    navigate(`/edit-proforma/${id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#f9fafb' }}>
        {/* Afficher les erreurs */}
        {loading && (
          <Typography sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Chargement des proformas...
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            {error}
          </Typography>
        )}
        {!loading && !error && proformas.length === 0 && (
          <Typography color="warning" sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Aucun proforma disponible.
          </Typography>
        )}

        {/* Titre de la section */}
        <Grid container spacing={3} mb={isMobile ? 2 : 4}>
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937', marginBottom: 1 }}>
              Liste des Proformas
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Consultez et gérez les proformas ci-dessous.
            </Typography>
          </Grid>
        </Grid>

        {/* Tableau des proformas */}
        {proformas.length > 0 && (
          <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: isMobile ? 300 : 650 }} aria-label="tableau des proformas">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Numéro</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Véhicule</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Date de début</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Date de fin</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Coût total (Ar)</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {proformas.map((proforma) => (
                    <TableRow key={proforma.id}>
                      <TableCell>{proforma.proformaNumber}</TableCell>
                      <TableCell>{proforma.client.lastName}</TableCell>
                      <TableCell>{proforma.items[0]?.vehicle.nom || "N/A"}</TableCell>
                      <TableCell>{proforma.items[0]?.dateDepart || "N/A"}</TableCell>
                      <TableCell>{proforma.items[0]?.dateRetour || "N/A"}</TableCell>
                      <TableCell>{proforma.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{proforma.status}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <PrimaryButton
                            onClick={() => handleEdit(proforma.id)}
                            aria-label={`Modifier le proforma ${proforma.id}`}
                          >
                            Modifier
                          </PrimaryButton>
                          <DeleteButton
                            onClick={() => handleDelete(proforma.id)}
                            aria-label={`Supprimer le proforma ${proforma.id}`}
                          >
                            Supprimer
                          </DeleteButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        )}

        {/* Snackbar de succès ou d'erreur */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              backgroundColor: snackbarSeverity === "success" ? "#10b981" : "#ef4444",
              color: "#fff",
              "& .MuiAlert-icon": {
                color: "#fff",
              },
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ProformasList;