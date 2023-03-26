import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { getDirectors } from 'services/UserService';

export function useDirectorTransferRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.DIRECTOR_TRANSFER'],
    queryFn: () => {
      return getDirectors();
    },
    cacheTime: 0,
  });

  const directors: SelectProps['options'] = data?.data.map((director) => ({
    value: director.id,
    label: `${director.firstName} ${director.lastName}`,
  }));

  return {
    directors,
  };
}
