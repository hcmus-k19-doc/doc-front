import { useQuery } from '@tanstack/react-query';
import { ProcessingDetailsRowDataType } from 'pages/shared/ProcessingDetailsPage/core/models';
import incomingDocumentService from 'services/IncomingDocumentService';

export function useProcessingDetailsRes(incomingDocumentId: number, onlyAssignee?: boolean) {
  return useQuery({
    queryKey: ['QUERY.PROCESSING_DETAILS', incomingDocumentId],
    queryFn: async () => {
      const { data } = await incomingDocumentService.getProcessingDetails(
        incomingDocumentId,
        onlyAssignee
      );
      const rowsData: ProcessingDetailsRowDataType[] = data.map((item) => {
        return {
          key: `${item.incomingNumber}-${item.step}-${item.processingUser.id}-${item.processingUser.role}`,
          incomingNumber: item.incomingNumber,
          step: item.step,
          fullName: item.processingUser.fullName,
          department: item.processingUser.department,
          role: item.processingUser.role,
        };
      });

      return rowsData;
    },
  });
}
