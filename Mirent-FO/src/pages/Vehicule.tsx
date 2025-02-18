import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  LinearProgress,
} from "@mui/material";
import VehicleService  from "../services/api";

interface Vehicle {
  id: number;
  nom: string;
  marque: string;
  modele: string;
  type: string;
  immatriculation: string;
  nombrePlace: number;
  status: string;
}

const VehiclesList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les véhicules depuis le backend au chargement du composant
    const fetchVehicles = async () => {
      try {
        const data = await VehicleService.getAllVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules :", error);
      } finally {
        setLoading(false); // Désactiver le loader après le chargement
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Liste des véhicules
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Liste des véhicules
      </Typography>

      {/* Tableau des véhicules */}
      <TableContainer component={Paper}>
        <Table aria-label="liste des véhicules">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Marque</TableCell>
              <TableCell>Modèle</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Immatriculation</TableCell>
              <TableCell>Places</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.nom}</TableCell>
                <TableCell>{vehicle.marque}</TableCell>
                <TableCell>{vehicle.modele}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.immatriculation}</TableCell>
                <TableCell align="center">{vehicle.nombrePlace}</TableCell>
                <TableCell>
                  {vehicle.status === "disponible" ? (
                    <Typography color="success.main">Disponible</Typography>
                  ) : (
                    <Typography color="error.main">Loué</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VehiclesList;