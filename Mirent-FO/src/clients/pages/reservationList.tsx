import React from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  ButtonGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Navbar from "../components/Navbar";

const fakeReservations = [
  {
    id: 1,
    image: "/src/assets/2.jpg",
    modele: "Toyota Yaris",
    dateDebut: "2025-05-10",
    dateFin: "2025-05-20",
    immatriculation: "QR-345-ST",
    prix: 320000,
    statut: "À venir",
  },
  {
    id: 2,
    image: "/src/assets/1.jpg",
    modele: "Renault Clio",
    dateDebut: "2025-05-10",
    dateFin: "2025-05-15",
    immatriculation: "AB-123-CD",
    prix: 350000,
    statut: "À venir",
  },
];

const itemsPerPage = 4;

const ReservationList: React.FC = () => {
  const [filter, setFilter] = React.useState("Toutes");
  const [sort, setSort] = React.useState("recent");
  const [searchText, setSearchText] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filteredReservations = fakeReservations.filter((res) => {
    const matchSearch = res.modele.toLowerCase().includes(searchText.toLowerCase());
    const matchFilter = filter === "Toutes" || res.statut === filter;
    return matchSearch && matchFilter;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sort === "recent") {
      return new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime();
    } else if (sort === "ancien") {
      return new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime();
    } else {
      return a.prix - b.prix;
    }
  });

  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const paginatedReservations = sortedReservations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4, pt: 15 }}>
        <Typography variant="h5" mb={3} fontWeight="bold" align="center">
          Mes réservations
        </Typography>

        {/* Barre de filtre supérieure */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
            p: 2,
            borderRadius: 3,
            boxShadow: 2,
            mb: 3,
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Rechercher une réservation..."
            sx={{
              flexGrow: 1,
              maxWidth: 300,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <ButtonGroup variant="contained" color="primary" sx={{ borderRadius: 2 }}>
            {["Toutes", "En cours", "À venir", "Terminées"].map((label) => (
              <Button
                key={label}
                variant={filter === label ? "contained" : "outlined"}
                onClick={() => setFilter(label)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="sort-label">Trier par</InputLabel>
            <Select
              labelId="sort-label"
              value={sort}
              label="Trier par"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="recent">Plus récent</MenuItem>
              <MenuItem value="ancien">Plus ancien</MenuItem>
              <MenuItem value="prix">Prix</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Liste des réservations */}
        <Grid container spacing={3}>
          {paginatedReservations.map((res) => (
            <Grid item xs={12} key={res.id}>
              <Card sx={{ display: "flex", p: 2, borderRadius: 3 }}>
                <Box
                  component="img"
                  src={res.image}
                  alt={res.modele}
                  sx={{ width: 200, height: 150, borderRadius: 2, objectFit: "cover", mr: 2 }}
                />
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 1, p: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>{res.modele}</Typography>
                  <Typography variant="body2">Du {res.dateDebut} au {res.dateFin}</Typography>
                  <Typography variant="body2">Immatriculation: {res.immatriculation}</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">{res.prix}Ariary</Typography>
                </Box>
                <Stack justifyContent="space-between" alignItems="flex-end">
                  <Chip label={res.statut} color="success" variant="outlined" />
                  <Stack direction="row" spacing={1} mt={2}>
                    <Button size="small" variant="contained" color="primary" startIcon={<VisibilityIcon />}>Voir détails</Button>
                    <Button size="small" variant="outlined" color="warning" startIcon={<EditIcon />}>Modifier</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />}>Annuler</Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ReservationList;