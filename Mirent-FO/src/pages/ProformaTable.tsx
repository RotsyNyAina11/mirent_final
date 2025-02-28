import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeQuote } from "../redux/slices/proformaSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Typography,
} from "@mui/material";

import companyLogo from "../assets/logo.png"; // Logo de l’entreprise
import clientLogo from "../assets/oms.png"; // Logo du client

const QuoteTable = () => {
  const quotes = useSelector((state: RootState) => state.proforma.quotes);
  const dispatch = useDispatch();

  return (
    <Paper sx={{ padding: 3, marginTop: 3 }}>
      {/* Section Logos et Titre (au-dessus du tableau, mais à l'intérieur du Paper) */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={4} sx={{ textAlign: "left" }}>
          <img
            src={companyLogo}
            alt="Logo de l'entreprise"
            style={{ width: 100, height: "auto" }}
          />
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            Proforma
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <img
            src={clientLogo}
            alt="Logo du client"
            style={{ width: 100, height: "auto" }}
          />
        </Grid>
      </Grid>

      {/* Tableau des devis (en dessous des logos et du titre) */}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Réf",
                "Voiture",
                "Numéro",
                "Départ",
                "Arrivée",
                "Jours",
                "Carburant",
                "Prix U",
                "Prix Total",
                "Action",
              ].map((header) => (
                <TableCell key={header} align="center">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.ref}>
                <TableCell>{quote.ref}</TableCell>
                <TableCell>{quote.voiture}</TableCell>
                <TableCell>{quote.numeroVoiture}</TableCell>
                <TableCell>{quote.dateDepart}</TableCell>
                <TableCell>{quote.dateArrivee}</TableCell>
                <TableCell>{quote.nombreJours}</TableCell>
                <TableCell>{quote.carburant}</TableCell>
                <TableCell>{quote.prixUnitaire}</TableCell>
                <TableCell>{quote.prixTotal}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => dispatch(removeQuote(quote.ref))}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default QuoteTable;
