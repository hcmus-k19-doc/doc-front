import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import App from '../../App';
import { useAuth } from '../AuthComponent';
import AuthRoutes from '../AuthRoute/AuthRoutes';
import PrivateRoutes from '../PrivateRoutes';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {currentUser ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/index' />} />
            </>
          ) : (
            <>
              <Route path='/auth/*' element={<AuthRoutes />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
