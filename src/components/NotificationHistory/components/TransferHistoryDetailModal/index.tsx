import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileZipOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row, Spin, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Attachments from 'components/Attachments';
import { createDataSourceFromTransferHistory } from 'components/NotificationHistory/core/common';
import {
  TableRowDataType,
  TransferHistoryDetailModalProps,
} from 'components/NotificationHistory/core/models';
import { PRIMARY_COLOR } from 'config/constant';
import { format } from 'date-fns';
import attachmentService from 'services/AttachmentService';
import { DAY_MONTH_YEAR_FORMAT_2 } from 'utils/DateTimeUtils';

import './index.css';
const { Text } = Typography;
const TransferHistoryDetailModal: React.FC<TransferHistoryDetailModalProps> = (
  props: TransferHistoryDetailModalProps
) => {
  const { t } = useTranslation();
  const { transferHistory } = props;
  const [dataSource, setDataSource] = useState<TableRowDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string>();

  const columns: ColumnsType<TableRowDataType> = [
    {
      title: t('transfer_history.modal.table.columns.id'),
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: t('transfer_history.modal.table.columns.type'),
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (text) => {
        return <Text>{t(`transfer_history.modal.table.${text}`)}</Text>;
      },
    },
    {
      title: t('transfer_history.modal.table.columns.fullText'),
      dataIndex: 'fullText',
      align: 'center',
      width: 100,
      render: () => {
        if (loading) {
          return <LoadingOutlined />;
        }

        return (
          <Tooltip
            title={t('transfer_history.modal.table.tooltip.downloadAttachment')}
            placement='bottom'>
            <FileZipOutlined className='zip-icon' style={{ color: PRIMARY_COLOR }} />
          </Tooltip>
        );
      },
      onCell: (record) => {
        if (loading) {
          return {};
        }

        return {
          onClick: (event) => {
            event.stopPropagation();
            attachmentService.handleDownloadAttachmentInTransferHistory(
              record.parentFolderEnum,
              record.id,
              setError,
              setLoading
            );
          },
        };
      },
    },
    {
      title: t('transfer_history.modal.table.columns.attachmentDetail'),
      key: 'attachmentDetail',
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <Attachments
            attachmentList={record?.attachments}
            setAttachmentList={() => {
              return;
            }}
            isReadOnly={true}
            isEditing={false}
          />
        );
      },
    },
  ];

  useEffect(() => {
    if (transferHistory?.attachments) {
      setDataSource(createDataSourceFromTransferHistory(transferHistory));
    }
  }, [transferHistory]);
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
                  <Col span='12'>
                    <Typography.Text strong>
                      {`${t('transfer_history.modal.processing_method')}:`}
                    </Typography.Text>
                  </Col>
                  <Col span='12'>{transferHistory?.processingMethod}</Col>
                </Row>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Typography.Text strong>{`${t('attachments.title')}:`}</Typography.Text>
              <Table
                dataSource={dataSource}
                loading={props.isTransferHistoryLoading}
                columns={columns}
                pagination={false}
                rowClassName={() => 'row-hover'}
              />
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

export default TransferHistoryDetailModal;
