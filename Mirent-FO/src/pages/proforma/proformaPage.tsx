import { Container, Grid } from "@mui/material";
import CreateProforma from "../../Components/Proforma/createProforma";
import ProformasList from "../../Components/Proforma/ProformaList";

const ProformaPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Formulaire de création de proforma */}
        <Grid item xs={12}>
          <CreateProforma />
        </Grid>
        {/* Liste des proformas */}
        <Grid item xs={12}>
          <ProformasList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProformaPage;
