import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import userService from 'services/UserService';

export function useDirectorTransferRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.GIAM_DOC_TRANSFER'],
    queryFn: () => {
      return userService.getUsersByRole(DocSystemRoleEnum.GIAM_DOC);
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
