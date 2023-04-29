import { MenuProps } from 'antd';
import directorMenu from 'components/DocMenu/DirectorMenu';
import expertMenu from 'components/DocMenu/ExpertMenu';
import managerMenu from 'components/DocMenu/ManagerMenu';
import staffMenu from 'components/DocMenu/StaffMenu';
import { DocSystemRoleEnum } from 'models/doc-main-models';

export const getMenus = (role: DocSystemRoleEnum): MenuProps => {
  switch (role) {
    case DocSystemRoleEnum.GIAM_DOC:
      return directorMenu;
    case DocSystemRoleEnum.TRUONG_PHONG:
      return managerMenu;
    case DocSystemRoleEnum.CHUYEN_VIEN:
      return expertMenu;
    case DocSystemRoleEnum.VAN_THU:
      return staffMenu;
  }
};
