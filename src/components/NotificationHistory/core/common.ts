import { ParentFolderEnum } from 'models/doc-file-models';
import { TransferHistoryDto } from 'models/doc-main-models';

import { TableRowDataType } from './models';

const getDocTypeFromFolderId = (folderId: string): string => {
  const split = folderId?.split('/');
  const firstElement = split?.[0];
  if (firstElement === ParentFolderEnum.ICD) {
    return 'incoming_doc';
  }
  return 'outgoing_doc';
};

const getParentFolderEnumFromFolderId = (folderId: string): ParentFolderEnum => {
  const split = folderId?.split('/');
  const firstElement = split?.[0];
  if (firstElement === ParentFolderEnum.ICD) {
    return ParentFolderEnum.ICD;
  }
  return ParentFolderEnum.OGD;
};

export const createDataSourceFromTransferHistory = (
  transferHistoryDto: TransferHistoryDto
): TableRowDataType[] => {
  const dataSource: TableRowDataType[] = [];
  transferHistoryDto?.attachments?.map((attachment, index) => {
    const { docId, attachments } = attachment;
    const item: TableRowDataType = {
      key: index,
      id: docId,
      type: getDocTypeFromFolderId(attachments?.[0]?.alfrescoFolderId),
      fullText: attachments?.[0]?.alfrescoFolderId,
      attachments: attachments,
      parentFolderEnum: getParentFolderEnumFromFolderId(attachments?.[0]?.alfrescoFolderId),
    };
    return dataSource.push(item);
  });
  return dataSource;
};
