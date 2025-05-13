import { Navigate, Route, Routes } from "react-router-dom";
import ClientHome from "../clients/pages/home";
import VehiculeList from "../clients/pages/vehiculeList";
import ReservationList from "../clients/pages/reservationList";



const ClientRoutes = () => {
    return(
            <Routes>
                <Route index element={<Navigate to="acceuil" />} />
                <Route path="acceuil" element={<ClientHome/>} />
                <Route path="/list-vehicule" element={<VehiculeList />} />
                <Route path="/reservations" element={<ReservationList/>}/>
            </Routes>
    );
};
export default ClientRoutes;