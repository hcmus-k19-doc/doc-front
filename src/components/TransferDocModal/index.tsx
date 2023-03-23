import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Menu, Modal, Row, Table, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import {
  getItem,
  i18_secretary,
  i18n_chief_of_office,
  i18n_director,
  i18n_document,
  i18n_implementation_date,
  i18n_receiver,
  i18n_sender,
  i18n_summary,
  i18n_transfer_modal_title,
  MenuItem,
  MenuSelectProps,
  Props,
} from './core/models';

const { Text } = Typography;

const TransferDocModal: React.FC<Props> = ({ isModalOpen, handleOk, handleCancel }) => {
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
        <Col span='18'>
          <Row>
            <Col span='6'>
              <Text strong>{t(i18n_sender)}</Text>
            </Col>
            <Col span='6'>{t(i18n_sender)}</Col>
          </Row>
          <Row className='my-6'>
            <Col span='6'>
              <Text strong>{t(i18n_implementation_date)}</Text>
            </Col>
            <Col span='6'>{t(i18n_implementation_date)}</Col>
          </Row>
          <Row className='mt-3 mb-3'>
            <Col span='6'>
              <Text strong>{t(i18n_document)}</Text>
            </Col>
            <Col span='6'>{t(i18n_document)}</Col>
          </Row>
          <Row className='mt-4 mb-4' align='middle'>
            <Col span='6'>
              <Text strong>{t(i18n_summary)}</Text>
            </Col>
            <Col span='16'>
              <TextArea rows={4} />
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col span='12'>
              <Text strong>{t(i18n_receiver)}</Text>
            </Col>
          </Row>

          <Table rowSelection={{ type: 'checkbox' }} scroll={{ x: 1500 }} pagination={false} />
        </Col>
      </Row>
    </Modal>
  );
};

export default TransferDocModal;
