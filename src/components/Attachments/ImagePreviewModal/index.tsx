import { useEffect, useState } from 'react';
import { Image, Spin } from 'antd';
import imageNoContent from 'assets/images/no-image.png';
import attachmentService from 'services/AttachmentService';

import { ImagePreviewModalProps } from '../core/models';

import './index.css';

function ImagePreviewModal({
  attachment,
  isPreviewModalOpen,
  handleClose,
  setIsPreviewModalOpen,
}: ImagePreviewModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<any>([]);

  useEffect(() => {
    setDocs([]);
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

  return isPreviewModalOpen ? (
    <Spin spinning={loading}>
      <Image
        width={200}
        src={docs?.[0]?.uri || imageNoContent}
        preview={{
          visible: isPreviewModalOpen,
          onVisibleChange: (visible, prevVisible) => setIsPreviewModalOpen(visible),
        }}
        style={{ display: 'none' }}
      />
    </Spin>
  ) : null;
}

export default ImagePreviewModal;
