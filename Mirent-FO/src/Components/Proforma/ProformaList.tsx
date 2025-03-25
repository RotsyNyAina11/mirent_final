import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Paper,
} from "@mui/material";

interface Proforma {
  id: number;
  client: {
    lastName: string;
  };
  items: ProformaItem[];
  date: string;
  contractReference: string;
  notes: string;
  isLoading: boolean;
  error: string | null;
  proformaNumber: string;
}

interface ProformaItem {
  id: number;
  vehicleId: number;
  regionId: number;
  prixId: number;
  dateDepart: string;
  dateRetour: string;
  subTotal: number;
  nombreJours: number;
}

function ProformaList() {
  const [proformas, setProformas] = useState<Proforma[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/proforma")
      .then((response) => response.json())
      .then((data) => setProformas(data))
      .catch((error) => console.error("Erreur de chargement:", error));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Liste des Proforma
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Contrat de reference</strong>
                </TableCell>
                <TableCell>
                  <strong>Numéro Proforma</strong>
                </TableCell>
                <TableCell>
                  <strong>Client</strong>
                </TableCell>
                <TableCell>
                  <strong>Date Départ</strong>
                </TableCell>
                <TableCell>
                  <strong>Date Retour</strong>
                </TableCell>
                <TableCell>
                  <strong>Nombre de Jours</strong>
                </TableCell>
                <TableCell>
                  <strong>Véhicule</strong>
                </TableCell>
                <TableCell>
                  <strong>Région</strong>
                </TableCell>
                <TableCell>
                  <strong>Prix</strong>
                </TableCell>
                <TableCell>
                  <strong>Montant Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proformas.map((proforma) =>
                proforma.items.map((item) => (
                  <TableRow key={`${proforma.id}-${item.id}`}>
                    <TableCell>{proforma.contractReference}</TableCell>
                    <TableCell>{proforma.proformaNumber}</TableCell>
                    <TableCell>{proforma.client.lastName}</TableCell>
                    <TableCell>{item.dateDepart}</TableCell>
                    <TableCell>{item.dateRetour}</TableCell>
                    <TableCell>{item.nombreJours}</TableCell>
                    <TableCell>{item.vehicleId}</TableCell>
                    <TableCell>{item.regionId}</TableCell>
                    <TableCell>{item.prixId}</TableCell>
                    <TableCell>{item.subTotal}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default ProformaList;
