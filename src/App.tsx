import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthInit } from 'components/AuthComponent';
import { primaryColor } from 'config/constant';

import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}>
      <AuthInit>
        <Outlet />
      </AuthInit>
    </ConfigProvider>
  );
};

export default App;
