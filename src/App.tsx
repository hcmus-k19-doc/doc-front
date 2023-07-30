import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthInit } from 'components/AuthComponent';

import './App.css';

const App: React.FC = () => {
  return (
    <AuthInit>
      <Outlet />
    </AuthInit>
  );
};

export default App;
