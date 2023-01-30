import "./App.css";
import React from "react";
import { ConfigProvider } from "antd";
import MainPage from "pages/MainPage";
import { primaryColor } from "config/constant";

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <MainPage />
    </ConfigProvider>
  );
};

export default App;
