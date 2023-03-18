import { Navigate, Route, Routes } from 'react-router-dom';
import App from 'App';
import { useAuth } from 'components/AuthComponent';
import AuthRoutes from 'components/AuthRoute/AuthRoutes';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import ErrorComponent from 'pages/Error';

import { CommonRoutes as commonRoutes } from './CommonRoutes';
import { DirectorRoutes as directorRoutes } from './DirectorRoutes';
import { ExpertRoutes as expertRoutes } from './ExpertRoutes';
import { ManagerRoutes as managerRoutes } from './ManagerRoutes';
import { StaffRoutes as staffRoutes } from './StaffRoutes';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path='/auth/*' element={<AuthRoutes />} />
        <Route path='*' element={<Navigate to='/auth' />} />
      </Route>
    </Routes>
  );
};

const PrivateRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  console.log('user 1', { currentUser });

  const getAllAuthRoutes = () => {
    const authRoutes = [];
    authRoutes.push(...commonRoutes());
    if (currentUser?.roles.includes(DocSystemRoleEnum.DIRECTOR)) {
      authRoutes.push(...directorRoutes());
    }
    if (currentUser?.roles.includes(DocSystemRoleEnum.EXPERT)) {
      authRoutes.push(...expertRoutes());
    }
    if (currentUser?.roles.includes(DocSystemRoleEnum.MANAGER)) {
      authRoutes.push(...managerRoutes());
    }
    if (currentUser?.roles.includes(DocSystemRoleEnum.STAFF)) {
      authRoutes.push(...staffRoutes());
    }

    return authRoutes;
  };
  console.log(getAllAuthRoutes());

  return (
    <Routes>
      <Route element={<App />}>
        {getAllAuthRoutes().map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
            // errorElement={<route.errorElement />}
          />
        ))}
      </Route>
      <Route path='/auth/*' element={<Navigate to='/' />} />
      {/* <Route path='*' element={<Navigate to='/' />} /> */}
    </Routes>
  );
};

export { PublicRoutes, PrivateRoutes };
