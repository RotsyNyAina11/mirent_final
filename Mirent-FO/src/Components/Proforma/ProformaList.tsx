import React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Button, IconButton, Box, Typography, Chip } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Proforma, ProformaStatus } from "../../models/Proforma";
import dayjs from "dayjs";

const ProformaList = () => {
  // ... (gardez vos hooks useAppSelector et useAppDispatch existants)
  const [loading, setLoading] = React.useState(false); // Add loading state

  const proforma: Proforma[] = []; // Initialize with an empty array or fetched data

  const columns: GridColDef<Proforma>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "proformaNumber",
      headerName: "N° Proforma",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      valueFormatter: (params: GridValueFormatterParams<string>) =>
        dayjs(params.value).format("DD/MM/YYYY"),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalAmount",
      headerName: "Montant",
      width: 130,
      valueFormatter: (params: GridValueFormatterParams<number>) =>
        `${params.value.toFixed(2)} €`,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "clientId",
      headerName: "ID Client",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Statut",
      width: 120,
      renderCell: (params: GridRenderCellParams<Proforma, ProformaStatus>) => (
        <Chip
          label={params.value}
          color={
            params.value === ProformaStatus.APPROVED
              ? "success"
              : params.value === ProformaStatus.REJECTED
              ? "error"
              : "warning"
          }
          variant="outlined"
          size="small"
        />
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdAt",
      headerName: "Créé le",
      width: 150,
      valueFormatter: (params: GridValueFormatterParams<string>) =>
        dayjs(params.value).format("DD/MM/YYYY HH:mm"),
      headerAlign: "center",
    },
    {
      field: "updatedAt",
      headerName: "Modifié le",
      width: 150,
      valueFormatter: (params: GridValueFormatterParams<string>) =>
        dayjs(params.value).format("DD/MM/YYYY HH:mm"),
      headerAlign: "center",
    },
    {
      field: "contractReference",
      headerName: "Contrat de Référence",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Proforma>) => (
        <Box>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => console.log("Edit:", params.row.id)}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
      headerAlign: "center",
      align: "center",
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Chargement des proformas...</Typography>
      </Box>
    );
  }

  const error = ""; // Replace with actual error state or message

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
        <Typography variant="h6">Erreur : {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Liste des Proformas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => console.log("Create new")}
        >
          Nouvelle Proforma
        </Button>
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={proforma}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              py: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
};

function handleDelete(id: number): void {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cette proforma ?")) {
    console.log(`Deleting proforma with ID: ${id}`);
    // Add logic to delete the proforma, e.g., API call
    // Example:
    // setLoading(true);
    // api.deleteProforma(id)
    //   .then(() => {
    //     console.log("Proforma deleted successfully");
    //     // Optionally refresh the list or update state
    //   })
    //   .catch((error) => {
    //     console.error("Error deleting proforma:", error);
    //   })
    //   .finally(() => setLoading(false));
  }
}

export default ProformaList;

// Removed duplicate function implementation
