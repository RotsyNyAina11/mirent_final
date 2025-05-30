import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "../layouts/MainLayouts";
import Devis from "../admin/pages/Devis/DevisPage";
import ProformaPage from "../admin/pages/proforma/proformaPage";
import Commande from "../admin/pages/commande/CommandePage";
import LocationsPage from "../admin/pages/lieux/locationPage";
import ContratPage from "../admin/pages/contrat/contratPage";
import Vehicule from "../admin/pages/vehicules/vehiculePage";
import Types from "../admin/pages/Types/type";
import ClientPage from "../admin/pages/clients/ClientPage";
import ClientDetailPage from "../admin/pages/ClientDetailPage/clientdetailPage";
import Home from "../admin/pages/acceuil/HomePage";
import ContactPage from "../admin/pages/Contact/ContactPage";
import ProformaList from "../admin/pages/proforma/ProformaList";
//import ReservationPage from "./pages/proforma/proformaPage";
//import ProformaPage from "./pages/proforma/proformaPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/home" />} />

      {/* Route pour l'accueil avec Sidebar */}
      <Route
        path="home"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      {/* Route pour la liste des véhicules avec Sidebar */}
      <Route
        path="vehicules"
        element={
          <MainLayout>
            <Vehicule />
          </MainLayout>
        }
      />

      {/* Route pour la liste des types de véhicules avec Sidebar */}
      <Route
        path="types"
        element={
          <MainLayout>
            <Types />
          </MainLayout>
        }
      />
      {/* Route pour la liste des clients avec Sidebar */}
      <Route
        path="clients"
        element={
          <MainLayout>
            <ClientPage />
          </MainLayout>
        }
      />
      {/* Route pour la page de la détail d'un client */}

      <Route
        path="client_detail"
        element={
          <MainLayout>
            <ClientDetailPage />
          </MainLayout>
        }
      />

      {/* Route pour la page de Performat sur la commande */}
      <Route
        path="proformat"
        element={
          <MainLayout>
            <ProformaPage />
          </MainLayout>
        }
      />
      {/* Route pour la page de liste des proformas */}
      <Route
        path="/proformat/liste"
        element={
          <MainLayout>
            <ProformaList />
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

      {/* Route pour la page de Devis sur la commande */}
      <Route
        path="devis"
        element={
          <MainLayout>
            <Devis />
          </MainLayout>
        }
      />

      {/* Route pour la page des lieux */}
      <Route
        path="lieux"
        element={
          <MainLayout>
            <LocationsPage />
          </MainLayout>
        }
      />
      {/* Route pour la page sur la commande */}
      <Route
        path="/proformat/nouveau"
        element={
          <MainLayout>
            <Commande />
          </MainLayout>
        }
      />

      {/* Route pour la page de Contrat */}
      <Route
        path="contrats"
        element={
          <MainLayout>
            <ContratPage />
          </MainLayout>
        }
      />
      {/* Route pour la page de Contact */}
      <Route
        path="contact"
        element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
