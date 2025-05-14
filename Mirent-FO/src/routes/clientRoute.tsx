import { Navigate, Route, Routes } from "react-router-dom";
import ClientHome from "../clients/pages/home";
import VehiclesPage from "../clients/pages/vehiculePage";
import ReservationList from "../clients/pages/reservationList";




const ClientRoutes = () => {
    return(
            <Routes>
                <Route index element={<Navigate to="accueil" />} />
                <Route path="accueil" element={<ClientHome/>} />
                <Route path="/list-vehicule" element={<VehiclesPage />} />
                <Route path="/reservations" element={<ReservationList/>}/>
            </Routes>
    );
};
export default ClientRoutes;