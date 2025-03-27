import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "./Components/Sidebar/Sidebar";
import Login from "./Components/login/Login";

import Reservations from "./pages/reservation";
import Performat from "./pages/proforma/ProformaPage";
import Devis from "./pages/DevisPage";
import ProformaPage from "./pages/proforma/ProformaPage";
import Commande from "./pages/commande/CommandePage";

import LocationsPage from "./pages/lieux/locationPage";
import ProformaPdf from "./Components/Proforma/proformaPdf";
import ContratPage from "./pages/contrat/contratPage";
import Vehicule from "./pages/vehicules/vehiculePage";
import ClientPage from "./pages/clients/ClientPage";
import Home from "./pages/acceuil/HomePage";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  // Composant Layout pour intégrer le Sidebar et le contenu principal
  const MainLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");
    const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);

    useEffect(() => {
      setIsCollapsed(isSmallScreen);
    }, [isSmallScreen]);

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Conteneur principal avec Sidebar et contenu */}
        <Box display="flex" flexGrow={1} pt={7}>
          {" "}
          {/* Ajustement de pt pour la nouvelle hauteur de l'en-tête (56px) */}
          {/* Sidebar (contient déjà l'en-tête) */}
          <Box sx={{ width: isCollapsed ? "60px" : "250px", flexShrink: 0 }}>
            <Sidebar onCollapseChange={setIsCollapsed} />
          </Box>
          {/* Contenu principal */}
          <Box flexGrow={1} p={3}>
            {children}
          </Box>
        </Box>
      </Box>
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
              <Home />
            </MainLayout>
          }
        />

        {/* Route pour la liste des véhicules avec Sidebar */}
        <Route
          path="/vehicules"
          element={
            <MainLayout>
              <Vehicule />
            </MainLayout>
          }
        />
        {/* Route pour la liste des clients avec Sidebar */}
        <Route
          path="/clients"
          element={
            <MainLayout>
              <ClientPage />
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
        {/* Route pour la page Table proforma */}
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

        <Route
          path="/proforma-pdf"
          element={
            <MainLayout>
              <ProformaPdf />
            </MainLayout>
          }
        />

        {/* Route pour la page de Contrat */}
        <Route
          path="/contrats"
          element={
            <MainLayout>
              <ContratPage />
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
