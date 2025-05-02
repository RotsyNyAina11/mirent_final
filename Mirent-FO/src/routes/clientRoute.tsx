import { Navigate, Route, Routes } from "react-router-dom";
import ClientHome from "../clients/pages/home";
import VehiculeList from "../clients/pages/VehiculeList";
import ClientCatalogue from "../clients/pages/clientCatalogue";
import MesReservations from "../clients/pages/MesReservations";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="acceuil" />} />
      <Route path="acceuil" element={<ClientHome />} />
      <Route path="list-vehicule" element={<VehiculeList />} />
      <Route path="catalogue" element={<ClientCatalogue />} />
      <Route path="mes-reservations" element={<MesReservations />} />
    </Routes>
  );
};
export default ClientRoutes;
