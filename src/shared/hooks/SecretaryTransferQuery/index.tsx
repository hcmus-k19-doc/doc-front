import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import userService from 'services/UserService';

export function useSecretaryTransferRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.VAN_THU_TRANSFER'],
    queryFn: () => {
      return userService.getUsersByRoleWithDepartment(DocSystemRoleEnum.VAN_THU);
    },
    cacheTime: 0,
  });

  const secretaries: SelectProps['options'] = data?.map((secretary) => ({
    value: secretary.id,
    label: secretary.fullName + ' - ' + secretary.departmentName,
  }));

  return {
    secretaries,
  };
}
