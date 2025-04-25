import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Box,
  Button, // Importez Button pour les actions
  styled, // Importez styled pour les composants stylisés
} from "@mui/material";

import companyLogo from "../../assets/horizontal.png";
import clientLogo from "../../assets/oms.png";
import {
  deleteProforma,
  fetchProformas,
} from "../../redux/features/commande/commandeSlice";
import EditProformaForm from "../../Components/Commandes/EditProforma";
import { AppDispatch } from "../../redux/store"; // Ensure this import exists

interface ProformaItem {
  vehicle?: { nom?: string };
  dateDepart?: string;
  dateRetour?: string;
  nombreJours?: number;
  prix?: number;
}

interface Proforma {
  id?: string | number;
  proformaNumber?: string;
  client?: { lastName?: string };
  items: ProformaItem[];
  totalAmount?: number;
  carburant?: number;
  prixUnitaire?: number;
  prixTotal?: number;
  status?: string;
}

// Définissez les composants stylisés pour les boutons (si vous les utilisez ailleurs)
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3b82f6",
  color: theme.palette.common.white,
  padding: "6px 12px",
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

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ef4444",
  color: theme.palette.common.white,
  padding: "6px 12px",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#dc2626",
    transform: "scale(1.02)",
    transition: "all 0.3s ease",
  },
}));

const ProformaTable = () => {
  const proformas: Proforma[] =
    useSelector((state: RootState) => state.proformas.proformas) || [];

  const dispatch: AppDispatch = useDispatch();

  console.log("Quotes récupérés depuis Redux :", proformas);

  if (!proformas || !Array.isArray(proformas)) {
    return <Typography>Aucun devis disponible.</Typography>;
  }

  const totalCarburant = proformas.reduce(
    (sum, proforma) => sum + parseFloat(proforma?.carburant?.toString() || "0"),
    0
  );

  const totalPrixTotal = proformas.reduce(
    (sum, proforma) => sum + parseFloat(proforma?.prixTotal?.toString() || "0"),
    0
  );

  const clientInfo = {
    name: "OMS Corporation",
    email: "contact@oms.com",
    description: "Entreprise de location de véhicules",
    phone: "+261 34 12 345 67",
  };

  const handleEdit = (id: string | number) => {
    console.log(`Modifier le proforma avec l'ID : ${id}`);
    // Ici, vous pouvez ouvrir le formulaire d'édition ou rediriger vers une autre page
  };

  const handleDelete = (id: string | number) => {
    console.log(`Supprimer le proforma avec l'ID : ${id}`);
    if (typeof id === "number") {
      dispatch(deleteProforma(id));
    } else {
      console.error("Invalid ID type. Expected a number.");
    }
    dispatch(fetchProformas());
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginBottom: 3 }}
      >
        <Grid item xs={4} sx={{ textAlign: "left" }}>
          <img
            src={companyLogo}
            alt="Logo de l'entreprise"
            style={{ width: 100, height: "auto" }}
          />
          <Typography>Facture n**</Typography>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            Proforma/Devis
          </Typography>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <img
            src={clientLogo}
            alt="Logo du client"
            style={{ width: 100, height: "auto" }}
          />
          <Typography variant="body1" fontWeight="bold" sx={{ marginTop: 1 }}>
            {clientInfo.name}
          </Typography>
          <Typography variant="body2">{clientInfo.email}</Typography>
          <Typography variant="body2">{clientInfo.description}</Typography>
          <Typography variant="body2">{clientInfo.phone}</Typography>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Numero",
                  "Client",
                  "Voiture",
                  "Départ",
                  "Retour",
                  "Jours",
                  "Montant HT",
                  "Carburant",
                  "Prix U",
                  "Prix Total",
                  "Statut",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{ fontWeight: 600 }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {proformas.map((proforma) => (
                <TableRow key={proforma.id || Math.random()}>
                  <TableCell>{proforma.proformaNumber || "N/A"}</TableCell>
                  <TableCell>{proforma.client?.lastName || "N/A"}</TableCell>
                  <TableCell>
                    {proforma.items[0]?.vehicle?.nom || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {proforma.items[0]?.dateDepart || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {proforma.items[0]?.dateRetour || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {proforma.items[0]?.nombreJours}
                  </TableCell>
                  <TableCell align="right">
                    {proforma.totalAmount?.toLocaleString() || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {proforma.carburant?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell align="right">
                    {proforma.prixUnitaire?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell align="right">
                    {proforma.prixTotal?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell align="center">{proforma.status}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <PrimaryButton
                        onClick={() => handleEdit(proforma.id)}
                        aria-label={`Modifier le proforma ${proforma.id}`}
                        size="small"
                      >
                        Modifier
                      </PrimaryButton>
                      <DeleteButton
                        onClick={() => handleDelete(proforma.id)}
                        aria-label={`Supprimer le proforma ${proforma.id}`}
                        size="small"
                      >
                        Supprimer
                      </DeleteButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={7} align="right">
                  <Typography variant="body1" fontWeight="bold">
                    TOTAL HT
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="bold">
                    {totalPrixTotal.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="bold">
                    {totalCarburant.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="bold">
                    {(totalPrixTotal + totalCarburant).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={8} align="right">
                  <Typography variant="body1" fontWeight="bold">
                    MONTANT TOTAL CARBURANT
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="bold">
                    {totalCarburant.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Arrêtée la présente facture à la somme de :{" "}
        <strong>
          {new Intl.NumberFormat("fr-MG", {
            style: "currency",
            currency: "MGA",
          }).format(totalPrixTotal + totalCarburant)}
        </strong>
      </Typography>

      <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
        <Grid item>
          <Typography variant="body1">
            Antananarivo, le {new Date().toLocaleDateString("fr-FR")}
          </Typography>
          <Typography variant="body1" fontWeight="bold" sx={{ marginTop: 1 }}>
            Pour Mirent,
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default ProformaTable;
