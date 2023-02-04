import './App.css';
import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import MainPage from 'pages/MainPage';
import { primaryColor } from 'config/constant';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}>
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
