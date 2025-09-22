import { Container, Grid } from "@mui/material";
import ClientDetailList from "../../Components/Clients/ClientDetailList";

const ClientDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ClientDetailList />
        </Grid>
      </Grid>
    </Container>
  );
};
export default ClientDetailPage;
