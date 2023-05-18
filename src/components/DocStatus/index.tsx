import React from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { t } from 'i18next';
import { OutgoingDocumentStatusEnum } from 'models/doc-main-models';

import { DocStatusProps } from './core/models';

const DocStatus = ({ status }: DocStatusProps) => {
  const getStatusClass = () => {
    switch (status) {
      case OutgoingDocumentStatusEnum.RELEASED:
        return 'text-green-600';
      case OutgoingDocumentStatusEnum.IN_PROGRESS:
        return 'text-blue-600';
      case OutgoingDocumentStatusEnum.UNPROCESSED:
        return 'text-yellow-600';
    }
  };

  const renderStatusIcon = () => {
    switch (status) {
      case OutgoingDocumentStatusEnum.RELEASED:
        return <CheckCircleOutlined />;
      case OutgoingDocumentStatusEnum.IN_PROGRESS:
        return <ClockCircleOutlined />;
      case OutgoingDocumentStatusEnum.UNPROCESSED:
        return <ExclamationCircleOutlined />;
    }
  };

  return (
    <div className={`text-lg font-semibold mb-5 ${getStatusClass()}`}>
      {renderStatusIcon()}
      <span className='ml-2'>{t(`outgoing_doc_detail_page.status.${status}`)}</span>
    </div>
  );
};

export default DocStatus;
