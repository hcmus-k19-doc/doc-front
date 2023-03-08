import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

import AppRoutes from './components/AppRoutes';
import { AuthProvider } from './components/AuthComponent';
import { setupAxios } from './utils/AuthUtils';

import './index.css';

setupAxios(axios);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
