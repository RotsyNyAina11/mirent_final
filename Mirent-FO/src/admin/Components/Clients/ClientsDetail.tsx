import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import moment from "moment"; // Pour formater les dates, assurez-vous de l'installer: npm install moment
import { Prix } from "../../../types/region";

// Interface pour un item de contrat (basée sur ProformaItem ou une entité de contrat)
interface ContractItem {
  id: number; // N° Demande
  proforma?: {
    // Assurez-vous que cette relation est chargée
    id: number; // N° Proforma
  };
  vehicle?: {
    // Assurez-vous que cette relation est chargée
    marque: string;
    modele: string;
    immatriculation: string;
    nombrePlaces: number;
    type: string;
    status: string;
  };
  region?: {
    // Assurez-vous que cette relation est chargée
    nom_region: string; // Destination
  };
  nombreJours: number;
  dateDepart: string; // Ou Date, si vous traitez des objets Date directement
  dateRetour: string;
  dateVisite?: string; // Optionnel
  kmEstimatif?: number; // Optionnel
  prix?: {
    // Assurez-vous que cette relation est chargée
    prix: Prix; // Prix unitaire
  };
  prixCarburant?: number; // Optionnel
  subTotal: number; // Total Net
}

interface ContractDetailsProps {
  clientId: number;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ clientId }) => {
  const [contractItems, setContractItems] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractItems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Cet endpoint doit être implémenté sur votre backend.
        // Il devrait retourner tous les ProformaItems associés à un client.
        const response = await axios.get(
          `http://localhost:3000/clients/${clientId}/proforma-items`
        );
        setContractItems(response.data);
      } catch (err) {
        console.error(
          `Erreur lors du chargement des items de contrat pour le client ${clientId}:`,
          err
        );
        setError("Impossible de charger les détails des contrats.");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchContractItems();
    } else {
      setContractItems([]); // Réinitialiser si pas de client sélectionné
      setLoading(false);
    }
  }, [clientId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des contrats...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  if (contractItems.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Aucun contrat trouvé pour ce client.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Détails des Contrats du Client (ID: {clientId})
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>N° Demande</TableCell>
              <TableCell>N° Proforma</TableCell>
              <TableCell>Véhicule</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Nb. Jours</TableCell>
              <TableCell>Date Départ</TableCell>
              <TableCell>Date Arrivée</TableCell>
              <TableCell>Date Visite</TableCell>
              <TableCell>Km Estimatif</TableCell>
              <TableCell>Prix Unitaire</TableCell>
              <TableCell>Prix Carburant</TableCell>
              <TableCell>Total Net</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.proforma?.id || "N/A"}</TableCell>
                <TableCell>{`${item.vehicle?.marque || ""} ${
                  item.vehicle?.modele || "N/A"
                }`}</TableCell>
                <TableCell>{item.region?.nom_region || "N/A"}</TableCell>
                <TableCell>{item.nombreJours}</TableCell>
                <TableCell>
                  {moment(item.dateDepart).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {moment(item.dateRetour).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {item.dateVisite
                    ? moment(item.dateVisite).format("DD/MM/YYYY")
                    : "N/A"}
                </TableCell>
                <TableCell>{item.kmEstimatif || "N/A"}</TableCell>
                <TableCell>
                  {item.prix?.prix ? `${item.prix.prix} Ar` : "N/A"}
                </TableCell>
                <TableCell>
                  {item.prixCarburant
                    ? `${item.prixCarburant.toFixed(2)} Ar`
                    : "N/A"}
                </TableCell>
                <TableCell>{item.subTotal.toFixed(2)} Ar</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ContractDetails;
