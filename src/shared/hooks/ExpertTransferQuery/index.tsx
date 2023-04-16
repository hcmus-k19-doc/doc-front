import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import userService from 'services/UserService';

export function useExpertTransferRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.EXPERT_TRANSFER'],
    queryFn: () => {
      return userService.getExperts();
    },
    cacheTime: 0,
  });

  const experts: SelectProps['options'] = data?.map((expert) => ({
    value: expert.id,
    label: expert.fullName,
  }));

  return {
    experts,
  };
}
