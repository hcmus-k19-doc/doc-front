import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import userService from 'services/UserService';

export function useExpertTransferRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.CHUYEN_VIEN_TRANSFER'],
    queryFn: () => {
      return userService.getUsersByRoleWithDepartment(DocSystemRoleEnum.CHUYEN_VIEN);
    },
    cacheTime: 0,
  });

  const experts: SelectProps['options'] = data?.map((expert) => ({
    value: expert.id,
    label: expert.fullName + ' - ' + expert.departmentName,
  }));

  return {
    experts,
  };
}
