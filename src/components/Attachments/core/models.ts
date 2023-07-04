import { AttachmentDto } from 'models/doc-main-models';

export interface AttachmentsComponentProps {
  attachments: AttachmentDto[];
}

export interface AttachmentPreviewModalProps {
  attachment: AttachmentDto;
  isPreviewModalOpen: boolean;
  handleClose: () => void;
}
