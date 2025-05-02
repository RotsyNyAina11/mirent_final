import { Container, Grid } from "@mui/material";
import React from "react";
import ProformasList from "../../Components/Proforma/ProformaList";

const ProformaList: React.FC = () => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProformasList />
        </Grid>
      </Grid>
    </Container>
  );
};
export default ProformaList;
