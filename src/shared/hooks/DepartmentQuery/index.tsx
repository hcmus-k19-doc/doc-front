import { useQuery } from '@tanstack/react-query';
import { DepartmentDto } from 'models/doc-main-models';
import adminService from 'services/AdminService';

export function useSelectionDepartmentRes() {
  return useQuery<DepartmentDto[]>({
    queryKey: ['QUERIES.DEPARTMENT'],
    queryFn: async () => {
      return adminService.getDepartments();
    },
  });
}
