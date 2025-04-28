import { Route, Routes } from "react-router-dom";
import Home from "../admin/pages/acceuil/HomePage";
import MainLayout from "../layouts/MainLayouts";
import Vehicule from "../admin/pages/vehicules/vehiculePage";
import Types from "../admin/pages/type/type";
import ClientPage from "../admin/pages/clients/ClientPage";
import ProformaPage from "../admin/pages/proforma/proformaPage";
import LocationsPage from "../admin/pages/lieux/locationPage";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route
                path="/home"
                element={
                <MainLayout>
                    <Home />
                </MainLayout>
                }
            />

            <Route
                path="/vehicules"
                element={
                <MainLayout>
                    <Vehicule />
                </MainLayout>
                }
            />

            <Route
                path="/types"
                element={
                    <MainLayout>
                    <Types/>
                    </MainLayout>
                }
            />

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

            <Route
                path="/lieux"
                element={
                    <MainLayout>
                    <LocationsPage />
                    </MainLayout>
                }
            />

        </Routes>
    );
}

export default AdminRoutes;