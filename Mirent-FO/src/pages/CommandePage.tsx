import React from "react";
import { Container } from "@mui/material";
import Commande from "../Components/Commandes/CommandePage";

const CommandePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Commande />
    </Container>
  );
};
export default CommandePage;
