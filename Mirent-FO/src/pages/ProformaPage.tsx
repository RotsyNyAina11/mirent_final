import React from "react";
import { Container } from "@mui/material";
import Proforma from "../Components/Proforma/ProformaList";
import Proformatableau from "../Components/Proforma/ProformaTable";
import Facturation from "../Components/Proforma/Facturation";

const ProformaPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Proforma />
      <Proformatableau />
      <Facturation />
    </Container>
  );
};
export default ProformaPage;
