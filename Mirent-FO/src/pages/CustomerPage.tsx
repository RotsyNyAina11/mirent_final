import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Sidebar from "../Components/Sidebar";
import { CustomerList } from "../Components/CustomerList";

const CustomerPage: React.FC = () => {
  const customers = useSelector((state: RootState) => state.customer.customers);

  return (
    <Container>
      <Sidebar />
      <Box sx={{ p: 3, ml: 8 }}>
        <CustomerList />
      </Box>
    </Container>
  );
};

export default CustomerPage;
