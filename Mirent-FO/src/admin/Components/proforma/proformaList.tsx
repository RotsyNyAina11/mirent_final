import React, { useEffect, useState } from "react";
import {
  Box,
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
  Modal,
  Stack,
  IconButton,
  Typography,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/store";
import { styled, createTheme } from "@mui/material/styles";
import {
  deleteProforma,
  fetchProformas,
} from "../../../redux/features/commande/commandeSlice";
import EditProformaForm from "../../Components/Commandes/EditProforma";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import logo from "../../../assets/horizontal.png";
import writtenNumber from "written-number";

interface Proforma {
  id: number;
  open: boolean;
  proformaNumber: string;
  client: {
    id: number;
    lastName: string;
    email?: string;
    phone: number;
    logo?: string;
  };
  contractReference?: string;
  regionName?: string;
  items: {
    id: number;
    vehicle?: { id: number; nom: string; immatriculation?: string };
    region?: { nom_region: string; nom_district: string };
    prix?: { prix: number };
    dateDepart?: string;
    dateRetour?: string;
    nombreJours?: number;
    subTotal?: number;
  }[];
  totalAmount: number;
  status: string;
  dateGeneration?: string;
  dateCreation?: string;
}

// Custom Theme (remains unchanged)
const theme = createTheme({
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
      styleOverrides: {
        root: { textTransform: "none", borderRadius: "8px" },
      },
    },
  },
});

// Styled Components (remains unchanged)
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

const ProformasList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    proformas = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.proformas);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for Edit Modal and selected item
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProformaId, setSelectedProformaId] = useState<number | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentProformaId, setCurrentProformaId] = useState<number | null>(
    null
  );

  // State for Snackbar notifications
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for filter inputs
  const [filterContractReference, setFilterContractReference] = useState("");
  const [filterClientName, setFilterClientName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // State for the preview dialog
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewProforma, setPreviewProforma] = useState<Proforma | null>(null);

  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [proformaToDeleteId, setProformaToDeleteId] = useState<number | null>(
    null
  );

  // Fetch proformas on component mount
  useEffect(() => {
    dispatch(fetchProformas());
  }, [dispatch]);

  // Handler for opening edit modal
  const handleEdit = (id: number) => {
    setSelectedProformaId(id);
    setOpenEditModal(true);
  };

  // Handler for closing edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedProformaId(null);
  };

  // Handler for initiating a proforma deletion (opens the confirmation dialog)
  const handleDeleteClick = (id: number) => {
    setProformaToDeleteId(id);
    setOpenConfirmDeleteDialog(true);
  };

  // Handler for confirming the deletion after the dialog is open
  const handleConfirmDelete = async () => {
    if (proformaToDeleteId === null) return;

    try {
      await dispatch(deleteProforma(proformaToDeleteId)).unwrap();
      setSnackbarMessage("Proforma supprimé avec succès !");
      setSnackbarSeverity("success");
      dispatch(fetchProformas());
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du proforma"
      );
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setOpenConfirmDeleteDialog(false);
      setProformaToDeleteId(null);
    }
  };

  // Handler for closing the delete confirmation dialog without deleting
  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
    setProformaToDeleteId(null); // Reset the ID
  };

  // Handler for closing snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Pagination Handlers
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Utility function to convert image to base64 for PDF
  const convertImageToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (err) => reject(err);
    });
  };

  // Function to export a single proforma to PDF
  const exportSingleProformaToPDF = async (
    proforma: Proforma & { open: boolean }
  ) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "normal");

    const logoBase64 = await convertImageToBase64(logo);
    doc.addImage(logoBase64, "PNG", 14, 10, 50, 20);

    const clientInfo = [
      `Client : ${proforma.client.lastName}`,
      `Email : ${proforma.client.email || "N/A"}`,
      `Téléphone : ${proforma.client.phone}`,
    ];
    doc.setFontSize(12);
    clientInfo.forEach((line, index) => {
      const textWidth = doc.getTextWidth(line);
      doc.text(line, pageWidth - textWidth - 14, 15 + index * 6);
    });

    doc.setFontSize(16);
    const title = `Proforma N° ${proforma.proformaNumber}`;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 66);

    let totalGlobal = 0;
    const bodyData = proforma.items.map((item) => {
      const prixTotal =
        item.nombreJours && item.prix?.prix
          ? item.nombreJours * item.prix.prix
          : 0;

      totalGlobal += prixTotal;

      return [
        proforma.contractReference || "N/A",
        item.region?.nom_district || "N/A",
        item.vehicle?.nom || "N/A",
        item.vehicle?.immatriculation || "N/A",
        item.dateDepart || "N/A",
        item.dateRetour || "N/A",
        item.nombreJours?.toString() || "0",
        item.prix?.prix?.toString() || "N/A",
        prixTotal.toFixed(2).toString() || "0",
      ];
    });

    autoTable(doc, {
      startY: 80,
      head: [
        [
          { content: "Réf.", styles: { cellWidth: 17 } },
          { content: "Destination", styles: { cellWidth: 23 } },
          { content: "Véhicule", styles: { cellWidth: 18 } },
          { content: "Numéro", styles: { cellWidth: 18 } },
          { content: "Départ", styles: { cellWidth: 22 } },
          { content: "Retour", styles: { cellWidth: 22 } },
          { content: "Jrs", styles: { cellWidth: 10, halign: "right" } },
          { content: "Prix U", styles: { cellWidth: 25, halign: "right" } },
          { content: "Prix Total", styles: { cellWidth: 25, halign: "right" } },
        ],
      ],
      body: bodyData.map((row) => [
        { content: row[0], styles: { cellWidth: 17 } },
        { content: row[1], styles: { cellWidth: 23 } },
        { content: row[2], styles: { cellWidth: 18 } },
        { content: row[3], styles: { cellWidth: 18 } },
        { content: row[4], styles: { cellWidth: 22 } },
        { content: row[5], styles: { cellWidth: 22 } },
        { content: row[6], styles: { cellWidth: 10, halign: "right" } },
        { content: row[7], styles: { cellWidth: 25, halign: "right" } },
        { content: row[8], styles: { cellWidth: 25, halign: "right" } },
      ]),
      columnStyles: {
        0: { cellWidth: 17 },
        1: { cellWidth: 23 },
        2: { cellWidth: 18 },
        3: { cellWidth: 18 },
        4: { cellWidth: 22 },
        5: { cellWidth: 22 },
        6: { cellWidth: 10 },
        7: { cellWidth: 25 },
        8: { cellWidth: 25 },
      },

      didDrawPage: (data) => {
        const finalY = data.cursor ? data.cursor.y + 10 : 10;
        writtenNumber.defaults.lang = "fr";
        const montantEnLettres = writtenNumber(totalGlobal);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`MONTANT TOTAL : ${totalGlobal.toFixed(2)} Ar`, 20, finalY, {
          align: "left",
        });
        doc.setFont("helvetica", "normal");

        doc.setFontSize(12);
        doc.text(
          `Arrêtée la présente proforma à la somme de : ${montantEnLettres} ariary`,
          20,
          finalY + 6
        );
        doc.setFont("helvetica", "normal");

        doc.setFontSize(10);
        const aujourdHui = new Date();
        const moisFrancais = [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ];

        const jour = aujourdHui.getDate();
        const mois = moisFrancais[aujourdHui.getMonth()];
        const annee = aujourdHui.getFullYear();

        const dateFormattee = `${jour} ${mois} ${annee}`;
        const texteLieuDate = `Antananarivo le ${dateFormattee}`;

        const pageWidth = doc.internal.pageSize.getWidth();
        const rightMargin = 20;
        const positionY = finalY + 30;
        doc.text(texteLieuDate, pageWidth - rightMargin, positionY, {
          align: "right",
        });
        doc.setFontSize(12);

        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(14, 260, pageWidth - 14, 260);
      },
    });

    const footerLines = [
      "Email: mirent.mdg@gmail.com",
      "Téléphone: +261 38 13 690 04",
      "NIF: 7018487985     Stat: 49295 11 024 0 10341",
      "Adresse: LOT II P 136 Ter Avaradoha Antananarivo",
      "RIB: 00005 00011 7423852000163",
    ];
    let footerY = 270;
    doc.setFontSize(8);
    doc.setTextColor(100);

    doc.setFont("helvetica", "bold");
    footerLines.forEach((line, index) => {
      const textWidth = doc.getTextWidth(line);
      doc.text(line, (pageWidth - textWidth) / 2, footerY + index * 5);
    });

    doc.save(`Proforma-${proforma.proformaNumber}.pdf`);
  };

  // Handlers for Dialog preview
  const handleOpenPreviewDialog = (proforma: Proforma) => {
    setPreviewProforma(proforma);
    setOpenPreviewDialog(true);
  };

  const handleClosePreviewDialog = () => {
    setOpenPreviewDialog(false);
    setPreviewProforma(null);
  };

  // --- Filtering Logic ---
  const filteredProformas = proformas.filter((proforma) => {
    const matchesContractReference = filterContractReference
      ? proforma.contractReference
          ?.toLowerCase()
          .includes(filterContractReference.toLowerCase())
      : true;

    const matchesClientName = filterClientName
      ? proforma.client.lastName
          .toLowerCase()
          .includes(filterClientName.toLowerCase())
      : true;

    const matchesStatus = filterStatus
      ? proforma.status.toLowerCase() === filterStatus.toLowerCase()
      : true;

    return matchesContractReference && matchesClientName && matchesStatus;
  });

  // --- Pagination Logic (applied after filtering) ---
  const paginatedProformas = filteredProformas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "700", color: "#1976d2", marginBottom: 2 }}
        >
          Listes du proforma
        </Typography>
      </Grid>

      {/* --- Filter Section --- */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Filtrer par Référence Contrat"
            variant="outlined"
            fullWidth
            value={filterContractReference}
            onChange={(e) => {
              setFilterContractReference(e.target.value);
              setPage(0); // Reset page on filter change
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Filtrer par Nom Client"
            variant="outlined"
            fullWidth
            value={filterClientName}
            onChange={(e) => {
              setFilterClientName(e.target.value);
              setPage(0); // Reset page on filter change
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Filtrer par Statut</InputLabel>
            <Select
              value={filterStatus}
              label="Filtrer par Statut"
              onChange={(e) => {
                setFilterStatus(e.target.value as string);
                setPage(0); // Reset page on filter change
              }}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="pending">En attente</MenuItem>
              <MenuItem value="confirmed">Confirmé</MenuItem>
              <MenuItem value="cancelled">Annulé</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {/* --- End Filter Section --- */}

      <Box sx={{ backgroundColor: "#f9fafb" }}>
        {/* Only render table if there are proformas, even if filtered */}
        {proformas.length > 0 && (
          <DashboardCard sx={{ marginTop: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ padding: 2 }}
            ></Stack>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: isMobile ? 300 : 600 }}
                aria-label="tableau des proformas"
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Référence
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Véhicule
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Numéro
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Destination
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      D.Départ
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      D.Retour
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Jours
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Prix U
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Prix Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* Display message if no proformas match filter criteria */}
                  {paginatedProformas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                        Aucune proforma trouvée pour les critères de filtre
                        actuels.
                      </TableCell>
                    </TableRow>
                  )}
                  {/* Render paginated and filtered proformas */}
                  {paginatedProformas.map((proforma) => (
                    <TableRow key={proforma.id}>
                      <TableCell>{proforma.contractReference}</TableCell>
                      <TableCell>
                        {proforma.items[0]?.vehicle?.nom || "N/A"}
                      </TableCell>
                      <TableCell>
                        {proforma.items[0]?.vehicle?.immatriculation}
                      </TableCell>
                      <TableCell>
                        {proforma.items[0]?.region?.nom_region}
                      </TableCell>
                      <TableCell>{proforma.items[0]?.dateDepart}</TableCell>
                      <TableCell>{proforma.items[0]?.dateRetour}</TableCell>
                      <TableCell>
                        {proforma.items[0]?.nombreJours || 0}
                      </TableCell>
                      <TableCell>{proforma.items[0]?.prix?.prix}</TableCell>
                      <TableCell>{proforma.items[0]?.subTotal} Ar</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              handleEdit(proforma.id);
                              setSelectedItem(proforma.items[0]);
                              setCurrentProformaId(proforma.id);
                            }}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => handleDeleteClick(proforma.id)} // Change this line
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => handleOpenPreviewDialog(proforma.id)}
                            color="info"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* TablePagination for filtered items */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProformas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              labelRowsPerPage="Lignes par page :"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
              }
            />
          </DashboardCard>
        )}
      </Box>

      {/* Edit Proforma Modal */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : "60%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          {selectedProformaId !== null && selectedItem && (
            <EditProformaForm
              item={selectedItem}
              onClose={handleCloseEditModal}
              onSave={(updatedItem) => {
                console.log(
                  "Item updated locally. Consider dispatching to Redux:",
                  updatedItem
                );
                handleCloseEditModal();
                dispatch(fetchProformas());
              }}
            />
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openConfirmDeleteDialog}
        onClose={handleCloseConfirmDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmer la suppression ?"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer ce proforma ? Cette action est
            irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Proforma Dialog */}
      <Dialog
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#1f2937" }}>
          Prévisualisation du Proforma N°{" "}
          {previewProforma?.proformaNumber || ""}
        </DialogTitle>
        <DialogContent dividers sx={{ padding: 2 }}>
          {previewProforma ? (
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Informations Client:
              </Typography>
              <Typography>
                {previewProforma.client.logo ? (
                  <img
                    src={previewProforma.client.logo}
                    alt="Client Logo"
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  "Aucun logo disponible"
                )}
              </Typography>
              <Typography>Client: {previewProforma.client.lastName}</Typography>
              <Typography>
                Email: {previewProforma.client.email || "N/A"}
              </Typography>
              <Typography>Téléphone: {previewProforma.client.phone}</Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Détails des Articles:
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="détails des articles">
                  <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
                    <TableRow>
                      <TableCell>Référence</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell>Véhicule</TableCell>
                      <TableCell>Immatriculation</TableCell>
                      <TableCell>Date Départ</TableCell>
                      <TableCell>Date Retour</TableCell>
                      <TableCell>Jours</TableCell>
                      <TableCell>Prix Unitaire</TableCell>
                      <TableCell>Prix Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewProforma.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {previewProforma.contractReference || "N/A"}
                        </TableCell>
                        <TableCell>
                          {item.region?.nom_region || "N/A"}
                        </TableCell>
                        <TableCell>{item.vehicle?.nom || "N/A"}</TableCell>
                        <TableCell>
                          {item.vehicle?.immatriculation || "N/A"}
                        </TableCell>
                        <TableCell>{item.dateDepart || "N/A"}</TableCell>
                        <TableCell>{item.dateRetour || "N/A"}</TableCell>
                        <TableCell>{item.nombreJours || 0}</TableCell>
                        <TableCell>{item.prix?.prix || "N/A"}</TableCell>
                        <TableCell>{item.subTotal || 0} Ar</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="h6" align="right" sx={{ mt: 3, mr: 2 }}>
                Montant Total:{previewProforma.totalAmount.toFixed(2)} Ar
              </Typography>
              <Typography variant="body1" align="right" sx={{ mr: 2 }}>
                Arrêtée la présente proforma à la somme de :{" "}
                {writtenNumber(previewProforma.totalAmount, { lang: "fr" })}
                ariary
              </Typography>
              <Typography variant="body2" align="right" sx={{ mt: 3, mr: 3 }}>
                Antananarivo le{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          ) : (
            <Typography>
              Aucun proforma sélectionné pour la prévisualisation.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreviewDialog} color="error">
            Fermer
          </Button>
          <Button
            onClick={() =>
              previewProforma &&
              exportSingleProformaToPDF({ ...previewProforma, open: false })
            }
            color="success"
            startIcon={<DownloadIcon />}
          >
            Télécharger PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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
    </Container>
  );
};

export default ProformasList;
