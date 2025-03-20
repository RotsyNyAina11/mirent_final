import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addItem,
    removeItem,
    clearItems,
} from '../../redux/features/proforma/proformaSlice';
import { selectProforma } from '../../redux/features/proforma/proformaSelector';
import {
    TextField,
    Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ProformaItemForm: React.FC = () => {
    const dispatch = useDispatch();
    const { items } = useSelector(selectProforma);
    const [vehicleId, setVehicleId] = useState<number>(0);
    const [regionId, setRegionId] = useState<number>(0);
    const [prixId, setPrixId] = useState<number>(0);
    const [dateDepart, setDateDepart] = useState<string>('');
    const [dateRetour, setDateRetour] = useState<string>('');

    const handleAddItem = () => {
        dispatch(
            addItem({
                vehicleId,
                regionId,
                prixId,
                dateDepart,
                dateRetour,
            })
        );
        setVehicleId(0);
        setRegionId(0);
        setPrixId(0);
        setDateDepart('');
        setDateRetour('');
    };

    const handleRemoveItem = (index: number) => {
        dispatch(removeItem(index));
    };

    const handleClearItems = () => {
        dispatch(clearItems());
    };

    return (
        <div>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                    <TextField
                        label="ID Véhicule"
                        type="number"
                        value={vehicleId}
                        onChange={(e) => setVehicleId(Number(e.target.value))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="ID Région"
                        type="number"
                        value={regionId}
                        onChange={(e) => setRegionId(Number(e.target.value))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="ID Prix"
                        type="number"
                        value={prixId}
                        onChange={(e) => setPrixId(Number(e.target.value))}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Date Départ"
                        type="date"
                        value={dateDepart}
                        onChange={(e) => setDateDepart(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Date Retour"
                        type="date"
                        value={dateRetour}
                        onChange={(e) => setDateRetour(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddItem}
                    >
                        Ajouter un article
                    </Button>
                </Grid>
            </Grid>

            <List>
                {items.map((item, index) => (
                    <ListItem key={index} secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(index)}>
                            <DeleteIcon />
                        </IconButton>
                    }>
                        <ListItemText
                            primary={`Véhicule: ${item.vehicleId}, Région: ${item.regionId}, Prix: ${item.prixId}`}
                            secondary={`Du ${item.dateDepart} au ${item.dateRetour}`}
                        />
                    </ListItem>
                ))}
            </List>

            {items.length > 0 && (
                <Button variant="outlined" color="secondary" onClick={handleClearItems}>
                    Effacer les articles
                </Button>
            )}
        </div>
    );
};

export default ProformaItemForm;