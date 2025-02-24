import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";

const TopBar: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{ background: "#fff", color: "#000", boxShadow: 1 }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mirent Car
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField label="Search for a car" variant="outlined" size="small" />
          <Button variant="contained" color="primary">
            Rerchercher
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
