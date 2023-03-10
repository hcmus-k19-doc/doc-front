import { Route, Routes } from 'react-router-dom';
import LoginPage from 'pages/LoginPage';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route index element={<LoginPage />} />
    </Routes>
  );
};

export default AuthRoutes;