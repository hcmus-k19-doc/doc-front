import { PATH_MANAGER } from 'config/path';
import PhongBan from 'pages/PhongBan';

import { RouteConfig } from './CommonRoutes';

const ManagerRoutes = (): RouteConfig[] => [
  {
    path: PATH_MANAGER.MANAGER,
    component: PhongBan,
  },
];

export { ManagerRoutes };
