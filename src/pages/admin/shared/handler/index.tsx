import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalStaticFunctions } from 'antd/es/modal/confirm';
import { t } from 'i18next';

export function useOnClickDelete(onOk: () => void, modal: Omit<ModalStaticFunctions, 'warn'>) {
  modal.confirm({
    title: t('common.modal.title'),
    icon: <ExclamationCircleOutlined />,
    content: t('common.modal.content'),
    okText: t('common.modal.ok_text'),
    cancelText: t('common.modal.cancel_text'),
    onOk,
  });
}
