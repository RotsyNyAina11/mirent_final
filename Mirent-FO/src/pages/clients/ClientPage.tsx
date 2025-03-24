import { Container, Grid } from "@mui/material";
import CustomerManagement from "../../Components/clients/CustomerPage";

const ClientPage: React.FC = () => {
    return (
        <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomerManagement/>
          </Grid>
        </Grid>
      </Container>
    );
}

export default ClientPage;