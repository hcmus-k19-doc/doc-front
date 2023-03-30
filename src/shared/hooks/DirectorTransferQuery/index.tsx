import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import userService from 'services/UserService';

export function useDirectorTransferRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.DIRECTOR_TRANSFER'],
    queryFn: () => {
      return userService.getDirectors();
    },
    cacheTime: 0,
  });

  const directors: SelectProps['options'] = data?.map((director) => ({
    value: director.id,
    label: director.fullName,
  }));

  return {
    directors,
  };
}
