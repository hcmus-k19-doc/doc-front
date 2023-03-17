// import { ReactNode } from 'react';
// import { Location, Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from 'components/AuthComponent';

// interface Props {
//   children: ReactNode;
// }

// const PrivateRoutes = ({ children }: Props): ReactNode => {
//   const { currentUser } = useAuth();
//   const location: Location = useLocation();
//   if (!currentUser) {
//     return <Navigate to='/auth/login' state={{ path: location.pathname }} />;
//   }
//   return children;
// };

// export default PrivateRoutes;

import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from 'pages/MainPage';

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path='/auth/*' element={<Navigate to='/index' />} />
      <Route path='/index' element={<MainPage />} />
    </Routes>
  );
};

export default PrivateRoutes;
