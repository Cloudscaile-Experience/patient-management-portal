import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import PatientManagement from '@/components/PatientManagement';
import App, { ns } from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App>
      <PatientManagement ns={ns} />
    </App>
  </StrictMode>
);
