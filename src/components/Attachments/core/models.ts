import { AttachmentDto } from 'models/doc-main-models';

export interface AttachmentsComponentProps {
  attachments: AttachmentDto[];
  isReadOnly: boolean;
  isEditing: boolean;
}

export interface AttachmentPreviewModalProps {
  attachment: AttachmentDto;
  isPreviewModalOpen: boolean;
  handleClose: () => void;
}
