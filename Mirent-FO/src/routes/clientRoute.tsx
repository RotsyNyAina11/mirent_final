import { Navigate, Route, Routes } from "react-router-dom";
import ClientHome from "../clients/pages/home";
import VehiclesPage from "../clients/pages/vehiculePage";
import ReservationList from "../clients/pages/reservationList";
import VehicleDetails from "../clients/components/VehiclesDetails";
import ReservationPage from "../clients/pages/reservationPage";
import ReservationDetails from "../clients/pages/reservationDetailPage";
import ReservationEdit from "../clients/pages/reservationEditPage";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="acceuil" />} />
      <Route path="acceuil" element={<ClientHome />} />
      <Route path="/list-vehicule" element={<VehiclesPage />} />
      <Route
        path="/voitures/:id/details"
        element={<VehicleDetails vehicle={{}} onClose={() => {}} />}
      />
      <Route path="/voitures/:id/reserver" element={<ReservationPage />} />
      <Route path="/reservations-list" element={<ReservationList />} />
      <Route
        path="/reservations/:id/details"
        element={
          <ReservationDetails
            open={true}
            onClose={() => {}}
            reservationId={null}
          />
        }
      />
      <Route
        path="/reservations/:id/edit"
        element={
          <ReservationEdit
            open={true}
            onClose={() => {}}
            reservationId={null}
          />
        }
      />
    </Routes>
  );
};
export default ClientRoutes;
