import { MenuProps } from 'antd';
import directorMenu from 'components/DocMenu/DirectorMenu';
import expertMenu from 'components/DocMenu/ExpertMenu';
import managerMenu from 'components/DocMenu/ManagerMenu';
import staffMenu from 'components/DocMenu/StaffMenu';
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
