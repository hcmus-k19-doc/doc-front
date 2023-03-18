import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from 'App';
import { useAuth } from 'components/AuthComponent';
import { PrivateRoutes, PublicRoutes } from 'routes';
const AppRoutes = () => {
  const { currentUser } = useAuth();
  console.log({ currentUser });

  return <BrowserRouter>{currentUser ? <PrivateRoutes /> : <PublicRoutes />}</BrowserRouter>;
};

export default AppRoutes;
