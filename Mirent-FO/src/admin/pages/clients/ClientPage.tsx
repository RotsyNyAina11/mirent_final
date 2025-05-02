import React from "react";
import { Container, Grid } from "@mui/material";
import CustomerManagement from "../../../admin/Components/Clients/CustomerPage";

const ClientPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomerManagement />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientPage;
