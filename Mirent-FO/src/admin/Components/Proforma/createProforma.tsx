import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  SelectChangeEvent,
  Link,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  createProforma,
  fetchAvailableVehicles,
} from "../../../redux/features/proforma/proformaSlice";

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
const DashboardCard = styled("div")(({ theme }) => ({
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

// Interface pour les données
interface Client {
  id: number;
  lastName: string;
  email?: string;
  phone?: string;
}

interface ProformaForm {
  clientId: number | "";
  vehicleId: number | "";
  startDate: string;
  endDate: string;
  regionName: string;
  contractReference: string;
  notes: string;
  status: "En attente" | "Confirmé" | "Annulé" | "";
}

interface FormErrors {
  clientId?: string;
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  regionName?: string;
  status?: string;
}

const CreateProforma: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { availableVehicles, loading, error } = useSelector(
    (state: RootState) => state.proformas
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Jusqu'à 600px

  const [clients, setClients] = useState<Client[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProformaForm>({
    clientId: "",
    vehicleId: "",
    startDate: "",
    endDate: "",
    regionName: "",
    contractReference: "",
    notes: "",
    status: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Récupérer les clients via API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:3000/clients");
        const data = await response.json();
        if (response.ok) {
          setClients(data);
        } else {
          setSnackbarMessage("Erreur lors du chargement des clients");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage("Erreur lors de la récupération des clients");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchClients();
  }, []);

  // Récupérer les véhicules disponibles lorsque les dates changent
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const criteria = {
        dateDepart: formData.startDate,
        dateRetour: formData.endDate,
      };
      dispatch(fetchAvailableVehicles(criteria));
    }
  }, [formData.startDate, formData.endDate, dispatch]);

  // Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
    // Réinitialiser l'erreur pour ce champ
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.clientId) {
      errors.clientId = "Veuillez sélectionner un client";
    }
    if (!formData.vehicleId) {
      errors.vehicleId = "Veuillez sélectionner un véhicule";
    }
    if (!formData.startDate) {
      errors.startDate = "Veuillez entrer une date de début";
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.startDate)) {
        errors.startDate = "Format de date invalide (AAAA-MM-JJ)";
      }
    }
    if (!formData.endDate) {
      errors.endDate = "Veuillez entrer une date de fin";
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.endDate)) {
        errors.endDate = "Format de date invalide (AAAA-MM-JJ)";
      }
    }
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        errors.startDate = "Dates invalides";
        errors.endDate = "Dates invalides";
      } else if (endDate <= startDate) {
        errors.endDate =
          "La date de fin doit être postérieure à la date de début";
      }
    }
    if (!formData.regionName) {
      errors.regionName = "Veuillez entrer une région";
    }
    if (!formData.status) {
      errors.status = "Veuillez sélectionner un statut";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    // Préparer les données pour l'API
    const selectedClient = clients.find(
      (client) => client.id === formData.clientId
    );
    if (!selectedClient) {
      setSnackbarMessage("Client non trouvé");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setSubmitting(false);
      return;
    }

    const proformaData = {
      clientLastName: selectedClient.lastName,
      clientEmail: selectedClient.email,
      clientPhone: selectedClient.phone,
      date: new Date().toISOString(),
      contractReference: formData.contractReference,
      notes: formData.notes,
      items: [
        {
          vehicleCriteria: {}, // Vous pouvez ajouter des critères si nécessaire
          regionName: formData.regionName,
          dateDepart: formData.startDate,
          dateRetour: formData.endDate,
        },
      ],
    };

    // Envoyer les données à l'API
    try {
      const result = await dispatch(createProforma(proformaData)).unwrap();
      const pdfBase64 = result.pdfBase64;
      const pdfBlob = new Blob([Buffer.from(pdfBase64, "base64")], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);

      // Réinitialiser le formulaire
      setFormData({
        clientId: "",
        vehicleId: "",
        startDate: "",
        endDate: "",
        regionName: "",
        contractReference: "",
        notes: "",
        status: "",
      });
      setFormErrors({});
      setSnackbarMessage("Proforma créé avec succès !");
      setSnackbarSeverity("success");
    } catch (error: any) {
      setSnackbarMessage(error || "Erreur lors de la création du proforma");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
    setSubmitting(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        {/* Afficher l'état de chargement ou les erreurs */}
        {loading && (
          <Typography sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Chargement des données...
          </Typography>
        )}
        {error && !loading && (
          <Typography
            color="error"
            sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}
          >
            {error}
          </Typography>
        )}
        {!loading && !error && clients.length === 0 && (
          <Typography
            color="warning"
            sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}
          >
            Aucun client disponible.
          </Typography>
        )}

        {/* Titre de la page */}
        <Grid container spacing={3} mb={isMobile ? 2 : 4}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#1f2937", marginBottom: 1 }}
            >
              Créer un Proforma
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "0.9rem", color: "#6b7280" }}
            >
              Remplissez les informations ci-dessous pour créer un nouveau
              proforma pour un client.
            </Typography>
          </Grid>
        </Grid>

        {/* Formulaire de création */}
        <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={isMobile ? 2 : 3}>
              {/* Client */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.clientId}>
                  <InputLabel id="client-label" sx={{ color: "#6b7280" }}>
                    Client
                  </InputLabel>
                  <Select
                    labelId="client-label"
                    name="clientId"
                    value={formData.clientId}
                    onChange={(e: SelectChangeEvent<string | number>) =>
                      handleChange(e)
                    }
                    label="Client"
                    sx={{
                      borderRadius: "8px",
                      "& .MuiSelect-select": {
                        padding: "10px 14px",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                      },
                    }}
                    aria-label="Sélectionner un client"
                  >
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.clientId && (
                    <Typography color="error" variant="body2">
                      {formErrors.clientId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Véhicule */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.vehicleId}>
                  <InputLabel id="vehicle-label" sx={{ color: "#6b7280" }}>
                    Véhicule
                  </InputLabel>
                  <Select
                    labelId="vehicle-label"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={(e: SelectChangeEvent<string | number>) =>
                      handleChange(e)
                    }
                    label="Véhicule"
                    sx={{
                      borderRadius: "8px",
                      "& .MuiSelect-select": {
                        padding: "10px 14px",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                      },
                    }}
                    aria-label="Sélectionner un véhicule"
                  >
                    {availableVehicles.map((vehicle) => (
                      <MenuItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.nom}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.vehicleId && (
                    <Typography color="error" variant="body2">
                      {formErrors.vehicleId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Date de début */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date de début (AAAA-MM-JJ)"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  fullWidth
                  placeholder="2025-03-28"
                  error={!!formErrors.startDate}
                  helperText={formErrors.startDate}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6b7280",
                    },
                  }}
                  aria-label="Entrer la date de début"
                />
              </Grid>

              {/* Date de fin */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date de fin (AAAA-MM-JJ)"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  fullWidth
                  placeholder="2025-03-29"
                  error={!!formErrors.endDate}
                  helperText={formErrors.endDate}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6b7280",
                    },
                  }}
                  aria-label="Entrer la date de fin"
                />
              </Grid>

              {/* Région */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Région"
                  name="regionName"
                  value={formData.regionName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  fullWidth
                  placeholder="Antananarivo"
                  error={!!formErrors.regionName}
                  helperText={formErrors.regionName}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6b7280",
                    },
                  }}
                  aria-label="Entrer la région"
                />
              </Grid>

              {/* Référence du contrat */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Référence du contrat"
                  name="contractReference"
                  value={formData.contractReference}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  fullWidth
                  placeholder="REF-001"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6b7280",
                    },
                  }}
                  aria-label="Entrer la référence du contrat"
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Notes supplémentaires..."
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6b7280",
                    },
                  }}
                  aria-label="Entrer des notes"
                />
              </Grid>

              {/* Statut */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.status}>
                  <InputLabel id="status-label" sx={{ color: "#6b7280" }}>
                    Statut
                  </InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={(e: SelectChangeEvent<string | number>) =>
                      handleChange(e)
                    }
                    label="Statut"
                    sx={{
                      borderRadius: "8px",
                      "& .MuiSelect-select": {
                        padding: "10px 14px",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                      },
                    }}
                    aria-label="Sélectionner le statut du proforma"
                  >
                    <MenuItem value="En attente">En attente</MenuItem>
                    <MenuItem value="Confirmé">Confirmé</MenuItem>
                    <MenuItem value="Annulé">Annulé</MenuItem>
                  </Select>
                  {formErrors.status && (
                    <Typography color="error" variant="body2">
                      {formErrors.status}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Boutons d'action */}
            <Box
              sx={{
                mt: isMobile ? 2 : 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <CancelButton
                variant="outlined"
                onClick={() =>
                  setFormData({
                    clientId: "",
                    vehicleId: "",
                    startDate: "",
                    endDate: "",
                    regionName: "",
                    contractReference: "",
                    notes: "",
                    status: "",
                  })
                }
                aria-label="Annuler la création du proforma"
              >
                Annuler
              </CancelButton>
              <PrimaryButton
                type="submit"
                variant="contained"
                disabled={submitting}
                aria-label="Créer le proforma"
              >
                {submitting ? "Création..." : "Créer"}
              </PrimaryButton>
            </Box>
          </form>

          {/* Lien pour télécharger le PDF */}
          {pdfUrl && (
            <Box sx={{ mt: 2 }}>
              <Link
                href={pdfUrl}
                download="proforma.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Télécharger le Proforma (PDF)
              </Link>
            </Box>
          )}
        </DashboardCard>

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
              backgroundColor:
                snackbarSeverity === "success" ? "#10b981" : "#ef4444",
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

export default CreateProforma;
