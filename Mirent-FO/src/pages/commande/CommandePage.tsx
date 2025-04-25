import React from "react";
import { Container, Grid } from "@mui/material";
import Commande from "../../Components/Commandes/Commande";

import ProformasList from "../../Components/Proforma/proformaList";
//import ProformaTable from "../../Components/Proforma/ProformaTable";

const CommandePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Commande />

      {/* Liste des proformas */}
      <Grid item xs={12}>
        <ProformasList />
      </Grid>
    </Container>
  );
};
export default CommandePage;
