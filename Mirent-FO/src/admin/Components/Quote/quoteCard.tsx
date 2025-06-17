import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

interface DevisCardProps {
  devis: any;
  onDelete?: (id: string) => void;
  onPreview?: (devis: any) => void;
  onPrint?: (devis: any) => void;
}

const DevisCard: React.FC<DevisCardProps> = ({ devis, onDelete, onPreview, onPrint }) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR');

  return (
    <Card
      sx={{
        borderRadius: 2,
        p: 2,
        boxShadow: 3,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Devis #{devis.id}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" color="text.secondary">
          Client ID : {devis.clientId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Du {formatDate(devis.startDate)} au {formatDate(devis.endDate)}
        </Typography>
        <Typography variant="body2" color="success.main" fontWeight="bold">
          Montant total : {devis.totalAmount.toLocaleString()} Ar
        </Typography>
      </CardContent>
      <CardActions
        sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}
      >
        <Button size="small" color="info" onClick={() => onPreview?.(devis)}>
          Détails
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete?.(devis.id)}
          title="Supprimer"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Button
          size="small"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={() => onPrint?.(devis)}
        >
          Imprimer
        </Button>
      </CardActions>
    </Card>
  );
};

export default DevisCard;