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
  prix: number;
}

interface Region {
  id: number;
  nom_region: string;
}

// Interface pour les props du composant
interface EditProformaItemProps {
  item: any;
  onSave: (updatedItem: any) => void;
  onClose: () => void;
}

const EditProformaItem: React.FC<EditProformaItemProps> = ({
  item,
  onSave,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [prixList, setPrixList] = useState<Prix[]>([]);
  const [regionList, setRegionList] = useState<Region[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  ); // New state for snackbar severity
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
        setSnackbarMessage("Erreur lors du chargement des régions.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchRegions();
  }, []);
  useEffect(() => {
    const fetchPrix = async () => {
      try {
        const response = await axios.get("http://localhost:3000/prixs");
        setPrixList(response.data);
        console.log("Prix chargés :", response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des prix :", error);
        setSnackbarMessage("Erreur lors du chargement des prix.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchPrix();
  }, []);

  // Effet pour calculer le nombre de jours lorsque les dates changent
  useEffect(() => {
    if (dateDepart && dateRetour) {
      if (dateRetour < dateDepart) {
        setSnackbarMessage(
          "La date de retour doit être postérieure à la date de départ."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        setNombreJours(0);
        setSubTotal(0);
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
      const prix = prixList.find((p) => p.id === Number(formData.prixId))?.prix;

      if (prix) {
        const total = nombreJours * prix;
        setSubTotal(total);
      } else {
        setSubTotal(0);
      }
    } else {
      setSubTotal(0);
    }
  }, [formData.prixId, nombreJours, prixList]);

  // Gestionnaire de changement pour les champs de texte
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "vehicleId") {
      setFormData((prev) => ({
        ...prev,
        vehicleCriteria: { id: value },
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
      setSnackbarMessage("Proforma modifié avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de l’enregistrement :", error);
      setSnackbarMessage(
        error?.response?.data?.message ||
          "Une erreur est survenue lors de la modification du proforma."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(true);
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
            value={formData.clientId}
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
          <TextField
            label="Nom de la Région"
            name="regionName"
            fullWidth
            value={formData.regionName}
            onChange={handleChange}
            variant="outlined"
            size="small"
            className="rounded-md"
            select
          >
            {regionList.map((region) => (
              <MenuItem key={region.id} value={region.nom_region}>
                {region.nom_region} {region.prix.prix}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Prix"
            name="prixId"
            fullWidth
            select
            value={formData.prixId}
            onChange={handleChange}
            variant="outlined"
            size="small"
            className="rounded-md"
          >
            {prixList.map((prix) => (
              <MenuItem key={prix.id} value={prix.id}>
                {prix.prix}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3}>
          <DatePicker
            label="Date de départ"
            value={dateDepart}
            onChange={(value) =>
              setDateDepart(
                value
                  ? typeof value === "object" && "toDate" in value
                    ? (value as any).toDate()
                    : (value as Date)
                  : null
              )
            }
            className="w-full"
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
            onChange={(value) =>
              setDateRetour(
                value
                  ? typeof value === "object" && "toDate" in value
                    ? (value as any).toDate()
                    : (value as Date)
                  : null
              )
            }
            className="w-full"
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
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EditProformaItem;
