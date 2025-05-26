import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchClients } from "../../../redux/features/clients/customersSlice";
//import { fetchClients } from "../services/client.service";
import { AppDispatch } from "../../../redux/store";

const ClientList = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadClients = async () => {
      const data = await fetchClients();
      dispatch(data);
    };
    loadClients();
  }, [dispatch]);

  return <div>Clients chargés !</div>;
};

export default ClientList;
