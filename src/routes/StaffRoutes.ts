import { PATH_STAFF } from 'config/path';
import VanThu from 'pages/VanThu';

import { RouteConfig } from './CommonRoutes';

const StaffRoutes = (): RouteConfig[] => [
  {
    path: PATH_STAFF.STAFF,
    component: VanThu,
  },
];

export { StaffRoutes };
