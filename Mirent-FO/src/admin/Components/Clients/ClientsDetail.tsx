import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";

interface ContractItem {
  id: number; // N° Demande
  proforma?: {
    id: number;
    proformaNumber: number;
  };
  vehicle?: {
    marque: string;
    modele: string;
    immatriculation: string;
    nombrePlaces: number;
    type: string;
    status: string;
  };
  region?: {
    nom_region: string;
  };
  nombreJours: number;
  dateDepart: string;
  dateRetour: string;
  dateVisite?: string;
  kmEstimatif?: number;
  prix?: {
    prix: number;
  };
  prixCarburant?: number;
  subTotal: number;
}

interface ContractDetailsProps {
  clientId: number;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (errorMessage: string | null) => void;
  onNoContracts: (hasNoContracts: boolean) => void;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({
  clientId,
  onLoadingChange,
  onError,
  onNoContracts,
}) => {
  const [contractItems, setContractItems] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractItems = async () => {
      if (onLoadingChange) onLoadingChange(true);
      if (onError) onError(null);
      if (onNoContracts) onNoContracts(false);
      setLoading(true);
      setError(null);

      console.log(`API call to fetch proforma items for client ${clientId} is disabled.`);
      // API call is disabled as per user request.
      // Immediately setting state to indicate no contracts and stop loading.
      if (onNoContracts) onNoContracts(true);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    };

    if (clientId) {
      fetchContractItems();
    } else {
      setContractItems([]);
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
      setError(null);
      if (onError) onError(null);
      if (onNoContracts) onNoContracts(true);
    }
  }, [clientId, onLoadingChange, onError, onNoContracts]);

  if (loading || error || contractItems.length === 0) {
    return null;
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
              <TableCell>Jours</TableCell>
              <TableCell>D.Départ</TableCell>
              <TableCell>D.Arrivée</TableCell>
              <TableCell>Date Visite</TableCell>
              <TableCell>Km Estimatif</TableCell>
              <TableCell>Prix U</TableCell>
              <TableCell>Prix Carburant</TableCell>
              <TableCell>Total Net</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.proforma?.proformaNumber || "N/A"}</TableCell>
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
                  {item.prix?.prix
                    ? `${item.prix.prix.toLocaleString("fr-FR")} Ar`
                    : "N/A"}
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
