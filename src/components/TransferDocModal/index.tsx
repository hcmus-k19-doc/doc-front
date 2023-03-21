import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, Modal, Radio, Row, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const I18N_TRANSFER_MODAL = 'transfer_modal';
const I18N_TRANSFER_MODAL_TITLE = `${I18N_TRANSFER_MODAL}.title`;
const I18N_TRANSFER_MODAL_RADIO = `${I18N_TRANSFER_MODAL}.radio`;
const I18N_DIRECTOR = 'director';
const I18N_CHIEF_OF_OFFICE = 'chief_of_office';

interface Props {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

const TransferDocModal: React.FC<Props> = ({ isModalOpen, handleOk, handleCancel }) => {
  const { t } = useTranslation();
  const transfers = [t(I18N_DIRECTOR), t(I18N_CHIEF_OF_OFFICE)];
  const [transfer, setTransfer] = useState(transfers[0]);

  return (
    <Modal
      title={`${t(I18N_TRANSFER_MODAL_TITLE)} ${transfer}`.toUpperCase()}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}>
      <Divider />
      <Row className='mt-5'>
        <Col span='5'>
          <Radio.Group
            defaultValue={1}
            buttonStyle='solid'
            onChange={(e) => {
              setTransfer(transfers[e.target.value - 1]);
            }}>
            <Radio.Button
              value='1'
              className='flex flex-grow'
              style={{ borderRadius: '0px', border: 'none' }}>
              {t(`${I18N_TRANSFER_MODAL_RADIO}.transfer_to_director`)}
            </Radio.Button>
            <Radio.Button
              value='2'
              className='flex flex-grow'
              style={{ borderRadius: '0px', border: 'none' }}>
              {t(`${I18N_TRANSFER_MODAL_RADIO}.transfer_to_chief_of_office`)}
            </Radio.Button>
            <Radio.Button
              value='3'
              className='flex flex-grow'
              style={{ borderRadius: '0px', border: 'none' }}>
              {t(`${I18N_TRANSFER_MODAL_RADIO}.transfer`)}
            </Radio.Button>
          </Radio.Group>
        </Col>
        <Col span='1'>
          <Divider type='vertical' />
        </Col>
        <Col span='18'>
          <Row>
            <Col span='12'>Nguoi chuyen</Col>
          </Row>
          <Row>
            <Col span='12'>Ngay thuc hien</Col>
          </Row>
          <Row>
            <Col span='12'>Van ban</Col>
          </Row>
          <Row>
            <Col span='12'>
              <Form.Item name='summary' label='Trinh ky - de nghi'>
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span='12'>Nguoi nhan</Col>
          </Row>

          <Table rowSelection={{ type: 'checkbox' }} scroll={{ x: 1500 }} pagination={false} />
        </Col>
      </Row>
    </Modal>
  );
};

export default TransferDocModal;
