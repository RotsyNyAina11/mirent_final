import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import ClientRoutes from "./routes/clientRoute";
import AdminRoutes from "./routes/adminRoutes";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>

        {/* Client */}
        <Route path="/*" element={<ClientRoutes />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Redirection par défaut  */}
        <Route path="*" element={<Navigate to="/acceuil" />} />
      </Routes>
    </Router>
  );
};

export default App;