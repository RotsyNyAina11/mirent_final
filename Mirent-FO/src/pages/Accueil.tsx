import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Sidebar from "../Components/Sidebar";
import TopBar from "../Components/TopBar";
import SearchFilters from "../Components/SearchFilter";
import VehicleCard from "../Components/VehicleCard";
import { Container } from "@mui/material";

const Home: React.FC = () => {
  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);

  return (
    <Container>
      <TopBar />
      <Sidebar />
      <Box sx={{ p: 3, ml: 8 }}>
        <Typography variant="h4" gutterBottom>
          Find Your Perfect Ride
        </Typography>
        <SearchFilters />
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item key={vehicle.id} xs={12} sm={6} md={4}>
              <VehicleCard vehicle={vehicle} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
