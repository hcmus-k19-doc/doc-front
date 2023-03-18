import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from 'components/AuthComponent';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import ErrorComponent from 'pages/Error';
import MainPage from 'pages/MainPage';

import { CommonRoutes as commonRoutes } from '../../routes/CommonRoutes';
import { DirectorRoutes as directorRoutes } from '../../routes/DirectorRoutes';
import { ExpertRoutes as expertRoutes } from '../../routes/ExpertRoutes';
import { ManagerRoutes as managerRoutes } from '../../routes/ManagerRoutes';
import { StaffRoutes as staffRoutes } from '../../routes/StaffRoutes';

const PrivateRoutes = () => {
  const { currentUser } = useAuth();
  console.log('user 2', { currentUser });
  return (
    <Routes>
      <Route path='/auth/*' element={<Navigate to='/index' />} />
      <Route path='/index/*' element={<MainPage />} />
      <Route path='*' element={<ErrorComponent />} />
    </Routes>
  );
  // const getAllAuthRoutes = () => {
  //   const authRoutes = [];
  //   // authRoutes.push(...commonRoutes());
  //   if (currentUser?.roles.includes(DocSystemRoleEnum.DIRECTOR)) {
  //     authRoutes.push(...directorRoutes());
  //   }
  //   if (currentUser?.roles.includes(DocSystemRoleEnum.EXPERT)) {
  //     authRoutes.push(...expertRoutes());
  //   }
  //   if (currentUser?.roles.includes(DocSystemRoleEnum.MANAGER)) {
  //     authRoutes.push(...managerRoutes());
  //   }
  //   if (currentUser?.roles.includes(DocSystemRoleEnum.STAFF)) {
  //     authRoutes.push(...staffRoutes());
  //   }

  //   return authRoutes;
  // };
  // console.log(getAllAuthRoutes());

  // return (
  //   <Routes>
  //     <Route path='/auth/*' element={<Navigate to='/index' />} />
  //     <Route path='/index/*' element={<MainPage />} />
  //     {getAllAuthRoutes().map((route) => (
  //       <Route
  //         key={route.path}
  //         path={route.path}
  //         element={<route.component />}
  //         // errorElement={<route.errorElement />}
  //       />
  //     ))}
  //   </Routes>
  // );
};

export default PrivateRoutes;
