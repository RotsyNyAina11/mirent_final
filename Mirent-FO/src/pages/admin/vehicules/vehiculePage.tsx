import { Container, Grid} from "@mui/material";
import VehiclesList from "../../../Components/vehicule/VehiculeList";


const Vehicule: React.FC = () => {
    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <VehiclesList/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Vehicule;