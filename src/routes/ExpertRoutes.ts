import { PATH_EXPERT } from 'config/path';
import ChuyenVien from 'pages/ChuyenVien';

import { RouteConfig } from './CommonRoutes';

const ExpertRoutes = (): RouteConfig[] => [
  {
    path: PATH_EXPERT.EXPERT,
    component: ChuyenVien,
  },
];

export { ExpertRoutes };
