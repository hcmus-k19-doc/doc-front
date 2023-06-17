import React from 'react';
import { Divider, Modal } from 'antd';

import { LinkDocumentModalProps } from './core/models';

const LinkDocumentModal: React.FC<LinkDocumentModalProps> = ({
  isModalOpen,
  isIncomingDocument,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal title={`Hihi`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000}>
      <Divider />
      <div>Hihe</div>
    </Modal>
  );
};

export default LinkDocumentModal;
