import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/ui';
import type { Patient } from '@/types/patient';

import PatientRow from './PatientRow';

const COLUMNS = [
  'table.name',
  'table.dateOfBirth',
  'table.email',
  'table.phone',
  'table.gender',
  'table.address',
  'table.actions'
] as const;

interface PatientTableProps {
  ns: string;
  patients: Patient[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  ns,
  patients,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation(ns);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              {COLUMNS.map((col) => (
                <TableCell key={col} align={col === 'table.actions' ? 'right' : 'left'}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    {t(col)}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: pageSize }, (_, i) => `skeleton-${i}`).map((key) => (
                <TableRow key={key}>
                  {COLUMNS.map((col) => (
                    <TableCell key={col}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} sx={{ border: 0 }}>
                  <EmptyState title={t('table.noResults')} description={t('table.noResultsHint')} />
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              patients.map((patient) => (
                <PatientRow
                  key={patient.id}
                  ns={ns}
                  patient={patient}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage={t('pagination.rowsPerPage')}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => {
          onPageSizeChange(Number(e.target.value));
          onPageChange(1);
        }}
      />
    </Paper>
  );
};

export default PatientTable;
