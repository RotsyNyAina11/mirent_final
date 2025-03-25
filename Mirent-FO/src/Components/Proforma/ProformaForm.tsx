import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  setClientId,
  setDate,
  setContractReference,
  setNotes,
  createProforma,
  ProformaItem,
} from "../../redux/features/proforma/proformaSlice";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Alert,
} from "@mui/material";
import ProformaItemForm from "./proformaItem";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const ProformaForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    clientId,
    date,
    contractReference,
    notes,
    items,
    createStatus,
    error,
  } = useSelector((state: RootState) => state.proforma);

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const calculateTotalAmount = (items: ProformaItem[]): number => {
      return items.reduce((total, item) => {
        return total + (item.prixId ?? 0);
      }, 0);
    };
    const totalAmount = calculateTotalAmount(items);

    const proformaNumber = `PROFORMA-${uuidv4()}`;

    const proformaData = {
      clientId,
      date,
      contractReference,
      notes,
      items,
      totalAmount,
      proformaNumber,
    };

    dispatch(createProforma(proformaData))
      .unwrap()
      .then(() => {
        navigate("/pdf");
      })
      .catch((err) => {
        setErrorMessage(
          err.message || "Erreur lors de la création de la proforma."
        );
      });
  };

  return (
    <Box sx={{ mt: 4 }} maxWidth="100%">
      <Container>
        <Typography variant="h4" component="h1" align="center">
          Création de Proforma
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {errorMessage && (
              <Grid item xs={12}>
                <Alert severity="error">{errorMessage}</Alert>
              </Grid>
            )}
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            <Grid item xs={6} sm={3}>
              <TextField
                label="ID Client"
                type="number"
                value={clientId}
                onChange={(e) => dispatch(setClientId(Number(e.target.value)))}
                fullWidth
                margin="normal"
                focused
                color="secondary"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => dispatch(setDate(e.target.value))}
                fullWidth
                margin="normal"
                focused
                color="secondary"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Référence du Contrat"
                value={contractReference}
                onChange={(e) => dispatch(setContractReference(e.target.value))}
                fullWidth
                margin="normal"
                focused
                color="secondary"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Notes"
                multiline
                rows={2}
                value={notes}
                onChange={(e) => dispatch(setNotes(e.target.value))}
                fullWidth
                margin="normal"
                focused
                color="secondary"
              />
            </Grid>
            <Grid item xs={12}>
              <ProformaItemForm />
            </Grid>

            <Grid item xs={12}>
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  disabled={createStatus === "loading"}
                  sx={{ marginRight: 2 }}
                >
                  {createStatus === "loading"
                    ? "En cours..."
                    : "Créer Proforma"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default ProformaForm;
