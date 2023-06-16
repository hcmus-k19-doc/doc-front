import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from 'App';
import { useAuth } from 'components/AuthComponent';
import { BASE_NAME } from 'config/constant';
import NotFoundPage from 'pages/error/NotFoundPage';
import ServerErrorPage from 'pages/error/ServerErrorPage';
import LoginPage from 'pages/shared/LoginPage';
import MainPage from 'pages/shared/MainPage';
import ProcessingDetailsPageWrapper from 'pages/shared/ProcessingDetailsPage';
import AxiosNavigation from 'shared/hooks/AxiosNavigation';
import { GlobalHistory } from 'utils/RoutingUtils';

import DocSuspenseComponent from '../DocSuspenseComponent';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  const StatisticsPage = lazy(() => import('pages/shared/StatisticsPage'));
  const ProfilePage = lazy(() => import('pages/shared/ProfilePage'));

  return (
    <BrowserRouter basename={BASE_NAME}>
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
              <Route
                path='/statistics'
                element={
                  <DocSuspenseComponent>
                    <StatisticsPage />
                  </DocSuspenseComponent>
                }
              />
              <Route
                path='/profile'
                element={
                  <DocSuspenseComponent>
                    <ProfilePage />
                  </DocSuspenseComponent>
                }
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
