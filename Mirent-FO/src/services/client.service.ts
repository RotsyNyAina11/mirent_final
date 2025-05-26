import axios from "axios";
import { Customer } from "../types/clientDetail";

export const fetchClients = async (): Promise<Customer[]> => {
  const response = await axios.get("http://localhost:3000/clients");
  return response.data;
};
