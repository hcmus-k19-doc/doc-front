import React, { useEffect, useState } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { Modal, Spin } from 'antd';
import attachmentService from 'services/AttachmentService';

import { AttachmentPreviewModalProps } from '../core/models';

import './index.css';

function AttachmentPreviewModal({
  attachment,
  isPreviewModalOpen,
  handleClose,
}: AttachmentPreviewModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<any>([]);

  useEffect(() => {
    if (attachment) {
      const downloadFile = async () => {
        setLoading(true);
        try {
          const data = await attachmentService.getFileContentFromMinioByKey(
            attachment.alfrescoFileId
          );
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
}

export default AttachmentPreviewModal;
