import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from 'components/AuthComponent';
import { DocSystemRoleEnum } from 'models/doc-main-models';

import { CommonRoutes as commonRoutes } from './CommonRoutes';
import { DirectorRoutes as directorRoutes } from './DirectorRoutes';
import { ExpertRoutes as expertRoutes } from './ExpertRoutes';
import { ManagerRoutes as managerRoutes } from './ManagerRoutes';
import { StaffRoutes as staffRoutes } from './StaffRoutes';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/auth/*' element={<AuthRoutes />} />
      <Route path='*' element={<Navigate to='/auth' />} />
    </Routes>
  );
};

const AuthRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  const getAllAuthRoutes = () => {
    const authRoutes = [...commonRoutes()];

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

  return (
    <Routes>
      {getAllAuthRoutes().map((route) => (
        <Route key={route.path} path={route.path} element={<>{route.component}</>} />
      ))}
    </Routes>
  );
};

export { PublicRoutes, AuthRoutes };
