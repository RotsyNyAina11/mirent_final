import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "./Components/sidebar/Sidebar";
import Login from "./Components/login/Login";
import Performat from "./pages/ProformaTable";
import Devis from "./pages/Devis";
import Facturation from "./pages/FacturationPage";
import Commande from "./pages/CommandePage";
import LocationsPage from "./pages/admin/lieux/locationPage";
import ContratPage from "./pages/admin/contrat/contratPage";
import Vehicule from "./pages/admin/vehicules/vehiculePage";
import ClientPage from "./pages/admin/clients/ClientPage";
import Home from "./pages/admin/acceuil/HomePage";
import 'react-toastify/dist/ReactToastify.css';
import ProformaPage from "./pages/admin/proforma/proformaPage";
import Types from "./pages/admin/type/type";
import ClientCatalogue from "./pages/clients/clientCatalogue";
import ClientHome from "./pages/clients/pages/home";


const App: React.FC = () => {
  // Composant Layout pour intégrer le Sidebar et le contenu principal
  const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isSmallScreen = useMediaQuery("(max-width: 900px)");
    const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);

    useEffect(() => {
      setIsCollapsed(isSmallScreen);
    }, [isSmallScreen]);

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Conteneur principal avec Sidebar et contenu */}
        <Box display="flex" flexGrow={1} pt={7}> 
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
        <Route path="/acceuil" element={<ClientHome/>} />
        <Route path="/catalogue" element={<ClientCatalogue />} />

        {/* Route pour l'accueil avec Sidebar */}
        <Route
          path="/home"
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

        {/* Route pur les types de vehicules */}
        <Route
          path="/types"
          element={
            <MainLayout>
              <Types/>
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
      <Route
        path="/proformas"
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
        {/* Route pour la page de Facturation sur la commande */}
        <Route
          path="/facturation"
          element={
            <MainLayout>
              <Facturation />
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