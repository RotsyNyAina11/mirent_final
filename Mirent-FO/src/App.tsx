import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { RootState } from "./redux/store";
import Login from "./Components/Login";
import Sidebar from "./Components/Sidebar";
import { Filters } from "./Components/Filter";
import { CustomerList } from "./Components/CustomerList";
import Home from "./pages/Accueil";
import CustomerPage from "./pages/CustomerPage";

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router>
      <Grid container>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/accueil" />}
          />
          <Route
            path="/accueil"
            element={
              <>
                <Filters />
                <Home />
              </>
            }
          />
          <Route
            path="/clients"
            element={
              <>
                <Sidebar />
                <CustomerPage />
              </>
            }
          />
          <Route path="/sidebar" element={<Sidebar />} />
        </Routes>
      </Grid>
    </Router>
  );
};

export default App;
