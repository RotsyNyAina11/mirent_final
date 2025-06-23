import React from "react";
import { Container, Grid } from "@mui/material";
import Commande from "../../../admin/Components/Commandes/Commande";

const CommandePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Commande />
    </Container>
  );
};
export default CommandePage;
