import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Modal, Row, Spin, Table, Typography } from 'antd';
import { TransferHistoryDetailModalProps } from 'components/NotificationHistory/core/models';
import { format } from 'date-fns';
import { DAY_MONTH_YEAR_FORMAT_2 } from 'utils/DateTimeUtils';

import './index.css';
const { Text } = Typography;
const TransferHistoryDetailModal: React.FC<TransferHistoryDetailModalProps> = (
  props: TransferHistoryDetailModalProps
) => {
  const { t } = useTranslation();
  const { transferHistory } = props;

  console.log('transfer history', transferHistory);
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    {
      title: t('transfer_history.modal.table.columns.id'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('transfer_history.modal.table.columns.type'),
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: t('transfer_history.modal.table.columns.fullText'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('transfer_history.modal.table.columns.attachmentDetail'),
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <Modal
      className='transfer-history-detail-modal'
      title={t('transfer_history.modal.modal_title')}
      style={{ top: 20 }}
      open={props.isModalOpen}
      onCancel={props.handleClose}
      width={600}
      footer={[
        <Button key='ok' type='primary' onClick={props.handleClose}>
          OK
        </Button>,
      ]}>
      {!transferHistory ? (
        <Spin size='large' />
      ) : (
        <Form form={props.form}>
          <Row>
            <Col span={12}>
              <Row className='mb-3'>
                <Col span='12'>
                  <Text strong>{`${t('transfer_history.modal.sender')}:`}</Text>
                </Col>
                <Col span='12'>{transferHistory?.senderName}</Col>
              </Row>

              <Row className='mb-3'>
                <Col span='12'>
                  <Text strong>{`${t('transfer_history.modal.receiver')}:`}</Text>
                </Col>
                <Col span='12'>{transferHistory?.receiverName}</Col>
              </Row>

              <Row className='mb-3'>
                <Col span='12'>
                  <Typography.Text strong>{`${t(
                    'transfer_history.modal.document'
                  )}:`}</Typography.Text>
                </Col>
                <Col span='12'>{transferHistory?.documentIds.join(', ')}</Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row className='mb-3'>
                <Col span='12'>
                  <Typography.Text strong>
                    {`${t('transfer_history.modal.transfer_date')}:`}
                  </Typography.Text>
                </Col>
                <Col span='12'>
                  {format(new Date(transferHistory?.createdDate), DAY_MONTH_YEAR_FORMAT_2)}
                </Col>
              </Row>

              <Row className='mb-3'>
                <Col span='12'>
                  <Typography.Text strong>
                    {`${t('transfer_history.modal.processing_duration')}:`}
                  </Typography.Text>
                </Col>
                <Col span='12'>
                  {transferHistory?.isInfiniteProcessingTime === true
                    ? t('transfer_history.modal.infinite_processing_time')
                    : format(
                        new Date(transferHistory?.processingDuration),
                        DAY_MONTH_YEAR_FORMAT_2
                      )}
                </Col>
              </Row>

              <Row className='mb-3'>
                <Col span='12'>
                  <Typography.Text strong>
                    {`${t('transfer_history.modal.transfer_type')}:`}
                  </Typography.Text>
                </Col>
                <Col span='12'>
                  {transferHistory?.isTransferToSameLevel === true
                    ? t('transfer_history.modal.transfer_type_2')
                    : t('transfer_history.modal.transfer_type_1')}
                </Col>
              </Row>

              {transferHistory?.processingMethod && (
                <Row className='mb-3'>
                  <Col span='8'>
                    <Typography.Text strong>
                      {`${t('transfer_history.modal.processing_method')}:`}
                    </Typography.Text>
                  </Col>
                  <Col span='16'>{transferHistory?.processingMethod}</Col>
                </Row>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Typography.Text strong>{`${t('attachments.title')}:`}</Typography.Text>
              <Table dataSource={dataSource} columns={columns} pagination={false} />
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

export default TransferHistoryDetailModal;
