import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'assets/i18n/i18n.config';
import axios from 'axios';
import AppRoutes from 'components/AppRoutes';
import { AuthProvider } from 'components/AuthComponent';
import dayjs from 'dayjs';
import { setupAxios } from 'utils/AuthUtils';

import 'dayjs/locale/vi';

import './index.css';

setupAxios(axios);
dayjs.locale('vi');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </I18nextProvider>
    </AuthProvider>
  </React.StrictMode>
);
