import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import i18n from 'assets/i18n/i18n.config';
import axios from 'axios';
import AppRoutes from 'components/AppRoutes';
import { AuthProvider } from 'components/AuthComponent';
import dayjs from 'dayjs';
import moment from 'moment';
import { RecoilRoot } from 'recoil';
import { setupAxios } from 'utils/AuthUtils';

import 'dayjs/locale/vi';
import 'moment/locale/vi';

import DocSuspenseComponent from './components/DocSuspenseComponent';
import { PRIMARY_COLOR } from './config/constant';

import './index.css';

setupAxios(axios);
dayjs.locale('vi');
moment.locale('vi');

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
    <DocSuspenseComponent>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <RecoilRoot>
              <ConfigProvider
                locale={vi_VN}
                theme={{
                  token: {
                    colorPrimary: PRIMARY_COLOR,
                  },
                }}>
                <AppRoutes />
              </ConfigProvider>
            </RecoilRoot>
          </QueryClientProvider>
        </I18nextProvider>
      </AuthProvider>
    </DocSuspenseComponent>
  </React.StrictMode>
);
