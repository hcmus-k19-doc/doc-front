import { PATH_MANAGER } from 'config/path';
import PhongBan from 'pages/PhongBan';

const ManagerRoutes = () => [
  {
    path: PATH_MANAGER.MANAGER,
    component: PhongBan,
  },
];

export { ManagerRoutes };
