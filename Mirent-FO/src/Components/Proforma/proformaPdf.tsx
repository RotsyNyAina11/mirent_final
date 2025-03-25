import React from "react";
import { useSelector } from "react-redux";
import { selectProforma } from "../../redux/features/proforma/proformaSelector";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Définition des interfaces pour les types de données
interface ProformaItem {
  vehicle: { id: number };
  region: { id: number };
  prix: { id: number };
  dateDepart: Date | null | undefined;
  dateRetour: Date | null | undefined;
  nombreJours: number;
  subTotal: number;
}

interface ProformaData {
  proformaNumber: string;
  client: { id: number };
  date: string;
  contractReference?: string; // Added optional property
  notes: string;
  items: ProformaItem[];
  totalAmount: number;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    marginBottom: 5,
  },
});

const ProformaPdf: React.FC = () => {
  const { proformaData } = useSelector(selectProforma);

  // Gestion des cas où proformaData est null ou undefined
  if (!proformaData) {
    return <p>Aucune donnée de proforma disponible.</p>;
  }

  // Type assertion pour proformaData avec gestion des valeurs par défaut
  const isProformaData = (data: any): data is ProformaData => {
    return (
      data &&
      typeof data.proformaNumber === "string" &&
      data.client &&
      typeof data.client.id === "number" &&
      typeof data.date === "string" &&
      Array.isArray(data.items) &&
      typeof data.totalAmount === "number"
    );
  };

  if (!isProformaData(proformaData)) {
    return <p>Les données de proforma sont invalides.</p>;
  }

  const typedProformaData = proformaData;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Facture Proforma</Text>
          <Text>Numéro: {typedProformaData.proformaNumber}</Text>
          <Text>Client ID: {typedProformaData.client.id}</Text>
          <Text>Date: {typedProformaData.date}</Text>
          <Text>
            Référence du Contrat: {typedProformaData.contractReference}
          </Text>
          <Text>Notes: {typedProformaData.notes}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Articles</Text>
          {typedProformaData.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text>Véhicule ID: {item.vehicle.id}</Text>
              <Text>Région ID: {item.region.id}</Text>
              <Text>Prix ID: {item.prix.id}</Text>
              <Text>
                Date de départ:{" "}
                {item.dateDepart
                  ? item.dateDepart.toISOString().split("T")[0]
                  : "N/A"}
              </Text>
              <Text>
                Date de retour:{" "}
                {item.dateRetour
                  ? item.dateRetour.toISOString().split("T")[0]
                  : "N/A"}
              </Text>
              <Text>Nombre de jours: {item.nombreJours}</Text>
              <Text>Sous-total: {item.subTotal}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Total</Text>
          <Text>Montant total: {typedProformaData.totalAmount}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProformaPdf;
