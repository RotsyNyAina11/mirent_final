import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Toolbar,
  Button,
  ButtonGroup,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  useTheme,
  styled,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import { AppDispatch, RootState } from "../../redux/store";
import {
  createProforma,
  fetchAvailableVehicles,
} from "../../redux/features/commande/commandeSlice";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Interface pour définir le type de données d'un client
interface Client {
  id: number;
  lastName: string;
  email?: string;
  phone?: number;
  logo?: string;
}
//Interface pour definir le type de données d'une commande
interface ProformaForm {
  clientId: number | "";
  vehicleId: number | "";
  startDate: string;
  endDate: string;
  regionName: string;
  contractReference: string;
  notes: string;
  status: "Brouillon" | "Envoyée" | "Confirmée" | "Annulée" | "";
}
interface FormErrors {
  clientId?: string;
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  regionName?: string;
  nombreJours?: number;
  status?: string;
  contractReference?: string; // Added property
}

export enum ProformaStatus {
  BROUILLON = "Brouillon",
  ENVOYEE = "Envoyée",
  CONFIRMEE = "Confirmée",
  ANNULEE = "Annulée",
}
interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlace: number;
  imageUrl: string;
  type: {
    id: number;
    type: string;
  };
  status: {
    id: number;
    status: string;
  };
}

const ButtonActions = {
  SEND_EMAIL: "SEND_EMAIL",
  CONFIRM: "CONFIRM",
  PREVIEW: "PREVIEW",
  CANCEL: "CANCEL",
  DEVIS: "DEVIS",
  SENT: "SENT",
  BON_COMMANDE: "BON_COMMANDE",
};

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

// Composant principal de la page de commande
const OrderPage: React.FC = () => {
  // États locaux
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.proformas);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicules, setVehicle] = useState<Vehicle[]>([]);
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
  // Removed unused snackbarMessage state
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(
    null
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [previewProforma, setPreviewProforma] = useState<ProformaForm | null>(
    null
  );
  const [creationDate, setCreationDate] = useState(new Date());
  const [formType, setFormType] = useState("proforma");

  //  Charger les clients au montage
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:3000/clients");
        const data = await response.json();
        if (response.ok) {
          setClients(data);
        } else {
          // Removed snackbarMessage usage
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        // Removed snackbarMessage usage
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles");
        const data = await response.json();
        if (response.ok) {
          setVehicle(data);
        } else {
          // Removed snackbarMessage usage
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        // Removed snackbarMessage usage
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    fetchAvailableVehicles();
  }, []);

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
    if (!formData.contractReference) {
      errors.contractReference = "Veuillez entrer une référence de contrat";
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
      // Removed snackbarMessage usage
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

      // Télécharger automatiquement le PDF
      const link = document.createElement("a");
      link.href = pdfUrl;

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
      // Removed snackbarMessage usage
      setSnackbarSeverity("success");
    } catch (error: any) {
      // Removed snackbarMessage usage
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
    setSubmitting(false);
  };

  const handleButtonClick = (action: string, index?: number) => {
    if (index !== undefined) {
      setActiveButtonIndex(index);
    }
    switch (action) {
      case ButtonActions.SEND_EMAIL:
        console.log("Envoyer par email");
        break;
      case ButtonActions.CONFIRM:
        console.log("Confirmer la commande");
        setConfirmationMessage("Commande confirmée !");
        setTimeout(() => {
          setConfirmationMessage("");
        }, 3000);
        break;
      case ButtonActions.PREVIEW:
        console.log("Prévisualiser");
        break;
      case ButtonActions.CANCEL:
        console.log("Annuler");
        break;
      case ButtonActions.DEVIS:
        console.log("Devis");
        setFormType("devis");
        break;
      case ButtonActions.SENT:
        console.log("Envoyé");
        break;
      case ButtonActions.BON_COMMANDE:
        console.log("Bon de commande");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setCreationDate(new Date());
  }, []);
  const formattedDate = `${creationDate.getDate()}/${
    creationDate.getMonth() + 1
  }/${creationDate.getFullYear()}`;

  {
    /*Fonction pour prévisualiser d'un proforma*/
  }

  const handlePreview = () => {
    // Ici tu peux récupérer les données du proforma à partir du Redux store ou d’un appel API
    const selectedProforma = previewProforma; // Utilisation de l'état local pour la prévisualisation

    // Afficher la modale ou naviguer vers une page dédiée
    setPreviewProforma(selectedProforma); // state local
    setOpenPreviewModal(true); // ouvre une modale
  };

  // Rendu du composant
  return (
    <div>
      {/* Barre d'outils avec des boutons */}
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              startIcon={<SendIcon />}
              variant={activeButtonIndex === 0 ? "contained" : "outlined"}
              onClick={() => handleButtonClick(ButtonActions.SEND_EMAIL, 0)}
            >
              Envoyer par email
            </Button>
            <Button
              variant={activeButtonIndex === 1 ? "contained" : "outlined"}
              onClick={() => {
                handleButtonClick(ButtonActions.CONFIRM, 1);
                // Call the function here
              }}
            >
              Confirmer
            </Button>

            <Button
              variant={activeButtonIndex === 2 ? "contained" : "outlined"}
              onClick={() => {
                handleButtonClick(ButtonActions.PREVIEW, 2);
                handlePreview; // Appel de la fonction
              }}
            >
              Preview
            </Button>

            <Button
              variant={activeButtonIndex === 3 ? "contained" : "outlined"}
              onClick={() => handleButtonClick(ButtonActions.CANCEL, 3)}
            >
              Annuler
            </Button>
          </ButtonGroup>
        </Box>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <Button
            variant={activeButtonIndex === 4 ? "contained" : "outlined"}
            onClick={() => handleButtonClick(ButtonActions.DEVIS, 4)}
          >
            Devis
          </Button>
          <Button
            variant={activeButtonIndex === 5 ? "contained" : "outlined"}
            onClick={() => handleButtonClick(ButtonActions.SENT, 5)}
          >
            Envoyé
          </Button>
          <Button
            variant={activeButtonIndex === 6 ? "contained" : "outlined"}
            onClick={() => handleButtonClick(ButtonActions.BON_COMMANDE, 6)}
          >
            Bon de commande
          </Button>
        </ButtonGroup>
      </Toolbar>
      {confirmationMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "lightgreen",
            padding: "20px",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          {confirmationMessage}
        </div>
      )}
      <Typography variant="body1" paragraph sx={{ fontSize: "0.9rem" }}>
        Ici, vous pouvez gérer les commandes de location de votre agence.
      </Typography>
      {/* Message de chargement ou d'erreur */}
      {loading && (
        <>
          <Typography sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Chargement des clients...
          </Typography>
          <Typography sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}>
            Chargement des véhicules...
          </Typography>
        </>
      )}

      {error && !loading && (
        <Typography
          color="error"
          sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}
        >
          Erreur : {error.message || String(error)}
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

      {!loading && !error && vehicules.length === 0 && (
        <Typography
          color="warning"
          sx={{ mb: 2, fontSize: isMobile ? "0.9rem" : "1rem" }}
        >
          Aucun véhicule disponible.
        </Typography>
      )}

      {/* Contenu principal de la page */}

      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={12}>
            {/* Carte pour les détails de la commande */}
            <Card
              sx={{
                width: "100%",
                margin: "auto",
                padding: 2,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <DashboardCard sx={{ p: isMobile ? 2 : 3 }}>
                  <form onSubmit={handleSubmit}>
                    <Typography variant="h5" fontWeight="bold">
                      {formType === "proforma" ? "Proforma" : "Devis"}
                    </Typography>

                    <Grid item xs={3} marginTop={3}>
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

                    <Grid container spacing={2} sx={{ marginTop: 1 }}>
                      <Grid item xs={6}></Grid>
                      <Grid item xs={6} sm={6}>
                        <TextField
                          sx={{ mb: 2, mx: "auto" }}
                          fullWidth
                          variant="filled"
                          name="date"
                          label="Date de création"
                          value={formattedDate}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        {/*Vehicule*/}
                        <FormControl
                          fullWidth
                          error={!!formErrors.vehicleId}
                          sx={{ mb: 2, mx: "auto" }}
                        >
                          <InputLabel
                            id="vehicle-label"
                            sx={{ color: "#6b7280" }}
                          >
                            Véhicule
                          </InputLabel>
                          <Select
                            labelId="vehicle-label"
                            name="vehicleId"
                            value={formData.vehicleId || ""} // Assurez-vous qu'il y a une valeur par défaut
                            variant="standard"
                            onChange={(e: SelectChangeEvent<string | number>) =>
                              handleChange(e)
                            }
                            label="Véhicule"
                            aria-label="Sélectionner un véhicule"
                          >
                            {vehicules && vehicules.length > 0 ? (
                              vehicules.map((vehicle) => (
                                <MenuItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.nom}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>
                                Aucun véhicule disponible
                              </MenuItem>
                            )}
                          </Select>
                          {formErrors.vehicleId && (
                            <Typography color="error" variant="body2">
                              {formErrors.vehicleId}
                            </Typography>
                          )}
                        </FormControl>

                        <TextField
                          sx={{ mb: 2, mx: "auto" }}
                          label="Région"
                          name="regionName"
                          value={formData.regionName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e)
                          }
                          fullWidth
                          placeholder="Antananarivo"
                          variant="standard"
                          error={!!formErrors.regionName}
                          helperText={formErrors.regionName}
                          aria-label="Entrer la région"
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <TextField
                            label="Date de début"
                            name="startDate"
                            value={formData.startDate}
                            variant="standard"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange(e)}
                            fullWidth
                            type="date"
                            error={!!formErrors.startDate}
                            helperText={formErrors.startDate}
                            aria-label="Entrer la date de début"
                            focused
                          />

                          <TextField
                            label="Date de fin"
                            name="endDate"
                            value={formData.endDate}
                            type="date"
                            variant="standard"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleChange(e)}
                            fullWidth
                            error={!!formErrors.endDate}
                            helperText={formErrors.endDate}
                            aria-label="Entrer la date de fin"
                            focused
                          />
                        </Box>
                        <TextField
                          label="Référence du contrat"
                          name="contractReference"
                          variant="standard"
                          value={formData.contractReference}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e)
                          }
                          fullWidth
                          placeholder="REF-001"
                          aria-label="Entrer la référence du contrat"
                        />
                        <TextField
                          label="Notes"
                          name="notes"
                          value={formData.notes}
                          variant="standard"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e)
                          }
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Notes supplémentaires..."
                          aria-label="Entrer des notes"
                        />
                        <FormControl fullWidth error={!!formErrors.status}>
                          <InputLabel
                            id="status-label"
                            sx={{ color: "#6b7280" }}
                            variant="standard"
                          >
                            Statut
                          </InputLabel>
                          <Select
                            labelId="status-label"
                            name="status"
                            variant="standard"
                            value={formData.status}
                            onChange={(e: SelectChangeEvent<string | number>) =>
                              handleChange(e)
                            }
                            label="Statut"
                            aria-label="Sélectionner le statut du proforma"
                          >
                            <MenuItem value={ProformaStatus.BROUILLON}>
                              Brouillon
                            </MenuItem>
                            <MenuItem value={ProformaStatus.ENVOYEE}>
                              Envoyée
                            </MenuItem>
                            <MenuItem value={ProformaStatus.CONFIRMEE}>
                              Confirmée{" "}
                            </MenuItem>
                            <MenuItem value={ProformaStatus.ANNULEE}>
                              Annulée
                            </MenuItem>
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
                <Dialog
                  open={openPreviewModal}
                  onClose={() => setOpenPreviewModal(false)}
                  fullWidth
                  maxWidth="md"
                >
                  <DialogTitle>Aperçu du Proforma</DialogTitle>
                  <DialogContent>
                    <Typography>
                      Référence : {previewProforma?.contractReference}
                    </Typography>
                    <Typography>
                      Voiture : {previewProforma?.vehicleId}
                    </Typography>
                    <Typography>
                      Client : {previewProforma?.clientId}
                    </Typography>
                    <Typography>
                      Date départ : {previewProforma?.startDate}
                    </Typography>
                    <Typography>
                      Date retour : {previewProforma?.endDate}
                    </Typography>
                    <Typography>
                      Prix total : {previewProforma?.totalAmount} Ar
                    </Typography>
                    {/* Ajoute les autres champs que tu veux afficher */}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenPreviewModal(false)}>
                      Fermer
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Snackbar de succès ou d'erreur */}
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={3000}
                  onClose={() => setOpenSnackbar(false)}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert
                    severity="success"
                    sx={{ width: "100%" }}
                    onClose={() => setOpenSnackbar(false)}
                  >
                    Le proforma a été créé avec succès !
                  </Alert>
                </Snackbar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default OrderPage;
