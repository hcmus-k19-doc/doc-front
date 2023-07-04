import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { Modal, Spin } from 'antd';
import { AttachmentDto } from 'models/doc-main-models';
import attachmentService from 'services/AttachmentService';

import { AttachmentPreviewModalProps } from '../core/models';

import './index.css';
const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({
  attachment,
  isPreviewModalOpen,
  handleClose,
}: {
  attachment: AttachmentDto;
  isPreviewModalOpen: boolean;
  handleClose: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<any>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (attachment) {
      const downloadFile = async () => {
        setLoading(true);
        try {
          const data = await attachmentService.getFileContentFromS3Key(attachment.alfrescoFileId);
          setDocs([
            {
              uri: URL.createObjectURL(data.data),
              fileName: attachment.fileName,
            },
          ]);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      downloadFile();
    }
  }, [attachment]);

  return (
    <Modal
      title={''}
      open={isPreviewModalOpen}
      onCancel={handleClose}
      centered
      footer={[]}
      width={1000}
      bodyStyle={{ height: '800px' }}>
      <Spin spinning={loading}>
        <DocViewer
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          className={'modal-preview-body'}
        />
      </Spin>
    </Modal>
  );
};

export default AttachmentPreviewModal;
