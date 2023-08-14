import { AttachmentDto } from 'models/doc-main-models';

export interface AttachmentsComponentProps {
  attachmentList: AttachmentDto[];
  setAttachmentList: (attachments: AttachmentDto[]) => void;
  isReadOnly: boolean;
  isEditing: boolean;
}

export interface AttachmentPreviewModalProps {
  attachment: AttachmentDto;
  isPreviewModalOpen: boolean;
  handleClose: () => void;
}

export interface ImagePreviewModalProps {
  attachment: AttachmentDto;
  isPreviewModalOpen: boolean;
  setIsPreviewModalOpen: (isOpen: boolean) => void;
  handleClose: () => void;
}
