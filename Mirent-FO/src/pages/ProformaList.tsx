import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useProformaStore } from "../redux/store";

const ProformaList: React.FC = () => {
  const { proformas } = useProformaStore();

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Liste des Devis
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Réf</TableCell>
              <TableCell>Voiture</TableCell>
              <TableCell>Numéro</TableCell>
              <TableCell>Départ</TableCell>
              <TableCell>Arrivée</TableCell>
              <TableCell>Jours</TableCell>
              <TableCell>Carburant</TableCell>
              <TableCell>Total (Ar)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proformas.map((proforma, index) => (
              <TableRow key={index}>
                <TableCell>{proforma.ref}</TableCell>
                <TableCell>{proforma.voiture}</TableCell>
                <TableCell>{proforma.numeroVoiture}</TableCell>
                <TableCell>{proforma.dateDepart}</TableCell>
                <TableCell>{proforma.dateArrivee}</TableCell>
                <TableCell>{proforma.nombreJours}</TableCell>
                <TableCell>{proforma.carburant}</TableCell>
                <TableCell>{proforma.prixTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ProformaList;
