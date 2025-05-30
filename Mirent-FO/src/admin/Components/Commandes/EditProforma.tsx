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
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { updateProforma } from "../../../redux/features/commande/commandeSlice";

// Interfaces pour les données externes
interface Prix {
  id: number;
  montant: number;
}

interface Region {
  id: number;
  nom_region: string;
}

// Interface pour les props du composant
interface EditProformaItemProps {
  item: any; // L'item de proforma à éditer
  onSave: (updatedItem: any) => void; // Callback appelé après sauvegarde réussie
  onClose: () => void; // Callback appelé pour fermer le formulaire
}

const EditProformaItem: React.FC<EditProformaItemProps> = ({
  item,
  onSave,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [prixList, setPrixList] = useState<Prix[]>([]);
  const [regionList, setRegionList] = useState<Region[]>([]); // Renommé pour éviter la confusion avec 'region'
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  // État du formulaire, adapté pour correspondre au DTO backend
  const [formData, setFormData] = useState({
    id: item?.id ?? "",
    clientId: item?.client?.id ?? "",
    vehicleCriteria: { id: item?.vehicle?.id ?? "" },
    regionName: item?.region?.nom_region ?? "",
    proformaId: item?.proforma?.id ?? "",
    prixId: item?.prix?.id ?? "",
  });

  // États pour les dates et les calculs dérivés
  const [dateDepart, setDateDepart] = useState<Date | null>(
    item?.dateDepart ? new Date(item.dateDepart) : null
  );
  const [dateRetour, setDateRetour] = useState<Date | null>(
    item?.dateRetour ? new Date(item.dateRetour) : null
  );
  const [nombreJours, setNombreJours] = useState(item?.nombreJours ?? 0);
  const [subTotal, setSubTotal] = useState<number>(item?.subTotal ?? 0);

  // Effet pour charger les régions au montage du composant
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/regions");
        setRegionList(response.data);
        console.log("Régions chargées :", response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des régions :", error);
      }
    };
    fetchRegions();
  }, []);

  // Effet pour calculer le nombre de jours lorsque les dates changent
  useEffect(() => {
    if (dateDepart && dateRetour) {
      if (dateRetour < dateDepart) {
        setSnackbarMessage(
          "La date de retour doit être postérieure à la date de départ."
        );
        setSnackbarOpen(true);
        setLoading(false); // Réinitialise le chargement si erreur
        setNombreJours(0); // Réinitialise le nombre de jours
        setSubTotal(0); // Réinitialise le sous-total
        return;
      }

      // Calcul du nombre de jours
      const depart = new Date(dateDepart);
      const retour = new Date(dateRetour);
      const diffTime = retour.getTime() - depart.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setNombreJours(diffDays);
    }
  }, [dateDepart, dateRetour]);

  // Effet pour mettre à jour le sous-total lorsque le prix ou le nombre de jours changent
  useEffect(() => {
    if (formData.prixId && nombreJours > 0) {
      // S'assurer que nombreJours est positif
      const prix = prixList.find(
        (p) => p.id === Number(formData.prixId)
      )?.montant;

      if (prix) {
        const total = nombreJours * prix;
        setSubTotal(total);
      } else {
        setSubTotal(0); // Réinitialiser si le prix n'est pas trouvé
      }
    } else {
      setSubTotal(0); // Réinitialiser si prixId ou nombreJours n'est pas valide
    }
  }, [formData.prixId, nombreJours, prixList]); // Dépendance à prixList pour s'assurer que les prix sont chargés

  // Gestionnaire de changement pour les champs de texte
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "vehicleId") {
      // Gérer vehicleId qui fait partie de vehicleCriteria
      setFormData((prev) => ({
        ...prev,
        vehicleCriteria: { id: value }, // Mettre à jour l'objet vehicleCriteria
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Gestionnaire de sauvegarde de l'item de proforma
  const handleSave = async () => {
    setLoading(true);

    try {
      const updatedItemPayload = {
        clientId: Number(formData.clientId),
        vehicleCriteria: { id: Number(formData.vehicleCriteria.id) },
        regionName: formData.regionName,
        dateDepart: dateDepart?.toISOString(),
        dateRetour: dateRetour?.toISOString(),
        nombreJours: nombreJours,
        prixId: Number(formData.prixId),
      };

      const response = await axios.put(
        `http://localhost:3000/proforma/${formData.id}`,
        updatedItemPayload
      );

      // Dispatch de l'action Redux (peut nécessiter une adaptation si le store attend plus de champs)
      dispatch(
        updateProforma({
          id: formData.proformaId,
          items: [{ ...updatedItemPayload, id: formData.id }],
        })
      );

      onSave(response.data);
      setOpenSnackbar(true);
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de l’enregistrement :", error);
      setSnackbarMessage(
        error?.response?.data?.message || "Erreur lors de la mise à jour."
      );
      setSnackbarOpen(true); // Afficher le snackbar d'erreur
    } finally {
      setLoading(false); // Désactiver l'état de chargement
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: "auto",
        mt: 2,
        borderRadius: "8px",
      }}
      className="shadow-lg"
    >
      <Typography
        variant="h5"
        gutterBottom
        className="text-center font-bold text-gray-800 mb-6"
      >
        Modifier un Item de Proforma
      </Typography>
      <Grid container spacing={3}>
        {" "}
        {/* Augmenté l'espacement pour une meilleure lisibilité */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Client ID"
            name="clientId"
            type="number"
            fullWidth
            value={formData.clientId.id}
            onChange={handleChange}
            variant="outlined"
            size="small"
            className="rounded-md"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* Champ pour l'ID du véhicule, qui sera enveloppé dans vehicleCriteria */}
          <TextField
            label="Véhicule ID (Critères)"
            name="vehicleId" // Utilisez 'vehicleId' pour le champ, mais il met à jour 'vehicleCriteria.id'
            type="number"
            fullWidth
            value={formData.vehicleCriteria.id}
            onChange={handleChange}
            variant="outlined"
            size="small"
            className="rounded-md"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* Champ pour le nom de la région, car le DTO attend 'regionName' */}
          <TextField
            label="Nom de la Région"
            name="regionName"
            fullWidth
            value={formData.regionName}
            onChange={handleChange}
            variant="outlined"
            size="small"
            className="rounded-md"
            select // Utiliser un select pour les régions existantes
          >
            {regionList.map((region) => (
              <MenuItem key={region.id} value={region.nom_region}>
                {region.nom_region}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3}>
          <DatePicker
            label="Date de départ"
            value={dateDepart}
            onChange={(value) => setDateDepart(value ? value.toDate() : null)}
            className="w-full" // Tailwind class for full width
            slotProps={{
              textField: {
                size: "small",
                variant: "outlined",
                className: "rounded-md",
              },
            }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <DatePicker
            label="Date de retour"
            value={dateRetour}
            onChange={(value) => setDateRetour(value ? value.toDate() : null)}
            className="w-full" // Tailwind class for full width
            slotProps={{
              textField: {
                size: "small",
                variant: "outlined",
                className: "rounded-md",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre de jours"
            value={nombreJours}
            fullWidth
            disabled
            variant="outlined"
            size="small"
            className="rounded-md"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* Afficher le sous-total avec 2 décimales */}
          <TextField
            label="Sous-total"
            value={subTotal.toFixed(2)}
            fullWidth
            disabled
            variant="outlined"
            size="small"
            className="rounded-md"
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              onClick={onClose}
              variant="outlined"
              className="rounded-md shadow-sm hover:shadow-md transition-all"
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              className="rounded-md shadow-md hover:shadow-lg transition-all bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        // Change this: if the user clicks outside or on the close icon, it should close
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          // Change this: if the user clicks the close icon on the alert itself
          onClose={() => setSnackbarOpen(false)}
          className="rounded-md"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        // Change this: if the user clicks outside or on the close icon, it should close
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          // Change this: if the user clicks the close icon on the alert itself
          onClose={() => setOpenSnackbar(false)}
          className="rounded-md"
        >
          La modification a bien été enregistrée !
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EditProformaItem;
