import { useState } from "react";

interface Devis {
  ref: string;
  voiture: string;
  numeroVoiture: string;
  dateDepart: string;
  dateArrivee: string;
  nombreJours: number;
  prixUnitaire: number;
  prixTotal?: number;
}
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { Print } from "@mui/icons-material";
import { useLocation } from "react-router-dom"; // Pour récupérer le state des devis

const FacturationPage = () => {
  const location = useLocation();
  const devisList = location.state?.devisList || []; // Récupérer devisList via le state passé depuis DevisForm

  const [factures, setFactures] = useState<any[]>([]);

  // Générer une facture pour un devis sélectionné
  const handleFacturer = (devis: any) => {
    const facture = {
      ...devis,
      prixTotal: devis.prixUnitaire * devis.nombreJours,
    };
    setFactures([...factures, facture]);
  };

  // Fonction pour imprimer une facture
  const handleImprimer = (facture: any) => {
    window.print(); // Personnalisation de l'impression
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Page de Facturation
      </Typography>

      {/* Affichage des devis pour lesquels générer des factures */}
      {devisList.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 4, borderRadius: 2, overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Réf
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Voiture
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Numéro
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Départ
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Arrivée
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Jours
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Prix Total (Ar)
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devisList.map((devis: Devis, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{devis.ref}</TableCell>
                    <TableCell>{devis.voiture}</TableCell>
                    <TableCell>{devis.numeroVoiture}</TableCell>
                    <TableCell>{devis.dateDepart}</TableCell>
                    <TableCell>{devis.dateArrivee}</TableCell>
                    <TableCell>{devis.nombreJours}</TableCell>
                    <TableCell>{devis.prixTotal} Ar</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleFacturer(devis)}
                      >
                        Générer Facture
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Affichage des factures générées */}
      {factures.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Factures générées
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 4, borderRadius: 2, overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Réf
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Voiture
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Numéro
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Départ
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Arrivée
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Jours
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Prix Total (Ar)
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {factures.map((facture, index) => (
                  <TableRow key={index}>
                    <TableCell>{facture.ref}</TableCell>
                    <TableCell>{facture.voiture}</TableCell>
                    <TableCell>{facture.numeroVoiture}</TableCell>
                    <TableCell>{facture.dateDepart}</TableCell>
                    <TableCell>{facture.dateArrivee}</TableCell>
                    <TableCell>{facture.nombreJours}</TableCell>
                    <TableCell>{facture.prixTotal} Ar</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleImprimer(facture)}
                        startIcon={<Print />}
                      >
                        Imprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default FacturationPage;
