import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthInit } from 'components/AuthComponent';
import { PRIMARY_COLOR } from 'config/constant';

import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
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
