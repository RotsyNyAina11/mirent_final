import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    layout: {
      headerHeight: number;
      headerHeightXs: number;
      sidebar: {
        expandedWidth: number;
        collapsedWidth: number;
        expandedWidthXs: number;
        collapsedWidthXs: number;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    layout?: {
      headerHeight?: number;
      headerHeightXs?: number;
      sidebar?: {
        expandedWidth?: number;
        collapsedWidth?: number;
        expandedWidthXs?: number;
        collapsedWidthXs?: number;
      };
    };
  }
}

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
    fontFamily: '"Poppins", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  layout: {
    headerHeight: 56,
    headerHeightXs: 48,
    sidebar: {
      expandedWidth: 240,
      collapsedWidth: 70,
      expandedWidthXs: 220,
      collapsedWidthXs: 56,
    },
  },
});

export default theme;
