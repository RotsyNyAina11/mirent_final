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
  Toolbar,
  InputAdornment,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/store";
import { styled, createTheme } from "@mui/material/styles";
import {
  deleteProforma,
  fetchProformas,
} from "../../../redux/features/commande/commandeSlice";
import EditProformaForm from "./EditProforma";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import logo from "../../../assets/horizontal.png";
import writtenNumber from "written-number";
import signatureImage from "../../../assets/signature.png";
import { ToastContainer } from "react-toastify";
import { Add, FileDownload, FilterList, Search } from "@mui/icons-material";
import Papa from "papaparse";

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
  backgroundColor: "#f9fafb", // Ou un autre gris comme '#f5f5f5'
  transition: "box-shadow 0.3s ease, transform 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transform: "scale(1.02)",
  },
}));

// Crée un composant TableRow stylisé
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  "&:hover": {
    // C'est ici que vous définissez le gris au survol
    backgroundColor: "#e0e0e0", // Un gris clair, par exemple
    opacity: 0.9,
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

const CancelButton = styled(Button)(({}) => ({
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

const FilterField = styled(TextField)(({}) => ({
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

const FormField = styled(TextField)(({}) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
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
  "& .MuiInputLabel-root": {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#3b82f6",
  },
  "& .MuiInputBase-input": {
    fontSize: "0.9rem",
    color: "#1f2937",
  },
}));

const ErrorText = styled(Typography)(({}) => ({
  color: "#ef4444",
  fontSize: "0.8rem",
  marginTop: "4px",
  marginLeft: "14px",
}));

// Crée un composant TableCell stylisé
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.secondary,
  padding: "12px 16px",
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
  const [selectedItem, setSelectedItem] = useState<any>(null); // This type might need to be more specific

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

  // États pour la barre d'outils des proformas
  const [searchProformaQuery, setSearchProformaQuery] = useState("");
  const [filterProformaOpen, setFilterProformaOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fonctions de gestion pour les proformas
  const exportProformasToCSV = () => {
    console.log("Exporting proformas to CSV...");
    const csvData = proformas.map((proforma) => ({
      "Numéro de Proforma": proforma.proformaNumber,
      Client: proforma.client.lastName,
      "Référence du contrat": proforma.contractReference || "N/A",
      Véhicule: proforma.items[0]?.vehicle?.immatriculation,
      "Date de départ": proforma.items[0]?.dateDepart || "N/A",
      "Date de retour": proforma.items[0]?.dateRetour || "N/A",
      "Nombre de jours": proforma.items[0]?.nombreJours || "N/A",
      "Prix unitaire": proforma.items[0]?.prix?.prix || "N/A",
      Destination: proforma.items[0]?.region?.nom_region || "N/A",
      "Montant total": proforma.totalAmount.toFixed(2),
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "proformas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  interface AddProformaData {
    // Ajoutez ici les propriétés nécessaires pour l'ajout d'une proforma
    // Exemple :
    contractReference?: string;
    clientId: number;
    items: {
      vehicleId: number;
      regionId?: number;
      prix?: number;
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

  const handleAddProforma = (proformaData: AddProformaData) => {
    console.log("Adding proforma:", proformaData);
    // Ici, vous enverriez les données à votre API ou les ajouteriez à votre état global

    handleCloseAddModal(); // Fermer le modal après l'ajout
  };

  // Fetch proformas on component mount
  useEffect(() => {
    dispatch(fetchProformas());
  }, [dispatch]);

  // Handler for opening edit modal
  const handleEdit = (id: number, item: any) => {
    // Added 'item' parameter
    setSelectedProformaId(id);
    setSelectedItem(item); // Set the selected item directly
    setOpenEditModal(true);
  };

  // Handler for closing edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedProformaId(null);
    setSelectedItem(null); // Reset selected item
    dispatch(fetchProformas()); // Re-fetch proformas to update the list after edit
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
      setSnackbarMessage("Proforma supprimée avec succès !");
      setSnackbarSeverity("success");
      // No need to dispatch fetchProformas() here, as it's already handled by the extraReducers
      // of the slice when deleteProforma fulfills.
    } catch (error: any) {
      setSnackbarMessage(
        error.message || "Erreur lors de la suppression du proforma."
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
    setProformaToDeleteId(null);
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
    setPage(0);
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
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        } else {
          reject(new Error("Failed to get 2D context"));
        }
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

    let logoBase64 = "";
    try {
      logoBase64 = await convertImageToBase64(logo);
      doc.addImage(logoBase64, "PNG", 14, 10, 50, 20);
    } catch (e) {
      console.error("Error loading logo for PDF:", e);
      setSnackbarMessage("Erreur lors du chargement du logo pour le PDF.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return; // Stop execution if logo fails to load
    }

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

    let signatureBase64 = "";
    try {
      signatureBase64 = await convertImageToBase64(signatureImage);
    } catch (e) {
      console.error("Error loading signature image for PDF:", e);
      setSnackbarMessage(
        "Erreur lors du chargement de la signature pour le PDF."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return; // Stop execution if signature fails to load
    }

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

        const pourMirentText = "Pour Mirent,";
        doc.setFontSize(10);
        const pourMirentWidth = doc.getTextWidth(pourMirentText);
        const pourMirentX = pageWidth - rightMargin - pourMirentWidth;
        const pourMirentY = positionY + 10;
        doc.text(pourMirentText, pourMirentX, pourMirentY);

        const signatureWidth = 50;
        const signatureHeight = 25;

        const signatureX = pageWidth - rightMargin - signatureWidth;
        const signatureY = pourMirentY + 2;

        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(14, 260, pageWidth - 14, 260);

        doc.addImage(
          signatureBase64,
          "PNG", // Or 'JPEG', 'JPG' based on your image type
          signatureX,
          signatureY,
          signatureWidth,
          signatureHeight
        );

        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(14, 260, pageWidth - 14, 260);
      },
    });

    const footerLines = [
      "Email: mirent.mdg@gmail.com",
      "Téléphone: +261 38 13 690 04",
      "NIF: 7018487985      Stat: 49295 11 024 0 10341",
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

  const handleOpenPreviewDialog = (proforma: Proforma) => {
    // Find the most up-to-date proforma from the Redux store
    const updatedProforma = proformas.find((p) => p.id === proforma.id);

    if (updatedProforma) {
      // Recalculate totalAmount based on the items in the updated proforma
      const calculatedTotalAmount = updatedProforma.items.reduce(
        (sum, item) =>
          sum +
          (item.nombreJours && item.prix?.prix
            ? item.nombreJours * item.prix.prix
            : 0),
        0
      );

      // Create a new proforma object with the updated totalAmount for the preview
      setPreviewProforma({
        ...updatedProforma,
        totalAmount: calculatedTotalAmount,
      });
    } else {
      // Fallback if for some reason the proforma isn't found in the latest state
      setPreviewProforma(proforma); // Use the original if no update found
    }
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

  const paginatedProformas = filteredProformas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  const SearchField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      "& fieldset": {
        borderColor: "#d1d5db",
      },
      "&:hover fieldset": {
        borderColor: "#9ca3af",
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "0.9rem",
      color: "#1f2937",
    },
  }));

  return (
    <>
      <ToastContainer />
      <Grid
        container
        spacing={3}
        sx={{
          padding: isMobile ? 2 : 3,
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {/* Titre et description */}
        <Grid item xs={12}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "#1f2937", marginBottom: 1 }}
          >
            Liste des Proformas
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "0.9rem", color: "#6b7280" }}
          >
            Gérez les proformas de location de véhicules, modifiez-les ou
            supprimez-les selon vos besoins.
          </Typography>
        </Grid>

        {/* Barre d'outils pour les proformas */}
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
                placeholder="Rechercher une proforma..."
                value={searchProformaQuery}
                onChange={(e) => setSearchProformaQuery(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: isMobile ? "100%" : "300px" }}
              />
              <CancelButton
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterProformaOpen(!filterProformaOpen)}
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
              </CancelButton>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <CancelButton
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={exportProformasToCSV}
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
                Exporter CSV
              </CancelButton>
            </Box>
          </Toolbar>
        </Grid>

        {/* Filtres pour les proformas */}
        {filterProformaOpen && (
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                padding: 2,
                borderRadius: "8px",
                mb: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Référence du contrat"
                    value={filterContractReference}
                    onChange={(e) => setFilterContractReference(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Nom du client"
                    value={filterClientName}
                    onChange={(e) => setFilterClientName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="status-filter-label">Statut</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      label="Statut"
                    >
                      <MenuItem value="">Tous</MenuItem>
                      <MenuItem value="En attente">En attente</MenuItem>
                      <MenuItem value="Validée">Validée</MenuItem>
                      <MenuItem value="Annulée">Annulée</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}

        {/* Edit Proforma Modal */}

        <Grid item xs={12}>
          {/* DashboardCard is always rendered to show filters even if no proformas */}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ padding: 2 }}
          >
            {loading && <Typography>Chargement des proformas...</Typography>}
            {error && (
              <Alert severity="error">
                Erreur: {error}. Veuillez réessayer.
              </Alert>
            )}
          </Stack>

          {/* Conditional rendering for the table or no data message */}
          {paginatedProformas.length === 0 && !loading && !error ? (
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ py: 3 }}
            >
              Aucune proforma trouvée pour les critères de filtre actuels.
              <br />
              {proformas.length === 0 && "La liste des proformas est vide."}
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: isMobile ? 300 : 600 }}
                  aria-label="tableau des proformas"
                >
                  <TableHead>
                    <StyledTableRow>
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
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
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
                                handleEdit(proforma.id, proforma.items[0]); // Pass the item directly
                              }}
                            >
                              <EditIcon />
                            </IconButton>

                            <IconButton
                              onClick={() => handleDeleteClick(proforma.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>

                            <IconButton
                              onClick={() => handleOpenPreviewDialog(proforma)}
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
            </>
          )}
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
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
        </Grid>

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
                  // We re-fetch proformas in handleCloseEditModal for simplicity.
                  // For more granular updates, you could dispatch an action to update a single proforma in Redux state.
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
                <Typography>
                  Client: {previewProforma.client.lastName}
                </Typography>
                <Typography>
                  Email: {previewProforma.client.email || "N/A"}
                </Typography>
                <Typography>
                  Téléphone: {previewProforma.client.phone}
                </Typography>

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
                  Montant Total:{previewProforma.totalAmount?.toFixed(2)} Ar
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
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
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
          </MuiAlert>
        </Snackbar>
      </Grid>
    </>
  );
};
export default ProformasList;
