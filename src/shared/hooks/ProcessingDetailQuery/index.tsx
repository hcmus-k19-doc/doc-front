import { useQuery } from '@tanstack/react-query';
import { ProcessingDocumentTypeEnum } from 'models/doc-main-models';
import { ProcessingDetailsRowDataType } from 'pages/shared/ProcessingDetailsPage/core/models';
import incomingDocumentService from 'services/IncomingDocumentService';

const PROCESSING_DETAILS_QUERY_KEY = 'QUERY.PROCESSING_DETAILS';

export function useProcessingDetailsRes(
  processingDocumentType: ProcessingDocumentTypeEnum,
  incomingDocumentId: number,
  onlyAssignee?: boolean
) {
  return useQuery({
    queryKey: [PROCESSING_DETAILS_QUERY_KEY, incomingDocumentId],
    queryFn: async () => {
      const { data } = await incomingDocumentService.getProcessingDetails(
        processingDocumentType,
        incomingDocumentId,
        onlyAssignee
      );
      const rowsData: ProcessingDetailsRowDataType[] = data.map((item) => {
        return {
          key: `${processingDocumentType}-${item.incomingNumber}-${item.step}-${item.processingUser.id}-${item.processingUser.role}`,
          incomingNumber: item.incomingNumber,
          step: item.step,
          fullName: item.processingUser.fullName,
          department: item.processingUser.department,
          role: item.processingUser.role,
          docSystemRole: item.processingUser.docSystemRole,
          roleTitle: item.processingUser.roleTitle,
        };
      });

      return rowsData;
    },
  });
}
