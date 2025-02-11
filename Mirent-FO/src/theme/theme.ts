import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Couleur principale
    },
    secondary: {
      main: "#dc004e", // Couleur secondaire
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;
