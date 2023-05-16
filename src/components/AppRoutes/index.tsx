import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from 'App';
import { useAuth } from 'components/AuthComponent';
import NotFoundPage from 'pages/Error/NotFoundPage';
import ServerErrorPage from 'pages/Error/ServerErrorPage';
import LoginPage from 'pages/shared/LoginPage';
import MainPage from 'pages/shared/MainPage';
import ProcessingDetailsPageWrapper from 'pages/shared/ProcessingDetailsPage';
import AxiosNavigation from 'shared/hooks/AxiosNavigation';
import { GlobalHistory } from 'utils/RoutingUtils';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <GlobalHistory />
      <AxiosNavigation />
      <Routes>
        <Route element={<App />}>
          {currentUser ? (
            <>
              <Route path='/login' element={<Navigate to='/' />} />
              <Route
                path='/processing-details/:incomingDocumentId'
                element={<ProcessingDetailsPageWrapper />}
              />
              <Route path='/*' element={<MainPage />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/*' element={<Navigate to='/login' />} />
            </>
          )}
        </Route>
        <Route path='/error' element={<ServerErrorPage />} />
        <Route path='/not-found' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
