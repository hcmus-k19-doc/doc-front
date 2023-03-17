import { PATH_COMMON } from 'config/path';
import CVDocInList from 'pages/ChuyenVien/CVDocInList';
import LoginPage from 'pages/LoginPage';

const CommonRoutes = () => [
  {
    path: PATH_COMMON.LOGIN,
    component: LoginPage,
  },
  {
    path: PATH_COMMON.CHANGE_PASSWORD,
    component: () => 'Change password page',
  },
  {
    path: PATH_COMMON.FORGOT_PASSWORD,
    component: () => 'Forgot password page',
  },
  {
    path: PATH_COMMON.LOGOUT,
    component: () => 'Logout',
  },
  {
    path: PATH_COMMON.NOTFOUND,
    component: () => '404',
  },
  {
    path: PATH_COMMON.UNAUTHORIZED,
    component: () => 'Unauthorized',
  },
  {
    path: PATH_COMMON.HOME,
    component: CVDocInList,
  },
];

export { CommonRoutes };
