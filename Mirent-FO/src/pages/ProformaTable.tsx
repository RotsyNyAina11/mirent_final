import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
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

import companyLogo from "../assets/horizontal.png"; // Logo de l’entreprise
import clientLogo from "../assets/oms.png"; // Logo du client

const ProformaTable = () => {
  const quotes = useSelector((state: RootState) => state.proforma.quotes);
  const dispatch = useDispatch();

  // Calcul des totaux
  const totalCarburant = quotes.reduce(
    (sum, quote) => sum + (parseFloat(quote.carburant.toString()) || 0),
    0
  );
  const totalPrixTotal = quotes.reduce(
    (sum, quote) => sum + (parseFloat(quote.prixTotal.toString()) || 0),
    0
  );

  // Informations du client (à personnaliser selon les données réelles)
  const clientInfo = {
    name: "OMS Corporation",
    email: "contact@oms.com",
    description: "Entreprise de location de véhicules",
    phone: "+261 34 12 345 67",
  };

  return (
    <>
      {/* Logos et informations */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginBottom: 3 }}
      >
        {/* Logo de l'entreprise */}
        <Grid item xs={4} sx={{ textAlign: "left" }}>
          <img
            src={companyLogo}
            alt="Logo de l'entreprise"
            style={{ width: 100, height: "auto" }}
          />
          <Typography>Facture n**</Typography>
        </Grid>

        {/* Titre principal */}
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            Proforma/Devis
          </Typography>
        </Grid>

        {/* Logo du client + Infos client */}
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

      {/* Tableau des devis */}
      <Paper sx={{ padding: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Réf",
                  "Voiture",
                  "Numéro",
                  "Destination",
                  "Date",
                  "Jours",
                  "Carburant",
                  "Prix U",
                  "Prix Total",
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
                  <TableCell>{quote.destination}</TableCell>

                  <TableCell>
                    {quote.dateDepart} au {quote.dateArrivee}
                  </TableCell>
                  <TableCell>{quote.nombreJours}</TableCell>
                  <TableCell>
                    {parseFloat(quote.carburant.toString()).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {parseFloat(quote.prixUnitaire.toString()).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {parseFloat(quote.prixTotal.toString()).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {/* Ligne des totaux */}
              <TableRow>
                <TableCell colSpan={6} align="right">
                  <Typography variant="body1" fontWeight="bold">
                    TOTAL
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" fontWeight="bold">
                    {totalCarburant.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" fontWeight="bold">
                    -
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body1" fontWeight="bold">
                    {totalPrixTotal.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              {/* Ligne du montant total carburant */}
              <TableRow>
                <TableCell colSpan={8} align="right">
                  <Typography variant="body1" fontWeight="bold">
                    MONTANT TOTAL CARBURANT
                  </Typography>
                </TableCell>
                <TableCell align="center">
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

      {/* Montant total en lettres */}
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Arrêtée la présente facture à la somme de :{" "}
        <strong>
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "MGA",
          }).format(totalPrixTotal)}
        </strong>
      </Typography>

      {/* Date et signature */}
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
