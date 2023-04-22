import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from 'App';
import { useAuth } from 'components/AuthComponent';
import AuthRoutes from 'components/AuthRoute/AuthRoutes';
import PrivateRoutes from 'components/PrivateRoutes';
import ServerErrorPage from 'pages/error/ServerErrorPage';
import AxiosNavigation from 'shared/hooks/AxiosNavigation';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <AxiosNavigation />
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
        <Route path='/internal-server-error' element={<ServerErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
