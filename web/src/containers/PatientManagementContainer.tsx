import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

import PatientManagement from '@/components/PatientManagement';
import { ErrorBoundary, LoadingSpinner } from '@/components/ui';
import patientsTranslations from '@/locales/patients.json';
import { extensionManager } from '@/utils/extension';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 3 } }
});

const ns = extensionManager.getNsForTranslation('patients');
extensionManager.registerTranslation(ns, patientsTranslations);

const PatientManagementContainer: React.FC = () => (
  <ThemeProvider theme={extensionManager.getTheme()}>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullHeight label="Loading..." />}>
          <PatientManagement ns={ns} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  </ThemeProvider>
);

export default PatientManagementContainer;
