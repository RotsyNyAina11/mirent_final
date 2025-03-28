import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ProformaStatus } from "../../models/Proforma";
import {
  createProforma,
  updateProforma,
} from "../../redux/features/proforma/proformaSlice"; // Import your service methods
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectProformasLoading,
  selectProformasError,
} from "../../redux/features/proforma/proformaSlice";
import ProformaItem from "./proformaItem";

interface ProformaFormProps {
  proforma?: Proforma | null;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

interface Proforma {
  id: number;
  proformaNumber: string;
  date: string; // Or Date
  totalAmount: number;
  clientId: number;
  status: ProformaStatus;
  contractReference: string;
  notes: string;
}

const ProformaForm: React.FC<ProformaFormProps> = ({
  proforma,
  onClose,
  onSubmitSuccess,
}) => {
  const loading = useAppSelector(selectProformasLoading);
  const error = useAppSelector(selectProformasError);
  const [formError, setFormError] = useState<Record<string, string>>({});

  const isEditMode = !!proforma?.id;

  const [formData, setFormData] = useState({
    proformaNumber: "",
    date: new Date().toISOString().split("T")[0],
    totalAmount: 0,
    clientId: 0,
    status: ProformaStatus.DRAFT,
    contractReference: "",
    notes: "",
  });

  useEffect(() => {
    if (proforma) {
      setFormData({
        proformaNumber: proforma.proformaNumber,
        date: proforma.date.split("T")[0],
        totalAmount: proforma.totalAmount,
        clientId: proforma.clientId,
        status: proforma.status,
        contractReference: proforma.contractReference,
        notes: proforma.notes,
      });
    }
  }, [proforma]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.proformaNumber.trim()) {
      newErrors.proformaNumber = "Le numéro de proforma est requis.";
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = "Le montant total doit être supérieur à 0.";
    }

    if (!formData.clientId || formData.clientId <= 0) {
      newErrors.clientId = "Un client valide est requis.";
    }

    if (!formData.status) {
      newErrors.status = "Le statut est requis.";
    }

    if (formData.contractReference.length > 50) {
      newErrors.contractReference =
        "La référence du contrat ne doit pas dépasser 50 caractères.";
    }

    if (formData.notes.length > 200) {
      newErrors.notes = "Les notes ne doivent pas dépasser 200 caractères.";
    }

    setFormError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = {
      proformaNumber: formData.proformaNumber,
      date: formData.date,
      totalAmount: parseFloat(formData.totalAmount.toString()), // Make sure it's a number
      clientId: parseInt(formData.clientId.toString(), 10), // Ensure it's a number
      status: formData.status,
      contractReference: formData.contractReference,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Données envoyées :", payload);

    try {
      if (isEditMode) {
        await updateProforma(proforma.id, payload);
      } else {
        await createProforma(payload);
      }

      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur API :", error.response.data); // API error details
      } else {
        console.error("Erreur inconnue :", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? "Modifier la Proforma" : "Créer une Nouvelle Proforma"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Numéro de Proforma"
              name="proformaNumber"
              value={formData.proformaNumber}
              onChange={handleInputChange}
              error={!!formError.proformaNumber}
              helperText={formError.proformaNumber}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Montant Total"
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleInputChange}
              required
              error={!!formError.totalAmount}
              helperText={formError.totalAmount}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID Client"
              type="number"
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              inputProps={{ min: 1 }}
              required
              error={!!formError.clientId}
              helperText={formError.clientId}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formError.status}>
              <InputLabel id="status-label">Statut *</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: event.target.value as ProformaStatus,
                  }))
                }
                label="Statut *"
                required
              >
                <MenuItem value={ProformaStatus.DRAFT}>Brouillon</MenuItem>
                <MenuItem value={ProformaStatus.SENT}>Envoyé</MenuItem>
                <MenuItem value={ProformaStatus.APPROVED}>Approuvé</MenuItem>
                <MenuItem value={ProformaStatus.REJECTED}>Rejeté</MenuItem>
              </Select>
              {formError.status && (
                <Typography variant="caption" color="error">
                  {formError.status}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contrat de référence"
              type="text"
              name="contractReference"
              value={formData.contractReference}
              onChange={handleInputChange}
              error={!!formError.contractReference}
              helperText={formError.contractReference}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              error={!!formError.notes}
              helperText={formError.notes}
            />
            <ProformaItem
              item={{
                vehicleId: 0,
                regionId: 0,
                prixId: 0,
                dateDepart: "",
                dateRetour: "",
                nombreJours: 0,
                subTotal: 0,
              }} // Replace with actual item
              index={0} // Index of item
              vehicles={[]} // Replace with actual vehicles list
              regions={[]} // Replace with actual regions list
              prixList={[]} // Replace with actual pricing list
              onChange={() => {}} // Update logic for item change
              onRemove={() => {}} // Remove logic
            />

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {isEditMode ? "Mettre à jour" : "Créer"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Annuler
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProformaForm;
