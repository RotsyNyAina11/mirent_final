import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { Vehicle } from "../types/vehicule";
import { useDispatch } from "react-redux";
import { toggleVehicleAvailability } from "../redux/slices/VehicleSlice";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const dispatch = useDispatch();

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={vehicle.imageUrl}
        alt={`${vehicle.brand} ${vehicle.model}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {vehicle.brand} {vehicle.model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Année: {vehicle.year}
        </Typography>
        <Typography variant="h6" color="primary">
          {vehicle.price}€ / jour
        </Typography>
        <Chip
          label={vehicle.available ? "Disponible" : "Indisponible"}
          color={vehicle.available ? "success" : "error"}
          sx={{ mt: 1 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => dispatch(toggleVehicleAvailability(vehicle.id))}
          disabled={!vehicle.available}
        >
          {vehicle.available ? "Réserver" : "Indisponible"}
        </Button>
      </CardContent>
    </Card>
  );
};
export default VehicleCard;
