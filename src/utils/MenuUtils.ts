import { MenuProps } from 'antd';
import directorMenu from 'components/Menu/DirectorMenu';
import expertMenu from 'components/Menu/ExpertMenu';
import managerMenu from 'components/Menu/ManagerMenu';
import staffMenu from 'components/Menu/StaffMenu';
import { DocSystemRoleEnum } from 'models/doc-main-models';

export const getMenus = (role: DocSystemRoleEnum): MenuProps => {
  switch (role) {
    case DocSystemRoleEnum.DIRECTOR:
      return directorMenu;
    case DocSystemRoleEnum.MANAGER:
      return managerMenu;
    case DocSystemRoleEnum.EXPERT:
      return expertMenu;
    case DocSystemRoleEnum.STAFF:
      return staffMenu;
    default:
      return expertMenu;
  }
};
