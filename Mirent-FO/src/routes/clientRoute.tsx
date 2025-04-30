import { Navigate, Route, Routes } from "react-router-dom";
import ClientHome from "../clients/pages/home";
import VehiculeList from "../clients/pages/vehiculeList";

const ClientRoutes = () => {
    return(
        <Routes>
            <Route index element={<Navigate to="acceuil" />} />
            <Route path="acceuil" element={<ClientHome/>} />
            <Route path="list-vehicule" element={<VehiculeList />} />
        </Routes>
    );
};
export default ClientRoutes;