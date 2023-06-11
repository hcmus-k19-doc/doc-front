import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import { AuthInit } from 'components/AuthComponent';
import { PRIMARY_COLOR } from 'config/constant';

import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={vi_VN}
      theme={{
        token: {
          colorPrimary: PRIMARY_COLOR,
        },
      }}>
      <AuthInit>
        <Outlet />
      </AuthInit>
    </ConfigProvider>
  );
};

export default App;
