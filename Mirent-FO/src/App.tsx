import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Grid, Box } from "@mui/material";
import Accueil from "./pages/Accueil";
import VehiclesList from "./pages/Vehicule";
import Sidebar from "./Components/Sidebar";
import Login from "./Components/Login";
import ClientList from "./pages/CustomerPage";
import Reservations from "./pages/reservation";
import Performat from "./pages/ProformaTable";
import Devis from "./pages/Devis";
import Facturation from "./pages/FacturationPage";

//import ProformaList from "./pages/ProformaList";
import ProformaForm from "./Components/ProformaForm";
import Commande from "./pages/CommandePage";
//import ProformaList from "./pages/ProformaList";

import LocationsPage from "./pages/locationPage";

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
        {/*<Route path="/" element={<Login />} />*/}
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
        {/* Route pour la liste des clients avec Sidebar */}
        <Route
          path="/clients"
          element={
            <MainLayout>
              <ClientList />
            </MainLayout>
          }
        />
        {/* Route pour la page de reservation */}
        <Route
          path="/reservations"
          element={
            <MainLayout>
              <Reservations />
            </MainLayout>
          }
        />
        {/* Route pour la page de Performat sur la commande */}
        <Route
          path="/proformat"
          element={
            <MainLayout>
              <ProformaForm />
            </MainLayout>
          }
        />
        {/** Route pour la page Table proforma*/}
        <Route
          path="/tableau_proforma"
          element={
            <MainLayout>
              <Performat />
            </MainLayout>
          }
        />

        {/* Route pour la page de Devis sur la commande */}
        <Route
          path="/devis"
          element={
            <MainLayout>
              <Devis />
            </MainLayout>
          }
        />
        {/* Route pour la page de Facturation sur la commande */}
        <Route
          path="/facturation"
          element={
            <MainLayout>
              <Facturation />
            </MainLayout>
          }
        />

        {/* Route pour la page  sur la commande */}

        {/* Route pour la page des lieux */}
        <Route
          path="/lieux"
          element={
            <MainLayout>
              <LocationsPage />
            </MainLayout>
          }
        />
        {/* Route pour la page sur la commande */}

        <Route
          path="/commande"
          element={
            <MainLayout>
              <Commande />
            </MainLayout>
          }
        />
        {/* Route pour la page des lieux */}
        <Route
          path="/lieux"
          element={
            <MainLayout>
              <LocationsPage />
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
