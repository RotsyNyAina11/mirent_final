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
import Login from "./components/Login";

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
