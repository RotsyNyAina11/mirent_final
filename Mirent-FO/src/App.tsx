import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import ClientRoutes from "./routes/ClientRoute";
import AdminRoutes from "./routes/AdminRoutes";




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

      </Routes>
    </Router>
  );
};

export default App;