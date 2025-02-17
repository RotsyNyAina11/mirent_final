import React from "react";
import { Box, TextField, Button } from "@mui/material";

const SearchFilters: React.FC = () => {
  return (
    <Box sx={{ display: "flex", gap: 2, p: 2 }}>
      <TextField label="City" variant="outlined" fullWidth />
      <TextField
        label="Pick-up Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        label="Return Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <Button variant="contained" color="primary">
        Search
      </Button>
    </Box>
  );
};

export default SearchFilters;
