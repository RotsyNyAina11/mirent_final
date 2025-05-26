import React, { useState, useEffect, ChangeEvent } from "react";
import mirentLogo from "../../../assets/horizontal.png";
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import jsPDF from "jspdf";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  createProforma,
  fetchAvailableVehicles,
} from "../../../redux/features/proforma/proformaSlice";

// Thème personnalisé
const customTheme = createTheme({
  palette: {
    primary: { main: "#3b82f6" },
    secondary: { main: "#ef4444" },
    background: { default: "#f9fafb" },
    text: { primary: "#1f2937", secondary: "#6b7280" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: "#1f2937" },
    h6: { fontWeight: 600, color: "#1f2937" },
    body1: { fontSize: "0.9rem", color: "#1f2937" },
    body2: { fontSize: "0.85rem", color: "#6b7280" },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", borderRadius: "8px" } },
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
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
  "&.Mui-disabled": {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[600],
  },
}));

const CancelButton = styled(Button)(() => ({
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

const PreviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  marginTop: theme.spacing(3),
}));

interface Client {
  id: number;
  lastName: string;
  email?: string;
  phone?: string;
}

interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  type?: { type: string };
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [clients, setClients] = useState<Client[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
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
  const [invoiceCounter, setInvoiceCounter] = useState(42); // Compteur pour le numéro de facture (à remplacer par une logique plus robuste)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:3000/clients");
        const data = await response.json();
        if (response.ok) setClients(data);
        else throw new Error("Erreur lors du chargement des clients");
      } catch (error) {
        setSnackbarMessage(
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération des clients"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchAllVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles");
        const data = await response.json();
        if (response.ok) setAllVehicles(data);
        else throw new Error("Erreur lors du chargement des véhicules");
      } catch (error) {
        setSnackbarMessage(
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération des véhicules"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchAllVehicles();
  }, []);

  useEffect(() => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const startDateValid =
      formData.startDate && dateRegex.test(formData.startDate);
    const endDateValid = formData.endDate && dateRegex.test(formData.endDate);

    if (startDateValid && endDateValid) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (
        !isNaN(startDate.getTime()) &&
        !isNaN(endDate.getTime()) &&
        endDate > startDate
      ) {
        dispatch(
          fetchAvailableVehicles({
            dateDepart: formData.startDate,
            dateRetour: formData.endDate,
          })
        );
      }
    }
  }, [formData.startDate, formData.endDate, dispatch]);

  const vehiclesToDisplay =
    formData.startDate && formData.endDate ? availableVehicles : allVehicles;

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string | number>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.clientId) errors.clientId = "Veuillez sélectionner un client";
    if (!formData.vehicleId)
      errors.vehicleId = "Veuillez sélectionner un véhicule";
    if (!formData.startDate)
      errors.startDate = "Veuillez entrer une date de début";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.startDate))
      errors.startDate = "Format de date invalide (AAAA-MM-JJ)";
    if (!formData.endDate) errors.endDate = "Veuillez entrer une date de fin";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.endDate))
      errors.endDate = "Format de date invalide (AAAA-MM-JJ)";
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
    if (!formData.regionName) errors.regionName = "Veuillez entrer une région";
    if (!formData.status) errors.status = "Veuillez sélectionner un statut";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

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

    const selectedVehicle = vehiclesToDisplay.find(
      (vehicle) => vehicle.id === formData.vehicleId
    );
    if (!selectedVehicle) {
      setSnackbarMessage("Véhicule non trouvé");
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
          vehicleCriteria: {
            marque: selectedVehicle.marque,
            modele: selectedVehicle.modele,
            type: selectedVehicle.type?.type,
          },
          regionName: formData.regionName,
          dateDepart: formData.startDate,
          dateRetour: formData.endDate,
        },
      ],
    };

    try {
      const result = await dispatch(createProforma(proformaData)).unwrap();
      const pdfBase64 = result.pdfBase64;
      const pdfBlob = new Blob([Buffer.from(pdfBase64, "base64")], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);

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
      setInvoiceCounter((prev) => prev + 1);
    } catch (error: any) {
      setSnackbarMessage(
        error.message || "Erreur lors de la création du proforma"
      );
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
    setSubmitting(false);
  };

  // Fonction pour générer un numéro de facture automatiquement
  const generateInvoiceNumber = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Mois sur 2 chiffres
    const year = now.getFullYear();
    const invoiceNumber = String(invoiceCounter).padStart(3, "0"); // Numéro sur 3 chiffres
    return `MRT ${invoiceNumber}/PROF/${month}/${year}`;
  };

  const generatePreview = () => {
    const selectedClient = clients.find(
      (client) => client.id === formData.clientId
    );
    const selectedVehicle = vehiclesToDisplay.find(
      (vehicle) => vehicle.id === formData.vehicleId
    );
    const currentDate = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const days =
      formData.startDate && formData.endDate
        ? Math.ceil(
            (new Date(formData.endDate).getTime() -
              new Date(formData.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0;
    const unitPrice = 200000;
    const totalPrice = days * unitPrice;

    return (
      <Box>
        {/* En-tête */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <img src={mirentLogo} alt="MIRent Logo" style={{ height: "40px" }} />
          <Typography variant="body2">
            Client:{" "}
            {selectedClient ? selectedClient.lastName : "Non sélectionné"}
          </Typography>
        </Box>
        <Typography variant="h6" align="center" fontWeight="bold" mb={1}>
          FACTURE PROFORMA N° {generateInvoiceNumber()}
        </Typography>
        <Typography variant="body2" align="center" mb={2}>
          {formData.contractReference || "Non spécifiée"}
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Réf.</TableCell>
                <TableCell>Véhicule</TableCell>
                <TableCell>Numéro</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Jour</TableCell>
                <TableCell>Carburant</TableCell>
                <TableCell>Prix unitaire</TableCell>
                <TableCell>Prix total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  {selectedVehicle
                    ? `${selectedVehicle.marque} ${selectedVehicle.modele}`
                    : "Non sélectionné"}
                </TableCell>
                <TableCell>{selectedVehicle?.nom || "N/A"}</TableCell>
                <TableCell>{formData.regionName || "Non spécifiée"}</TableCell>
                <TableCell>{formData.startDate || "Non spécifiée"}</TableCell>
                <TableCell>{days || "N/A"}</TableCell>
                <TableCell>2</TableCell>
                <TableCell>{unitPrice.toLocaleString()} Ar</TableCell>
                <TableCell>{totalPrice.toLocaleString()} Ar</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={8} align="right">
                  <strong>TOTAL</strong>
                </TableCell>
                <TableCell>
                  <strong>{totalPrice.toLocaleString()} Ar</strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={9}>
                  <Typography variant="body2">
                    Montant total avec carburant:{" "}
                    <strong>{totalPrice.toLocaleString()} Ar</strong>
                  </Typography>
                  <Typography variant="body2">
                    Arrêté la présente facture proforma à la somme de :{" "}
                    <strong>QUATRE CENT MILLE ARIARY</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3}>
          <Typography variant="body2">
            {formData.regionName || "Antananarivo"}, le {currentDate}
          </Typography>
          <Typography variant="body2">Pour Mirent,</Typography>
        </Box>
      </Box>
    );
  };

  const downloadPreviewAsPDF = () => {
    const doc = new jsPDF();
    const selectedClient = clients.find(
      (client) => client.id === formData.clientId
    );
    const selectedVehicle = vehiclesToDisplay.find(
      (vehicle) => vehicle.id === formData.vehicleId
    );
    const currentDate = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const days =
      formData.startDate && formData.endDate
        ? Math.ceil(
            (new Date(formData.endDate).getTime() -
              new Date(formData.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0;
    const unitPrice = 200000;
    const totalPrice = days * unitPrice;

    const img = new Image();
    img.src = "../../assets/horizontal.png";
    doc.addImage(img, "PNG", 20, 10, 40, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Client: ${selectedClient ? selectedClient.lastName : "Non sélectionné"}`,
      150,
      20
    );
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`FACTURE PROFORMA N° ${generateInvoiceNumber()}`, 105, 40, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text(formData.contractReference || "Non spécifiée", 105, 50, {
      align: "center",
    });

    const tableData = [
      [
        "1",
        selectedVehicle
          ? `${selectedVehicle.marque} ${selectedVehicle.modele}`
          : "Non sélectionné",
        selectedVehicle?.nom || "N/A",
        formData.regionName || "Non spécifiée",
        formData.startDate || "Non spécifiée",
        days.toString() || "N/A",
        "2",
        unitPrice.toLocaleString() + " Ar",
        totalPrice.toLocaleString() + " Ar",
      ],
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "TOTAL",
        totalPrice.toLocaleString() + " Ar",
      ],
    ];

    (doc as any).autoTable({
      startY: 60,
      head: [
        [
          "Réf.",
          "Moto",
          "Numéro",
          "Destination",
          "Date",
          "Jour",
          "Carburant",
          "Prix unitaire",
          "Prix total",
        ],
      ],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [200, 200, 200] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 60;
    doc.setFontSize(10);
    doc.text(
      `Montant total avec carburant: ${totalPrice.toLocaleString()} Ar`,
      20,
      finalY + 10
    );
    doc.text(
      "Arrêté la présente facture proforma à la somme de : QUATRE CENT MILLE ARIARY",
      20,
      finalY + 20
    );
    doc.text(
      `${formData.regionName || "Antananarivo"}, le ${currentDate}`,
      20,
      finalY + 40
    );
    doc.text("Pour Mirent,", 20, finalY + 50);

    doc.save("proforma-preview.pdf");
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          p: isMobile ? 2 : 4,
        }}
      >
        {loading && (
          <Typography sx={{ mb: 2 }}>Chargement des données...</Typography>
        )}
        {error && !loading && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {!loading && !error && clients.length === 0 && (
          <Typography color="warning" sx={{ mb: 2 }}>
            Aucun client disponible.
          </Typography>
        )}
        {!loading && !error && allVehicles.length === 0 && (
          <Typography color="warning" sx={{ mb: 2 }}>
            Aucun véhicule disponible.
          </Typography>
        )}

        <Grid container spacing={3} mb={isMobile ? 2 : 4}>
          <Grid item xs={12}>
            <Typography variant="h4">Créer un Proforma</Typography>
            <Typography variant="body1">
              Remplissez les informations ci-dessous pour créer un nouveau
              proforma.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={isMobile ? 2 : 3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.clientId}>
                      <InputLabel id="client-label">Client</InputLabel>
                      <Select
                        labelId="client-label"
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        label="Client"
                        sx={{
                          borderRadius: "8px",
                          "& .MuiSelect-select": { padding: "10px 14px" },
                        }}
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

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.vehicleId}>
                      <InputLabel id="vehicle-label">Véhicule</InputLabel>
                      <Select
                        labelId="vehicle-label"
                        name="vehicleId"
                        value={formData.vehicleId}
                        onChange={handleChange}
                        label="Véhicule"
                        sx={{
                          borderRadius: "8px",
                          "& .MuiSelect-select": { padding: "10px 14px" },
                        }}
                      >
                        {vehiclesToDisplay.length === 0 && (
                          <MenuItem disabled value="">
                            {formData.startDate && formData.endDate
                              ? "Aucun véhicule disponible pour ces dates"
                              : "Aucun véhicule disponible"}
                          </MenuItem>
                        )}
                        {vehiclesToDisplay.map((vehicle) => (
                          <MenuItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.nom} ({vehicle.marque} {vehicle.modele})
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

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date de début (AAAA-MM-JJ)"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      fullWidth
                      placeholder="2025-04-05"
                      error={!!formErrors.startDate}
                      helperText={formErrors.startDate}
                      sx={{ "& .MuiInputBase-root": { borderRadius: "8px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date de fin (AAAA-MM-JJ)"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      fullWidth
                      placeholder="2025-04-07"
                      error={!!formErrors.endDate}
                      helperText={formErrors.endDate}
                      sx={{ "& .MuiInputBase-root": { borderRadius: "8px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Région"
                      name="regionName"
                      value={formData.regionName}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Antananarivo"
                      error={!!formErrors.regionName}
                      helperText={formErrors.regionName}
                      sx={{ "& .MuiInputBase-root": { borderRadius: "8px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Référence du contrat"
                      name="contractReference"
                      value={formData.contractReference}
                      onChange={handleChange}
                      fullWidth
                      placeholder="REF-001"
                      sx={{ "& .MuiInputBase-root": { borderRadius: "8px" } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Notes supplémentaires..."
                      sx={{ "& .MuiInputBase-root": { borderRadius: "8px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.status}>
                      <InputLabel id="status-label">Statut</InputLabel>
                      <Select
                        labelId="status-label"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Statut"
                        sx={{
                          borderRadius: "8px",
                          "& .MuiSelect-select": { padding: "10px 14px" },
                        }}
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

                <Box
                  sx={{
                    mt: 3,
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
                  >
                    Annuler
                  </CancelButton>
                  <PrimaryButton
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                  >
                    {submitting ? "Création..." : "Créer"}
                  </PrimaryButton>
                </Box>
              </form>

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
          </Grid>

          <Grid item xs={12} md={6}>
            <PreviewCard elevation={3}>
              {generatePreview()}
              <Box sx={{ mt: 2 }}>
                <PrimaryButton
                  variant="contained"
                  onClick={downloadPreviewAsPDF}
                >
                  Télécharger l'aperçu en PDF
                </PrimaryButton>
              </Box>
            </PreviewCard>
          </Grid>
        </Grid>

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
              "& .MuiAlert-icon": { color: "#fff" },
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
