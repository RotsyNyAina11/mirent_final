import React from "react";
import { Container } from "@mui/material";
//import Proforma from "../Components/Proforma/ProformaList";
import Proformatableau from "../Components/Proforma/ProformaTable";
import Facturation from "../Components/Proforma/Facturation";
import ProformaForm from "../Components/Proforma/ProformaForm";
import ProformaItemForm from "../Components/Proforma/proformaItem";
import ProformaPdf from "../Components/Proforma/proformaPdf";
//import ProformaItem from "../Components/Proforma/proformaItem";
import ProformaList from "../Components/Proforma/ProformaList";

const ProformaPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <ProformaForm />
      <ProformaPdf />

      <ProformaList />
    </Container>
  );
};
export default ProformaPage;
