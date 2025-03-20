import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import {
    setClientId,
    setDate,
    setContractReference,
    setNotes,
    createProforma,
} from '../../redux/features/proforma/proformaSlice';
import { selectProforma } from '../../redux/features/proforma/proformaSelector';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
} from '@mui/material';
import ProformaItemForm from './proformaItem';
import { useNavigate } from 'react-router-dom';

const ProformaForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { clientId, date, contractReference, notes, items, isLoading, error } = useSelector(selectProforma);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await dispatch(createProforma({
            clientId,
            date,
            contractReference,
            notes,
            items,
        }));
        navigate("/pdf")
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Création de Proforma
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="ID Client"
                    type="number"
                    value={clientId}
                    onChange={(e) => dispatch(setClientId(Number(e.target.value)))}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => dispatch(setDate(e.target.value))}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Référence du Contrat"
                    value={contractReference}
                    onChange={(e) => dispatch(setContractReference(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Notes"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => dispatch(setNotes(e.target.value))}
                    fullWidth
                    margin="normal"
                />

                <ProformaItemForm />

                <Box mt={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'En cours...' : 'Créer Proforma'}
                    </Button>
                    {error && (
                        <Typography color="error" mt={1}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </form>
        </Container>
    );
};

export default ProformaForm;