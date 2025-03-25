import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Grid, Box } from "@mui/material";
import Accueil from "./Components/Accueil/Accueil";
import VehiclesList from "./Components/Vehicules/Vehicule";
import Sidebar from "./Components/Sidebar/Sidebar";
import Login from "./Components/Authentification/Login";
import ClientList from "./Components/Clients/Customer";
import Reservations from "./pages/reservation";
import Performat from "./Components/Proforma/ProformaTable";
import Devis from "./Components/Devis/Devis";
import Facturation from "./Components/Proforma/Facturation";
import DetailClientPage from "./pages/ClientPage";
import Proforma from "./Components/Proforma/proformaPdf";
import ProformaForm from "./Components/Proforma/ProformaForm";
import Commande from "./pages/CommandePage";

import LocationsPage from "./pages/locationPage";
import ProformaPage from "./pages/ProformaPage";

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

        {/* Route pour la liste des clients avec Sidebar */}
        <Route
          path="/clients/:id"
          element={
            <MainLayout>
              <DetailClientPage />
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
              <ProformaPage />
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
        {/** Route pour la page Form proforma*/}
        <Route
          path="/form_proforma"
          element={
            <MainLayout>
              <ProformaForm />
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
