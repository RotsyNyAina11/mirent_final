// src/components/Proforma/ProformaItemForm.tsx
import React from "react";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface ProformaItemFormProps {
  item: {
    vehicleId: number;
    regionId: number;
    prixId: number;
    dateDepart: string;
    dateRetour: string;
    nombreJours: number;
    subTotal: number;
  };
  index: number;
  vehicles: any[];
  regions: any[];
  prixList: any[];
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}

const ProformaItemForm: React.FC<ProformaItemFormProps> = ({
  item,
  index,
  vehicles,
  regions,
  prixList,
  onChange,
  onRemove,
}) => {
  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDateChange = (
    field: "dateDepart" | "dateRetour",
    value: Date | null
  ) => {
    if (!value) return;

    const dateStr = value.toISOString().split("T")[0];
    onChange(index, field, dateStr);

    // Recalculate days if both dates are set
    if (field === "dateDepart" && item.dateRetour) {
      const days = calculateDays(dateStr, item.dateRetour);
      onChange(index, "nombreJours", days);
    } else if (field === "dateRetour" && item.dateDepart) {
      const days = calculateDays(item.dateDepart, dateStr);
      onChange(index, "nombreJours", days);
    }
  };

  return (
    <Box sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Véhicule</InputLabel>
            <Select
              value={item.vehicleId || ""}
              onChange={(e) =>
                onChange(index, "vehicleId", Number(e.target.value))
              }
              label="Véhicule"
              required
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.marque} {vehicle.modele}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Région</InputLabel>
            <Select
              value={item.regionId || ""}
              onChange={(e) =>
                onChange(index, "regionId", Number(e.target.value))
              }
              label="Région"
              required
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Prix</InputLabel>
            <Select
              value={item.prixId || ""}
              onChange={(e) =>
                onChange(index, "prixId", Number(e.target.value))
              }
              label="Prix"
              required
            >
              {prixList.map((prix) => (
                <MenuItem key={prix.id} value={prix.id}>
                  {prix.montant} €
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Date Départ"
            value={item.dateDepart ? new Date(item.dateDepart) : null}
            onChange={(date) => handleDateChange("dateDepart", date)}
            renderInput={(params) => (
              <TextField {...params} fullWidth required />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Date Retour"
            value={item.dateRetour ? new Date(item.dateRetour) : null}
            onChange={(date) => handleDateChange("dateRetour", date)}
            renderInput={(params) => (
              <TextField {...params} fullWidth required />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Nombre de jours"
            type="number"
            value={item.nombreJours || 0}
            onChange={(e) =>
              onChange(index, "nombreJours", Number(e.target.value))
            }
            required
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Sous-total"
            type="number"
            value={item.subTotal || 0}
            onChange={(e) =>
              onChange(index, "subTotal", Number(e.target.value))
            }
            required
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={2}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <IconButton onClick={() => onRemove(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProformaItemForm;
