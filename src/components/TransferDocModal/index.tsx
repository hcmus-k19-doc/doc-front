import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Menu, Modal, Row } from 'antd';

import DirectorScreenComponent from './components/DirectorScreenComponent';
import ManagerScreenComponent from './components/ManagerScreenComponent';
import SecretaryScreenComponent from './components/SecretaryScreenComponent';
import {
  getItem,
  i18_secretary,
  i18n_chief_of_office,
  i18n_director,
  i18n_transfer_modal_title,
  MenuItem,
  MenuSelectProps,
  TransferModalProps,
} from './core/models';

const TransferDocModal: React.FC<TransferModalProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  selectedDocs,
}) => {
  const { t } = useTranslation();
  const transferLabels = [t(i18n_director), t(i18n_chief_of_office), t(i18_secretary)];
  const [transferLabel, setTransferLabel] = useState(transferLabels[0]);

  const items: MenuItem[] = [
    getItem(t(i18n_director), 1),
    getItem(t(i18n_chief_of_office), 2),
    getItem(t(i18_secretary), 3),
  ];

  const handleMenuOnSelect = ({ selectedKeys }: MenuSelectProps) => {
    setTransferLabel(transferLabels[parseInt(selectedKeys[0]) - 1]);
  };

  const handleSwitchScreen = () => {
    switch (transferLabel) {
      case t(i18n_director):
        return <DirectorScreenComponent form={form} selectedDocs={selectedDocs} />;
      case t(i18n_chief_of_office):
        return <ManagerScreenComponent form={form} selectedDocs={selectedDocs} />;
      case t(i18_secretary):
        return <SecretaryScreenComponent form={form} selectedDocs={selectedDocs} />;
      default:
        return <DirectorScreenComponent form={form} selectedDocs={selectedDocs} />;
    }
  };

  return (
    <Modal
      title={`${t(i18n_transfer_modal_title)} ${transferLabel}`.toUpperCase()}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}>
      <Divider />
      <Row className='mt-5'>
        <Col span='5'>
          <Menu
            className='h-full'
            onSelect={handleMenuOnSelect}
            defaultSelectedKeys={['1']}
            mode='inline'
            theme='light'
            items={items}
          />
        </Col>
        <Col span='1'></Col>
        <Col span='18'>{handleSwitchScreen()}</Col>
      </Row>
    </Modal>
  );
};

export default TransferDocModal;
