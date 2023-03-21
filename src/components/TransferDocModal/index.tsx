import React from 'react';
import { Col, Divider, Form, Modal, Row, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';

interface Props {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

const TransferDocModal: React.FC<Props> = ({ isModalOpen, handleOk, handleCancel }) => {
  return (
    <>
      <Modal
        title='Luan chuyen van ban toi'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}>
        <Divider />
        <Row className='mt-5'>
          <Col span='5'>Keke</Col>
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
    </>
  );
};

export default TransferDocModal;
