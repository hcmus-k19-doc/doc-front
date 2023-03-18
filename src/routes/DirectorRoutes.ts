import { PATH_DIRECTOR } from 'config/path';
import LanhDao from 'pages/LanhDao';

import { RouteConfig } from './CommonRoutes';

const DirectorRoutes = (): RouteConfig[] => [
  {
    path: PATH_DIRECTOR.DIRECTOR,
    component: LanhDao,
  },
];

export { DirectorRoutes };
