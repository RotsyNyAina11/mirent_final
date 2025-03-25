import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProforma } from "../../redux/features/proforma/proformaSelector";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ProformaItemForm: React.FC = () => {
  const dispatch = useDispatch();
  const { proformas: items } = useSelector(selectProforma);

  const [vehicleId, setVehicleId] = useState<number>(0);
  const [regionId, setRegionId] = useState<number>(0);
  const [prixId, setPrixId] = useState<number>(0);
  const [dateDepart, setDateDepart] = useState<string>("");
  const [dateRetour, setDateRetour] = useState<string>("");

  const handleAddItem = () => {
    if (vehicleId <= 0 || regionId <= 0 || prixId <= 0) {
      alert("Les IDs doivent être des nombres positifs.");
      return;
    }
    if (!dateDepart || !dateRetour) {
      alert("Veuillez saisir les dates de départ et de retour.");
      return;
    }

    // Dispatch an action to add the item (replace with your actual action)
    dispatch({
      type: "ADD_PROFORMA_ITEM",
      payload: { vehicleId, regionId, prixId, dateDepart, dateRetour },
    });

    // Reset the form fields
    setVehicleId(0);
    setRegionId(0);
    setPrixId(0);
    setDateDepart("");
    setDateRetour("");
  };

  const handleDeleteItem = (index: number) => {
    // Dispatch an action to delete the item (replace with your actual action)
    dispatch({
      type: "DELETE_PROFORMA_ITEM",
      payload: index,
    });
  };

  const handleClearItems = () => {
    // Dispatch an action to clear all items (replace with your actual action)
    dispatch({
      type: "CLEAR_PROFORMA_ITEMS",
    });
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            label="ID Véhicule"
            type="number"
            value={vehicleId}
            onChange={(e) => setVehicleId(Number(e.target.value))}
            focused
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="ID Région"
            type="number"
            value={regionId}
            onChange={(e) => setRegionId(Number(e.target.value))}
            focused
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="ID Prix"
            type="number"
            value={prixId}
            onChange={(e) => setPrixId(Number(e.target.value))}
            focused
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Date Départ"
            type="date"
            value={dateDepart}
            onChange={(e) => setDateDepart(e.target.value)}
            focused
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Date Retour"
            type="date"
            value={dateRetour}
            onChange={(e) => setDateRetour(e.target.value)}
            focused
            fullWidth
          />
        </Grid>
      </Grid>

      <List>
        {items.map((item: any, index: number) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteItem(index)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`Véhicule: ${item.vehicleId}, Région: ${item.regionId}, Prix: ${item.prixId}`}
              secondary={`Départ: ${item.dateDepart}, Retour: ${item.dateRetour}`}
            />
          </ListItem>
        ))}
      </List>

      {items.length > 0 && (
        <Button variant="contained" color="error" onClick={handleClearItems}>
          Effacer les articles
        </Button>
      )}
    </div>
  );
};

export default ProformaItemForm;
