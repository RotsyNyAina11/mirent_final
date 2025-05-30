import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "../layouts/MainLayouts";
import Performat from "../admin/pages/proforma/ProformaList";
import Devis from "../admin/pages/Devis/DevisPage";
import ProformaPage from "../admin/pages/proforma/proformaPage";
import Commande from "../admin/pages/commande/CommandePage";
import LocationsPage from "../admin/pages/lieux/locationPage";
import Home from "../admin/pages/acceuil/HomePage";
import Vehicule from "../admin/pages/vehicules/vehiculePage";
import Types from "../admin/pages/Types/type";
import ClientPage from "../admin/pages/clients/ClientPage";
import ProformaList from "../admin/pages/proforma/ProformaList";
import UserProfile from "../components/profile/userProfile";
import ContratPage from "../admin/pages/contrat/contratPage";
import ContactPage from "../admin/pages/Contact/ContactPage";
import QuoteForm from "../admin/pages/Quote/quoteForm";


const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="home" />} />
            <Route
                path="home"
                element={
                <MainLayout>
                    <Home />
                </MainLayout>
                }
            />

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

      <Route
        path="createCommande"
        element={
          <MainLayout>
            <QuoteForm />
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

            <Route
                path="profile"
                element={
                    <MainLayout>
                        <UserProfile />
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
