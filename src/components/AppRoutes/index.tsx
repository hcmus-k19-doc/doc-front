import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from 'App';
import { useAuth } from 'components/AuthComponent';
import LoginPage from 'pages/shared/LoginPage';
import MainPage from 'pages/shared/MainPage';
import { GlobalHistory } from 'utils/RoutingUtils';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <GlobalHistory />
      <Routes>
        <Route element={<App />}>
          {!currentUser ? (
            <>
              <Route path='/login' element={<Navigate to='/' />} />
              <Route path='/*' element={<MainPage />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/*' element={<Navigate to='/login' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
