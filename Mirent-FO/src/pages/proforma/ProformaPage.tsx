import React from "react";
import { Container, Grid } from "@mui/material";
//import Proforma from "../Components/Proforma/ProformaList";
//import Proformatableau from "../../Components/Proforma/ProformaTable";
//import Facturation from "../../Components/Proforma/Facturation";
import ProformaForm from "../../Components/Proforma/ProformaForm";
//import ProformaItemForm from "../../Components/Proforma/proformaItem";
import ProformaPdf from "../../Components/Proforma/proformaPdf";
//import ProformaItem from "../../Components/Proforma/proformaItem";
import ProformaList from "../../Components/Proforma/ProformaList";
import ReservationForm from "../../Components/Reservation/ReservationForm";
import ReservationList from "../../Components/Reservation/ReservationList";
const ProformaPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProformaForm />
          <ProformaPdf />
          <ProformaList />
        </Grid>
      </Grid>
    </Container>
  );
};
export default ProformaPage;
