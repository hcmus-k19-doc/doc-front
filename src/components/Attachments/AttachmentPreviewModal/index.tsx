import { Modal } from 'antd';

import { AttachmentPreviewModalProps } from '../core/models';

const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = (
  props: AttachmentPreviewModalProps
) => {
  return (
    <Modal
      title='Basic Modal'
      open={props.isPreviewModalOpen}
      onCancel={props.handleClose}
      centered
      footer={[]}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

export default AttachmentPreviewModal;
