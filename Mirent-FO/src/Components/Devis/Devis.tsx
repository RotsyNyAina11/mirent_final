import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Pour la navigation vers la page Facturation
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Devis {
  Client: {
    lastName: string;
    email: string;
    phone: number;
  };
  contractReference: string;
  Vehicle: {
    name: string;
    number: string;
    immatriculation: string;
  };

  dateDepart: string;
  dateArrivee: string;
  nombreJours: number;
  carburant: string;
  prixUnitaire: number;
  prixTotal: number;
}

const DevisForm = () => {
  const [devisList, setDevisList] = useState<any[]>([]); // Liste des devis
  const [devis, setDevis] = useState({
    client: "", // nouveau champ
    ref: "",
    voiture: "",
    numeroVoiture: "",
    dateDepart: "",
    dateArrivee: "",
    nombreJours: 1,
    carburant: "",
    prixUnitaire: 0,
    prixTotal: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editDevis, setEditDevis] = useState<any>(null);

  const navigate = useNavigate(); // Utilisation de react-router-dom pour la navigation

  // Mise à jour des champs et calcul automatique du prix total
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newDevis = { ...devis, [name]: value };

    // Calcul automatique du prix total basé sur les jours et le prix unitaire
    if (name === "nombreJours" || name === "prixUnitaire") {
      newDevis.prixTotal =
        Number(newDevis.nombreJours) * Number(newDevis.prixUnitaire);
    }

    setDevis(newDevis);
  };

  // Fonction d'envoi du formulaire et ajout d'un devis à la liste
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ajouter le devis à la liste des devis
    setDevisList([...devisList, devis]);

    // Réinitialisation du formulaire
    setDevis({
      client: "", //
      ref: "",
      voiture: "",
      numeroVoiture: "",
      dateDepart: "",
      dateArrivee: "",
      nombreJours: 0,
      carburant: "",
      prixUnitaire: 0,
      prixTotal: 0,
    });
  };

  // Fonction pour naviguer vers la page de facturation en passant la liste des devis
  const handleNavigateToFacturation = () => {
    navigate("/facturation", { state: { devisList } });
  };

  const handleDelete = (index: number) => {
    const newList = devisList.filter((_, i) => i !== index);
    setDevisList(newList);
  };
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditDevis(devisList[index]);
    setEditOpen(true);
  };

  return (
    <Container>
      {/* Formulaire pour ajouter un devis */}
      <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            <AddShoppingCart fontSize="large" sx={{ color: "#1976d2" }} /> Créer
            un Devis
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom du Client"
                  name="client"
                  value={devis.client}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Référence"
                  name="ref"
                  value={devis.ref}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Voiture"
                  name="voiture"
                  value={devis.voiture}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Numéro Voiture"
                  name="numeroVoiture"
                  value={devis.numeroVoiture}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date de départ"
                  name="dateDepart"
                  value={devis.dateDepart}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date d'arrivée"
                  name="dateArrivee"
                  value={devis.dateArrivee}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Nombre de jours"
                  name="nombreJours"
                  value={devis.nombreJours}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Carburant"
                  name="carburant"
                  value={devis.carburant}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Prix Unitaire (Ar)"
                  name="prixUnitaire"
                  value={devis.prixUnitaire}
                  variant="outlined"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Prix Total (Ar)"
                  name="prixTotal"
                  variant="outlined"
                  value={devis.prixTotal}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Enregistrer le Devis
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {devisList.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Liste des Devis enregistrés
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Réf</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Voiture</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Jours</TableCell>
                <TableCell>Carburant</TableCell>
                <TableCell>PU</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devisList.map((d, index) => (
                <TableRow key={index}>
                  <TableCell>{d.ref}</TableCell>
                  <TableCell>{d.client}</TableCell>
                  <TableCell>
                    {d.voiture} ({d.numeroVoiture})
                  </TableCell>
                  <TableCell>
                    {d.dateDepart} → {d.dateArrivee}
                  </TableCell>
                  <TableCell>{d.nombreJours}</TableCell>
                  <TableCell>{d.carburant}</TableCell>
                  <TableCell>{d.prixUnitaire} Ar</TableCell>
                  <TableCell>{d.prixTotal} Ar</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Boutons PDF + facturation */}
          <Box mt={2}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => generatePDF(devisList)}
              sx={{ mr: 2 }}
            >
              Générer le PDF
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNavigateToFacturation}
            >
              Aller à la Facturation
            </Button>
          </Box>
        </Box>
      )}

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier le Devis</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {Object.entries(editDevis || {}).map(
              ([key, value]) =>
                key !== "prixTotal" && (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      fullWidth
                      label={key}
                      name={key}
                      value={value}
                      type={
                        ["prixUnitaire", "nombreJours"].includes(key)
                          ? "number"
                          : "text"
                      }
                      onChange={(e) =>
                        setEditDevis({
                          ...editDevis,
                          [key]: e.target.value,
                          prixTotal:
                            key === "nombreJours" || key === "prixUnitaire"
                              ? Number(
                                  key === "nombreJours"
                                    ? e.target.value
                                    : editDevis.nombreJours
                                ) *
                                Number(
                                  key === "prixUnitaire"
                                    ? e.target.value
                                    : editDevis.prixUnitaire
                                )
                              : editDevis.prixTotal,
                        })
                      }
                    />
                  </Grid>
                )
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => {
              const updated = [...devisList];
              updated[editIndex!] = editDevis;
              setDevisList(updated);
              setEditOpen(false);
            }}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DevisForm;
