import React, { useState } from "react";
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
import { Proforma, ProformaStatus } from "../../models/Proforma";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  createProforma,
  updateProforma,
  selectProformasLoading,
  selectProformasError,
} from "../../redux/features/proforma/proformaSlice";

interface ProformaFormProps {
  proforma?: Proforma | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const ProformaForm: React.FC<ProformaFormProps> = ({
  proforma,
  onClose,
  onSubmitSuccess,
}) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectProformasLoading);
  const error = useAppSelector(selectProformasError);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.proformaNumber.trim()) {
      newErrors.proformaNumber = "Le numéro est requis";
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = "Le montant doit être positif";
    }

    if (!formData.clientId || formData.clientId <= 0) {
      newErrors.clientId = "Client invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    // ... reste du code
  };

  const isEditMode = !!proforma?.id;

  const [formData, setFormData] = useState<
    Omit<Proforma, "id" | "createdAt" | "updatedAt">
  >(() => ({
    proformaNumber: proforma?.proformaNumber || "",
    date: proforma?.date || new Date().toISOString().slice(0, 10),
    totalAmount: proforma?.totalAmount || 0,
    clientId: proforma?.clientId || 0,
    status: proforma?.status || ProformaStatus.DRAFT,
    createdAt: proforma?.createdAt || 0,
    updatedAt: proforma?.updatedAt || 0,
    contractReference: proforma?.contractReference || "",
    notes: proforma?.notes || "",
  }));

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
              onChange={handleChange}
              error={!!errors.proformaNumber}
              helperText={errors.proformaNumber}
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
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
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
              onChange={handleChange}
              inputProps={{ min: 0, step: "0.01" }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID Client"
              type="number"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Statut *</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Statut *"
                focused
              >
                {Object.values(ProformaStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status === ProformaStatus.DRAFT && "Brouillon"}
                    {status === ProformaStatus.SENT && "Envoyé"}
                    {status === ProformaStatus.APPROVED && "Approuvé"}
                    {status === ProformaStatus.REJECTED && "Rejeté"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Créer le"
              type="date"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Modifier le"
              type="date"
              name="updatedAt"
              value={formData.updatedAt}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              required
            />
          </Grid>

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

              <Button variant="outlined" onClick={onClose} disabled={loading}>
                Annuler
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProformaForm;
