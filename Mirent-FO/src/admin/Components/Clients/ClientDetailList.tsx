// src/admin/Components/Clients/ClientsList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  // NOUVEAU: Importez les composants de Table
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContractDetails from "./ClientsDetail"; // Votre composant ContractDetails

// --- Interfaces pour les données ---
interface Client {
  id: number;
  lastName: string; // Correspond à votre backend
  email: string;
  phone: string;
  // Ajoutez d'autres champs de client si nécessaire
}

// --- Composant ClientsList ---
const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [errorClients, setErrorClients] = useState<string | null>(null);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // État pour contrôler l'ouverture du Dialog

  // Effet pour charger la liste des clients au montage du composant
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      setErrorClients(null);
      try {
        const response = await axios.get("http://localhost:3000/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
        setErrorClients("Impossible de charger la liste des clients.");
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  // Gère l'ouverture de la boîte de dialogue des contrats
  const handleOpenDialog = (clientId: number) => {
    setSelectedClientId(clientId);
    setOpenDialog(true);
  };

  // Gère la fermeture de la boîte de dialogue des contrats
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClientId(null);
  };

  // --- Gestion de l'affichage du chargement/erreur ---
  if (loadingClients) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des clients...</Typography>
      </Box>
    );
  }

  if (errorClients) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {errorClients}
      </Alert>
    );
  }

  // --- Rendu de la liste des clients en tableau ---
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Clients
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <TableContainer>
          <Table aria-label="liste des clients">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Action</TableCell>{" "}
                {/* Nouvelle colonne Action */}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.lastName}</TableCell>

                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(client.id)}
                    >
                      Voir Contrats
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Composant Dialog pour afficher les détails du contrat */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg" // Ajustez la largeur maximale selon vos besoins
        fullWidth
      >
        <DialogTitle>
          {selectedClientId
            ? `Détails des Contrats du Client (ID: ${selectedClientId})`
            : "Détails des Contrats"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedClientId ? (
            <ContractDetails clientId={selectedClientId} />
          ) : (
            <Typography>
              Sélectionnez un client pour voir les détails de son contrat.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientsList;
