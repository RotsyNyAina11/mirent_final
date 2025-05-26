import React from "react";
import { Container, Grid } from "@mui/material";
import Commande from "../../../admin/Components/Commandes/Commande";
import FacturationPage from "../../Components/Proforma/Facturation";

const CommandePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Commande />
      <Grid container spacing={3}>
        {/* Formulaire de création de proforma */}
        <Grid item xs={12}>
          <FacturationPage />
        </Grid>
      </Grid>
    </Container>
  );
};
export default CommandePage;
