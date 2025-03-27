import React from 'react';
import { useSelector } from 'react-redux';
import { selectProforma } from '../../redux/features/proforma/proformaSelector';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        marginBottom: 5,
    },
});

const ProformaPdf: React.FC = () => {
    const { proformaData } = useSelector(selectProforma);

    if (!proformaData) {
        return <p>Aucune donnée de proforma disponible.</p>;
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Facture Proforma</Text>
                    <Text>Numéro: {proformaData.proformaNumber}</Text>
                    <Text>Client ID: {proformaData.client.id}</Text>
                    <Text>Date: {proformaData.date}</Text>
                    <Text>Référence du Contrat: {proformaData.contractReference}</Text>
                    <Text>Notes: {proformaData.notes}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Articles</Text>
                    {proformaData.items.map((item: any, index: number) => (
                        <View key={index} style={styles.item}>
                            <Text>Véhicule ID: {item.vehicle.id}</Text>
                            <Text>Région ID: {item.region.id}</Text>
                            <Text>Prix ID: {item.prix.id}</Text>
                            <Text>Date de départ: {item.dateDepart.toISOString().split('T')[0]}</Text>
                            <Text>Date de retour: {item.dateRetour.toISOString().split('T')[0]}</Text>
                            <Text>Nombre de jours: {item.nombreJours}</Text>
                            <Text>Sous-total: {item.subTotal}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Total</Text>
                    <Text>Montant total: {proformaData.totalAmount}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ProformaPdf;