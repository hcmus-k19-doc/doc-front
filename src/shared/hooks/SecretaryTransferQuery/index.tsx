import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import userService from 'services/UserService';

export function useSecretaryTransferRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.SECRETARY_TRANSFER'],
    queryFn: () => {
      return userService.getSecretaries();
    },
    cacheTime: 0,
  });

  const secretaries: SelectProps['options'] = data?.map((secretary) => ({
    value: secretary.id,
    label: secretary.fullName,
  }));

  return {
    secretaries,
  };
}
