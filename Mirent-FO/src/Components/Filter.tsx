import React from "react";
import {
  Paper,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setTypeFilter,
  setPriceRange,
  setTransmissionFilter,
  setSeatsRange,
  clearFilters,
} from "../redux/slices/filterSlice";
import { RootState } from "../redux/store";

export const Filters: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Vehicle Type</InputLabel>
        <Select
          value={filters.type || ""}
          label="Vehicle Type"
          onChange={(e) => dispatch(setTypeFilter(e.target.value || null))}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="car">Car</MenuItem>
          <MenuItem value="motorcycle">Motorcycle</MenuItem>
          <MenuItem value="van">Van</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>Price Range (€/day)</Typography>
        <Slider
          value={[filters.priceRange.min, filters.priceRange.max]}
          onChange={(_, newValue: number | number[]) =>
            dispatch(
              setPriceRange({
                min: (newValue as number[])[0],
                max: (newValue as number[])[1],
              })
            )
          }
          valueLabelDisplay="auto"
          min={0}
          max={1000}
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Transmission</InputLabel>
        <Select
          value={filters.transmission || ""}
          label="Transmission"
          onChange={(e) =>
            dispatch(setTransmissionFilter(e.target.value || null))
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="manual">Manual</MenuItem>
          <MenuItem value="automatic">Automatic</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>Number of Seats</Typography>
        <Slider
          value={[filters.seatsRange.min, filters.seatsRange.max]}
          onChange={(_, newValue: number | number[]) =>
            dispatch(
              setSeatsRange({
                min: (newValue as number[])[0],
                max: (newValue as number[])[1],
              })
            )
          }
          valueLabelDisplay="auto"
          min={0}
          max={20}
        />
      </Box>

      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={() => dispatch(clearFilters())}
      >
        Clear Filters
      </Button>
    </Paper>
  );
};
