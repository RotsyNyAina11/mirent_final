import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateProforma } from "../../redux/features/commande/commandeSlice";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";

interface Prix {
  id: number;
  montant: number;
}

interface EditProformaItemProps {
  item: any;
  onSave: (updatedItem: any) => void;
  onClose: () => void;
}

const EditProformaItem: React.FC<EditProformaItemProps> = ({
  item,
  onClose,
  onSave,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [prixList, setPrixList] = useState<Prix[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: item?.id ?? "",
    proformaId: item?.proforma?.id ?? "",
    vehicleId: item?.vehicle?.id ?? "",
    regionId: item?.region?.id ?? "",
    prixId: item?.prix?.id ?? "",
  });

  const [dateDepart, setDateDepart] = useState<Date | null>(
    item?.dateDepart ? new Date(item.dateDepart) : null
  );
  const [dateRetour, setDateRetour] = useState<Date | null>(
    item?.dateRetour ? new Date(item.dateRetour) : null
  );
  const [nombreJours, setNombreJours] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(item?.subTotal ?? 0);

  // Récupération de la liste des prix au chargement
  useEffect(() => {
    const fetchPrixList = async () => {
      try {
        const res = await axios.get("http://localhost:3000/prix");
        setPrixList(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des prix :", err);
      }
    };
    fetchPrixList();
  }, []);

  // Mise à jour du nombre de jours
  useEffect(() => {
    if (dateDepart && dateRetour) {
      const diffTime = Math.abs(dateRetour.getTime() - dateDepart.getTime());
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNombreJours(days);
    }
  }, [dateDepart, dateRetour]);

  // Mise à jour du sous-total
  useEffect(() => {
    const prix = prixList.find((p) => p.id === parseInt(formData.prixId));
    if (prix) {
      setSubTotal(prix.montant * nombreJours);
    }
  }, [formData.prixId, nombreJours, prixList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const updatedItem = {
        proformaId: formData.proformaId,
        vehicleId: formData.vehicleId,
        regionId: formData.regionId,
        prixId: formData.prixId,
        dateDepart: dateDepart?.toISOString(),
        dateRetour: dateRetour?.toISOString(),
        nombreJours,
        subTotal,
      };

      const response = await axios.put(
        `http://localhost:3000/proforma/${formData.id}`, // Correction de l'endpoint ici
        updatedItem
      );

      dispatch(
        updateProforma({
          id: formData.proformaId, // Utilisation de proformaId car c'est l'ID de la proforma à mettre à jour dans le slice
          items: [{ ...updatedItem, id: formData.id }], // Envoi d'un tableau avec l'item mis à jour
        })
      );
      onSave(response.data);
      setOpenSnackbar(true);
      onClose();
    } catch (error: any) {
      // Typage de l'erreur pour un accès plus sûr aux propriétés
      console.error("Erreur lors de l’enregistrement :", error);
      setSnackbarMessage(
        error?.response?.data?.message || "Erreur lors de la mise à jour."
      ); // Affichage d'un message d'erreur plus précis si disponible
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 4, maxWidth: 600, margin: "auto", mt: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Modifier un Item de Proforma
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Véhicule ID"
            name="vehicleId"
            type="number"
            fullWidth
            value={formData.vehicleId}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Région ID"
            name="regionId"
            type="number"
            fullWidth
            value={formData.regionId}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Prix ID"
            name="prixId"
            type="number"
            fullWidth
            value={formData.prixId}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Date de départ"
            value={dateDepart}
            onChange={setDateDepart}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Date de retour"
            value={dateRetour}
            onChange={setDateRetour}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre de jours"
            value={nombreJours}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Sous-total" value={subTotal} fullWidth disabled />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose}>Annuler</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar d'erreur */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar de succès */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          La modification a bien été enregistrée !
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EditProformaItem;
