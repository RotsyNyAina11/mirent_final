import { Container, Grid } from "@mui/material";
import CreateProforma from "../../Components/Proforma/createProforma";

const ProformaPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Formulaire de création de proforma */}
        <Grid item xs={12}>
          <CreateProforma />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProformaPage;
