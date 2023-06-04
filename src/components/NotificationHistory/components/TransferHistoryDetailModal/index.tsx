import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Modal, Row, Spin, Typography } from 'antd';
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

  return (
    <Modal
      className='transfer-history-detail-modal'
      title={t('transfer_history.modal.modal_title')}
      style={{ top: 20 }}
      open={props.isModalOpen}
      onCancel={props.handleClose}
      footer={[
        <Button key='ok' type='primary' onClick={props.handleClose}>
          OK
        </Button>,
      ]}>
      {!transferHistory ? (
        <Spin size='large' />
      ) : (
        <Form form={props.form}>
          <Row className='mb-3'>
            <Col span='8'>
              <Text strong>{t('transfer_history.modal.sender')}</Text>
            </Col>
            <Col span='16'>{transferHistory?.senderName}</Col>
          </Row>

          <Row className='mb-3'>
            <Col span='8'>
              <Text strong>{t('transfer_history.modal.receiver')}</Text>
            </Col>
            <Col span='16'>{transferHistory?.receiverName}</Col>
          </Row>

          <Row className='mb-3'>
            <Col span='8'>
              <Typography.Text strong>{t('transfer_history.modal.document')}</Typography.Text>
            </Col>
            <Col span='16'>{transferHistory?.documentIds.join(', ')}</Col>
          </Row>

          <Row className='mb-3'>
            <Col span='8'>
              <Typography.Text strong>{t('transfer_history.modal.transfer_date')}</Typography.Text>
            </Col>
            <Col span='16'>
              {format(new Date(transferHistory?.createdDate), DAY_MONTH_YEAR_FORMAT_2)}
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col span='8'>
              <Typography.Text strong>
                {t('transfer_history.modal.processing_duration')}
              </Typography.Text>
            </Col>
            <Col span='16'>
              {transferHistory?.isInfiniteProcessingTime === true
                ? t('transfer_history.modal.infinite_processing_time')
                : format(new Date(transferHistory?.processingDuration), DAY_MONTH_YEAR_FORMAT_2)}
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col span='8'>
              <Typography.Text strong>{t('transfer_history.modal.transfer_type')}</Typography.Text>
            </Col>
            <Col span='16'>
              {transferHistory?.isTransferToSameLevel === true
                ? t('transfer_history.modal.transfer_type_2')
                : t('transfer_history.modal.transfer_type_1')}
            </Col>
          </Row>

          {transferHistory?.processMethod && (
            <Row className='mb-3'>
              <Col span='8'>
                <Typography.Text strong>
                  {t('transfer_history.modal.process_method')}
                </Typography.Text>
              </Col>
              <Col span='16'>{transferHistory?.processMethod}</Col>
            </Row>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default TransferHistoryDetailModal;
