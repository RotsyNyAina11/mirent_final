// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import PageAccueil from "./Components/PageAccueil";
import Header from "./Components/Header";

import Login from "./Components/Login";

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router>
      <Routes>
        <Header />
        <Route path="/" element={<Login />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/home" element={<PageAccueil />} /> {/* Page d'accueil */}
      </Routes>
    </Router>
  );
};

export default App;
