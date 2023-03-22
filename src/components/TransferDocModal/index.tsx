import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, Menu, Modal, Row, Table } from 'antd';
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

const TransferDocModal: React.FC<Props> = ({ isModalOpen, handleOk, handleCancel }) => {
  const { t } = useTranslation();
  const transferLabels = [t(i18n_director), t(i18n_chief_of_office), t(i18_secretary)];
  const [transferLabel, setTransferLabel] = useState(transferLabels[0]);

  const items: MenuItem[] = [
    getItem(t(i18n_director), 1),
    getItem(t(i18n_chief_of_office), 2),
    getItem(t(i18_secretary), 3),
  ];

  function handleMenuOnSelect({ selectedKeys }: MenuSelectProps) {
    setTransferLabel(transferLabels[parseInt(selectedKeys[0]) - 1]);
  }

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
            style={{ height: '100%' }}
            onSelect={handleMenuOnSelect}
            defaultSelectedKeys={['1']}
            mode='inline'
            theme='light'
            items={items}
          />
        </Col>
        <Col span='1'></Col>
        <Col span='18'>
          <Form>
            <Row>
              <Col span='12'>{t(i18n_sender)}</Col>
            </Row>
            <Row>
              <Col span='12'>{t(i18n_implementation_date)}</Col>
            </Row>
            <Row>
              <Col span='12'>{t(i18n_document)}</Col>
            </Row>
            <Row>
              <Form.Item name='summary' label={t(i18n_summary)}>
                <TextArea rows={4} />
              </Form.Item>
            </Row>
            <Row>
              <Col span='12'>{t(i18n_receiver)}</Col>
            </Row>

            <Table rowSelection={{ type: 'checkbox' }} scroll={{ x: 1500 }} pagination={false} />
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default TransferDocModal;
