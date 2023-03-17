import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from 'pages/shared/MainPage';

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path='/auth/*' element={<Navigate to='/index' />} />
      <Route path='/index/*' element={<MainPage />} />
    </Routes>
  );
};

export default PrivateRoutes;
