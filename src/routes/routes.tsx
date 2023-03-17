import { Route, Routes } from 'react-router-dom';

import { CommonRoutes as commonRoutes } from './CommonRoutes';

const CommonRoutes: React.FC = () => {
  const getAllCommonRoutes = () => {
    return [...commonRoutes()];
  };

  return (
    <Routes>
      {getAllCommonRoutes().map((route) => (
        <Route key={route.path} path={route.path} element={<>{route.component}</>} />
      ))}
    </Routes>
  );
};

export { CommonRoutes };
