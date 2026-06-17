import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { Patient } from '@/types/patient';

interface PatientRowProps {
  ns: string;
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const PatientRow: React.FC<PatientRowProps> = ({ ns, patient, onEdit, onDelete }) => {
  const { t } = useTranslation(ns);

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {patient.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{patient.dateOfBirth}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{patient.email}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{patient.phone ?? '—'}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {patient.gender ? t(`gender.${patient.gender}`) : '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {patient.address ?? '—'}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title={t('actions.edit')}>
            <IconButton size="small" onClick={() => onEdit(patient)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.delete')}>
            <IconButton size="small" color="error" onClick={() => onDelete(patient)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default PatientRow;
