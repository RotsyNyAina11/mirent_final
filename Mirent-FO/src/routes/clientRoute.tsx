import { Navigate, Route, Routes } from "react-router-dom";
import ClientHome from "../clients/pages/home";

import VehiclesPage from "../clients/pages/vehiculePage";
import ReservationList from "../clients/pages/reservationList";
import VehicleDetails from "../clients/Components/VehiclesDetails";
import ReservationPage from "../clients/pages/reservationPage";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="acceuil" />} />
      <Route path="acceuil" element={<ClientHome />} />
      <Route path="/list-vehicule" element={<VehiclesPage />} />
      <Route path="/voitures/:id/details" element={<VehicleDetails />} />
      <Route path="/voitures/:id/reserver" element={<ReservationPage />} />
      <Route path="/reservations" element={<ReservationList />} />
    </Routes>
  );
};
export default ClientRoutes;
