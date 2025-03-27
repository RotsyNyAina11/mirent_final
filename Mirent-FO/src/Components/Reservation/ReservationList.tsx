import React, { useEffect } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
//import { Reservation } from "../../models/Reservation";
import { useAppDispatch, useAppSelector } from "../../hooks"; // Import from the correct file
import {
  fetchReservations,
  selectAllReservations,
  selectReservationsLoading,
  selectReservationsError,
} from "../../redux/features/reservation/reservationSlice";

// Créez des hooks typés pour useSelector et useDispatch dans un fichier séparé (hooks/reduxHooks.ts)
// Pour éviter de taper RootState et AppDispatch à chaque fois
//import type { RootState, AppDispatch } from "../../redux/store";
//import { useDispatch, useSelector } from "react-redux";

// Move these hooks to a separate file (e.g., hooks/reduxHooks.ts) and import them here.

const ReservationList = () => {
  const reservations = useAppSelector(selectAllReservations);
  const loading = useAppSelector(selectReservationsLoading);
  const error = useAppSelector(selectReservationsError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "dateDepart", headerName: "Date Départ", width: 130 },
    { field: "dateRetour", headerName: "Date Retour", width: 130 },
    { field: "nombreJours", headerName: "Nombre de Jours", width: 130 },
    { field: "subTotal", headerName: "Sous-Total", width: 150 },
    // ... (autres colonnes)
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params: GridValueGetterParams) => (
        <div>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Chargement des réservations...</div>;
  }

  if (error) {
    return <div>Erreur lors de la récupération des réservations : {error}</div>;
  }

  return (
    <div>
      <h2>Liste des Réservations</h2>
      <Button variant="contained" color="primary">
        Créer une Nouvelle Réservation
      </Button>
      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid
          rows={reservations}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default ReservationList;
