import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Grid, Box } from "@mui/material";
import Sidebar from "./Components/Sidebar";
import Login from "./Components/Login";
import Accueil from "./pages/Accueil";
import VehiclesList from "./pages/Vehicule";
import CustomerList from "./pages/CustomerPage";
import Contact from "./pages/contact";
import Reservations from "./pages/reservation";

const App: React.FC = () => {
  // Composant Layout pour intégrer le Sidebar et le contenu principal
  const MainLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    return (
      <Grid container>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={10}>
          <Box p={3}>{children}</Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Route pour la page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Route pour l'accueil avec Sidebar */}
        <Route
          path="/accueil"
          element={
            <MainLayout>
              <Accueil />
            </MainLayout>
          }
        />

        {/* Route pour la liste des véhicules avec Sidebar */}
        <Route
          path="/vehicules"
          element={
            <MainLayout>
              <VehiclesList />
            </MainLayout>
          }
        />
        {/* Route pour la liste des Clients avec Sidebar */}
        <Route
          path="/clients"
          element={
            <MainLayout>
              <CustomerList />
            </MainLayout>
          }
        />
        {/**Route pour le contact avec sidebar */}
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        {/**Route pour les réservations avec sidebar */}
        <Route
          path="/reservations"
          element={
            <MainLayout>
              <Reservations />
            </MainLayout>
          }
        />

        {/* Redirection par défaut vers /accueil */}
        <Route path="*" element={<Navigate to="/accueil" />} />
      </Routes>
    </Router>
  );
};

export default App;
