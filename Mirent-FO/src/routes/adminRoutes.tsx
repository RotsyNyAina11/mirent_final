import { Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../layouts/MainLayouts";
import LocationsPage from "../admin/pages/lieux/locationPage";
import Home from "../admin/pages/accueil/HomePage";
import Vehicule from "../admin/pages/vehicules/vehiculePage";
import Types from "../admin/pages/types/type";
import ClientPage from "../admin/pages/clients/ClientPage";
import ClientDetailPage from "../admin/pages/ClientDetailPage/clientdetailPage";
import ProtectedRoute from "./ProtectedRoute";
import ReservationManager from "../admin/Components/reservation/ReservationList";
import BonDeCommandeManager from "../admin/Components/commande/BonDeCommandeManager";
import PaiementPage from "../admin/Components/paiement/paiement";
import Login from "../Component/login/Login";
import FacturePage from "../admin/Components/facture/factureManagement";
import Contact from "../admin/Components/Contact/Contact";




const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />

      {/* Home - Admin uniquement */}
      <Route
        path="home"
        element={
          <ProtectedRoute roles={["admin"]}>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Véhicules - Admin uniquement */}
      <Route
        path="vehicules"
        element={
          <ProtectedRoute roles={["admin"]}>
            <MainLayout>
              <Vehicule />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Types - Admin uniquement */}
      <Route
        path="types"
        element={
          <ProtectedRoute roles={["admin"]}>
            <MainLayout>
              <Types />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Clients - Admin et Manager */}
      <Route
        path="clients"
        element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <MainLayout>
              <ClientPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Client Detail - Admin et Manager */}
      <Route
        path="client_detail"
        element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <MainLayout>
              <ClientDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Lieux - Admin et Manager */}
      <Route
        path="lieux"
        element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <MainLayout>
              <LocationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Réservations - Admin et Manager */}
      <Route
        path="reservations"
        element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <MainLayout>
              <ReservationManager />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Bons de commande - Admin et Manager */}
      <Route
        path="commandes"
        element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <MainLayout>
              <BonDeCommandeManager />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="paiements"
        element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <MainLayout>
              <PaiementPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="factures"
        element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <MainLayout>
              <FacturePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="contact"
        element={
          <ProtectedRoute roles={["admin", "manager"]}>
            <MainLayout>
              <Contact />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Déconnexion */}
      <Route path="logout" element={<Login />} />
    </Routes>
  );
};

export default AdminRoutes;