import { Container } from "@mui/material";
import EditVehicule from "../Components/Vehicules/EditVehicle";
import AddVehicule from "../Components/Vehicules/AddVehicle";
import VehicleComponent from "../Components/Vehicules/Vehicule";

const Vehicle: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <EditVehicule />
      <AddVehicule />
      <VehicleComponent />
    </Container>
  );
};

export default Vehicle;
