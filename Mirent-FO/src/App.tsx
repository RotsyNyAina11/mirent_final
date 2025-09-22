import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/login/Login";
import ClientRoutes from "./routes/clientRoute";
import AdminRoutes from "./routes/adminRoutes";
import Register from "./components/register/Register";
import { verifyToken } from "./redux/features/auth/authSlice";
import { useAppDispatch } from "./hooks";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  if (loading) {
    return <div>Chargement...</div>; 
  }
  return (
    <Router>
      <Routes>
        {/* Redirection initiale vers la page de connexion */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client */}
        <Route path="/*" element={<ClientRoutes />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;
