import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/ui';
import { useCreatePatient, useDeletePatient, useUpdatePatient } from '@/hooks/usePatientMutations';
import { usePatients } from '@/hooks/usePatients';
import type { CreatePatientPayload, Patient, UpdatePatientPayload } from '@/types/patient';

import PatientDeleteDialog from './PatientDeleteDialog';
import PatientForm from './PatientForm';
import PatientTable from './PatientTable';

interface PatientManagementProps {
  ns: string;
}

const PatientManagement: React.FC<PatientManagementProps> = ({ ns }) => {
  const { t } = useTranslation(ns);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

  const { data, isLoading } = usePatients({ page, pageSize, search: search || undefined });

  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  const handleOpenAdd = () => {
    setEditPatient(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (patient: Patient) => {
    setEditPatient(patient);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditPatient(null);
  };

  const handleFormSubmit = async (payload: CreatePatientPayload | UpdatePatientPayload) => {
    if (editPatient) {
      await updateMutation.mutateAsync({
        id: editPatient.id,
        payload: payload as UpdatePatientPayload
      });
    } else {
      await createMutation.mutateAsync(payload as CreatePatientPayload);
    }
    handleFormClose();
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeletePatient(null);
  };

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Stack sx={{ height: '100%' }}>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            {t('actions.addPatient')}
          </Button>
        }
      />

      <Stack spacing={2} sx={{ p: 3, flex: 1 }}>
        <TextField
          size="small"
          placeholder={t('search.placeholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ maxWidth: 360 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />

        <PatientTable
          ns={ns}
          patients={data?.data ?? []}
          total={data?.total ?? 0}
          page={page}
          pageSize={pageSize}
          loading={isLoading}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onEdit={handleOpenEdit}
          onDelete={setDeletePatient}
        />
      </Stack>

      <PatientForm
        ns={ns}
        open={formOpen}
        patient={editPatient}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        loading={isMutating}
      />

      <PatientDeleteDialog
        ns={ns}
        patient={deletePatient}
        onClose={() => setDeletePatient(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
      />
    </Stack>
  );
};

export default PatientManagement;
