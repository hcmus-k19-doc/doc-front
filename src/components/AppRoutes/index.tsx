import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from 'App';
import { useAuth } from 'components/AuthComponent';
import DocSuspenseComponent from 'components/DocSuspenseComponent';
import { BASE_NAME } from 'config/constant';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import NotFoundPage from 'pages/error/NotFoundPage';
import ServerErrorPage from 'pages/error/ServerErrorPage';
import LoginPage from 'pages/shared/LoginPage';
import ChangePasswordPage from 'pages/shared/LoginPage/ChangePassword';
import ForgotPasswordPage from 'pages/shared/LoginPage/ForgotPassword';
import MainPage from 'pages/shared/MainPage';
import ProcessingDetailsPageWrapper from 'pages/shared/ProcessingDetailsPage';
import StatisticsPage from 'pages/shared/StatisticsPage';
import AxiosNavigation from 'shared/hooks/AxiosNavigation';
import { GlobalHistory } from 'utils/RoutingUtils';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  const ProfilePage = lazy(() => import('pages/shared/ProfilePage'));

  return (
    <BrowserRouter basename={BASE_NAME}>
      <GlobalHistory />
      <AxiosNavigation />
      <Routes>
        <Route element={<App />}>
          {currentUser ? (
            <>
              {currentUser?.role === DocSystemRoleEnum.DOC_ADMIN ? (
                <Route path='/login' element={<Navigate to='/main' />} />
              ) : (
                <Route path='/login' element={<Navigate to='/' />} />
              )}
              <Route
                path='/processing-details/:incomingDocumentId'
                element={<ProcessingDetailsPageWrapper />}
              />
              {currentUser?.role !== DocSystemRoleEnum.DOC_ADMIN ? (
                <Route path='/' element={<StatisticsPage />} />
              ) : (
                <Route path='/' element={<Navigate to='/main' />} />
              )}
              <Route
                path='/profile'
                element={
                  <DocSuspenseComponent>
                    <ProfilePage />
                  </DocSuspenseComponent>
                }
              />
              <Route path='/main/*' element={<MainPage />} />
              <Route path='*' element={<Navigate to='/not-found' />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/forgot-password' element={<ForgotPasswordPage />} />
              <Route path='/change-password' element={<ChangePasswordPage />} />
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
