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
//import { VehicleCard } from "./Components/VehicleCard";
import { Filters } from "./Components/Filter";
//import { Dashboard } from "./Components/PieChart";
import { PieChart } from "lucide-react";
import Home from "./pages/Accueil";

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
              </>
            }
          />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/dashboard" element={<PieChart />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Grid>
    </Router>
  );
};

export default App;
