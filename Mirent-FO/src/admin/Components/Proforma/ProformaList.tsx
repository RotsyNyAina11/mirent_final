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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/store";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  deleteProforma,
  fetchProformas,
  updateProforma,
} from "../../../redux/features/commande/commandeSlice";
import EditProformaForm from "../../Components/Commandes/EditProforma";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import logo from "../../../assets/horizontal.png";
import { toWords } from "number-to-words";
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
    id: number; // Added id property
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
  dateGeneration?: string; // Add this property to match the usage
  dateCreation?: string; // Add this property to fix the error
}

// Custom Theme
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

// Styled Components
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
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProformaId, setSelectedProformaId] = useState<number | null>(
    null
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentProformaId, setCurrentProformaId] = useState<number | null>(
    null
  );
  const [proforma, setProformas] = useState<Proforma[]>([]);

  useEffect(() => {
    dispatch(fetchProformas());
  }, [dispatch]);

  const handleEdit = (id: number) => {
    setSelectedProformaId(id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedProformaId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProforma(id)).unwrap();
      setSnackbarMessage("Proforma supprimé avec succès !");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du proforma"
      );
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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

  const exportSingleProformaToPDF = async (
    proforma: Proforma & { open: boolean }
  ) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ✅ Police de caractères
    doc.setFont("helvetica", "normal"); // Choisissez une police appropriée

    // ✅ Logo
    const logoBase64 = await convertImageToBase64(logo);
    doc.addImage(logoBase64, "PNG", 14, 10, 50, 20);

    // ✅ Informations client à droite
    const clientInfo = [
      `Client : ${proforma.client.lastName}`,
      `Email : ${proforma.client.email}`,
      `Téléphone : ${proforma.client.phone}`,
    ];
    doc.setFontSize(12);
    clientInfo.forEach((line, index) => {
      const textWidth = doc.getTextWidth(line);
      doc.text(line, pageWidth - textWidth - 14, 15 + index * 6);
    });

    // ✅ Titre centré
    doc.setFontSize(16);
    const title = `Proforma N° ${proforma.proformaNumber}`;

    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 66);

    // ✅ Préparation des lignes
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

    // ✅ Tableau avec autoTable
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
          { content: "Prix Unit", styles: { cellWidth: 25, halign: "right" } },
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
        // ✅ Total global juste en-dessous du tableau
        const finalY = data.cursor ? data.cursor.y + 10 : 10;

        // Définir la langue en français
        writtenNumber.defaults.lang = "fr";

        // Exemple de conversion
        const montantEnLettres = writtenNumber(totalGlobal);

        // Montant Total à gauche (en gras et plus grand)
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`MONTANT TOTAL : ${totalGlobal.toFixed(2)} Ar`, 20, finalY, {
          align: "left",
        });
        doc.setFont("helvetica", "normal"); // Réinitialiser la police

        // Montant en lettres à gauche aussi
        doc.setFontSize(12);
        doc.text(
          `Arretée la présente proforma à la somme de : ${montantEnLettres} ariary`,
          20,
          finalY + 6
        );
        doc.setFont("helvetica", "normal");

        doc.setFontSize(10);
        const finalYDateCreation = finalY + 10;

        // ✅ Date d'aujourd'hui formatée en français
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

        // ✅ Affichage de la date juste après le montant en lettres
        doc.setFontSize(10);
        const pageWidth = doc.internal.pageSize.getWidth();
        const rightMargin = 20; // marge droite

        // Décale plus en bas, par exemple à 30 unités après la fin du tableau
        const positionY = finalY + 30;
        doc.text(texteLieuDate, pageWidth - rightMargin, positionY, {
          align: "right",
        });
        doc.setFontSize(12);

        // ✅ Ligne de séparation avant le pied de page
        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(14, 260, pageWidth - 14, 260);
      },
    });

    // ✅ Pied de page
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

    // Exporter en pdf
    doc.save(`Proforma-${proforma.proformaNumber}.pdf`);
  };

  function handlePreview(id: number): void {
    const selectedProforma = proformas.find((proforma) => proforma.id === id);
    if (selectedProforma) {
      const previewWindow = window.open("", "_blank");
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head>
              <title>Proforma Preview</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f4f4f4;
                }
              </style>
            </head>
            <body>
              <h1>Proforma N° ${selectedProforma.proformaNumber}</h1>
              <p><strong>Client:</strong> ${
                selectedProforma.client.lastName
              }</p>
              <p><strong>Email:</strong> ${
                selectedProforma.client.email || "N/A"
              }</p>
              <p><strong>Téléphone:</strong> ${
                selectedProforma.client.phone
              }</p>
              <table>
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Destination</th>
                    <th>Véhicule</th>
                    <th>Immatriculation</th>
                    <th>Date Départ</th>
                    <th>Date Retour</th>
                    <th>Jours</th>
                    <th>Prix Unitaire</th>
                    <th>Prix Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${selectedProforma.contractReference || "N/A"}</td>
                    <td>${
                      selectedProforma.items[0]?.region?.nom_region || "N/A"
                    }</td>
                    <td>${selectedProforma.items[0]?.vehicle?.nom || "N/A"}</td>
                    <td>${
                      selectedProforma.items[0]?.vehicle?.immatriculation ||
                      "N/A"
                    }</td>
                    <td>${selectedProforma.items[0]?.dateDepart || "N/A"}</td>
                    <td>${selectedProforma.items[0]?.dateRetour || "N/A"}</td>
                    <td>${selectedProforma.items[0]?.nombreJours || 0}</td>
                    <td>${selectedProforma.items[0]?.prix?.prix || "N/A"}</td>
                    <td>${selectedProforma.items[0].subTotal} Ar</td>
                  </tr>
                </tbody>
              </table>
            </body>
          </html>
        `);
        previewWindow.document.close();
      }
    } else {
      console.error("Proforma not found");
    }
  }

  {
    /*Fonction pour modifier le proformaItem*/
  }

  return (
    <Container>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "700", color: "#1976d2", marginBottom: 2 }}
        >
          Gestion de création d'un proforma
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: "0.9rem" }}>
          Ici, vous pouvez gérer les proformats de location, modifier,
          supprimer, prévuliaser, télécharger les proformas.
        </Typography>
      </Grid>
      <Box sx={{ backgroundColor: "#f9fafb" }}>
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
                      Date de début
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Date de fin
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Jours
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: "#1f2937" }}>
                      Prix Unitaire
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
                  {proformas.map((proforma) => (
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
                              setEditItemModalOpen(true);
                              setCurrentProformaId(proforma.id); // pour savoir à quel proforma appartient l'item
                            }}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            onClick={() => handleDelete(proforma.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>

                          <IconButton
                            onClick={() =>
                              exportSingleProformaToPDF({
                                ...proforma,
                                open: false,
                              })
                            }
                            color="success"
                          >
                            <DownloadIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handlePreview(proforma.id)}
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
          </DashboardCard>
        )}
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
                  // Recherche de l'index de la proforma à mettre à jour
                  const proformaIndex = proformas.findIndex(
                    (proforma) => proforma.id === selectedProformaId
                  );

                  if (proformaIndex !== -1) {
                    // Création d'une copie de la proforma à modifier
                    const updatedProforma = { ...proformas[proformaIndex] };

                    // Mise à jour de l'item spécifique dans le tableau 'items'
                    const updatedItems = updatedProforma.items.map((item) =>
                      item.id === updatedItem.id ? { ...updatedItem } : item
                    );

                    updatedProforma.items = updatedItems;

                    // Création d'une nouvelle liste de proformas avec la proforma mise à jour
                    const updatedProformas = [
                      ...proformas.slice(0, proformaIndex),
                      updatedProforma,
                      ...proformas.slice(proformaIndex + 1),
                    ];

                    setProformas(updatedProformas);
                    console.log(
                      "✅ Proformas mises à jour :",
                      updatedProformas
                    );
                    setEditItemModalOpen(false); // Fermer la modale après la mise à jour
                  } else {
                    console.error(
                      `❌ Impossible de trouver la proforma avec l'ID : ${selectedProformaId}`
                    );
                  }
                }}
              />
            )}
          </Box>
        </Modal>

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
      </Box>
    </Container>
  );
};

export default ProformasList;
