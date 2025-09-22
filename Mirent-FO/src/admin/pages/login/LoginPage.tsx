import { Container, Grid } from "@mui/material";
import Login from "../../../Component/login/Login";

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Login />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
