import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from 'assets/i18n/i18n.config';
import axios from 'axios';
import AppRoutes from 'components/AppRoutes';
import { AuthProvider } from 'components/AuthComponent';
import { setupAxios } from 'utils/AuthUtils';

import './index.css';

setupAxios(axios);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <AppRoutes />
      </I18nextProvider>
    </AuthProvider>
  </React.StrictMode>
);
