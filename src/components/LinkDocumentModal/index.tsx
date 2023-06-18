import React from 'react';
import { Divider, Modal } from 'antd';
import IncomingDocListSearch from 'components/IncomingDocListSearch';
import { t } from 'i18next';

import { LinkDocumentModalProps } from './core/models';

const LinkDocumentModal: React.FC<LinkDocumentModalProps> = ({
  isModalOpen,
  isIncomingDocument,
  selectedDocumentsToLink,
  handleSelectedDocumentsToLinkChanged,
  selectedDocuments,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      title={t('incomingDocDetailPage.linked_document.title')}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}>
      <Divider />
      {!isIncomingDocument && (
        <IncomingDocListSearch
          selectedDocumentsToLink={selectedDocumentsToLink}
          handleSelectedDocumentsToLinkChanged={handleSelectedDocumentsToLinkChanged}
          linkedDocuments={selectedDocuments}
        />
      )}
      <div className='mb-10'></div>
    </Modal>
  );
};

export default LinkDocumentModal;
