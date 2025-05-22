import { Container, Grid } from "@mui/material";
import CustomerManagement from "../../../admin/Components/Clients/Customer";

const ClientPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CustomerManagement />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientPage;
