import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import userService from 'services/UserService';

export function useManagerTransferRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.MANAGER_TRANSFER'],
    queryFn: () => {
      return userService.getUsersByRoleWithDepartment(DocSystemRoleEnum.TRUONG_PHONG);
    },
    cacheTime: 0,
  });

  const managers: SelectProps['options'] = data?.map((manager) => ({
    value: manager.id,
    label: manager.fullName + ' - ' + manager.departmentName,
  }));

  return {
    managers,
  };
}
