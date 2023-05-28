import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Col, DatePicker, Form, List, Row, Select, Space, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from 'components/AuthComponent';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import VirtualList from 'rc-virtual-list';
import { useManagerTransferRes } from 'shared/hooks/ManagerTransferQuery';
import { useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';

import { IncomingDocumentDto, OutgoingDocumentGetDto } from '../../../../models/doc-main-models';
import {
  i18_collaborators,
  i18n_assignee,
  i18n_document,
  i18n_document_number,
  i18n_implementation_date,
  i18n_is_infinite_processing_time,
  i18n_process_method,
  i18n_processing_time,
  i18n_sender,
  i18n_summary,
  processMethodOptions,
  TransferDocScreenFormProps,
  TransferDocScreenProps,
} from '../../core/models';

dayjs.extend(customParseFormat);
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const { Text } = Typography;
const itemHeight = 50;

const ManagerScreenComponent: React.FC<TransferDocScreenProps> = ({
  form,
  selectedDocs,
  isTransferToSameLevel,
  isDocCollaborator,
  isReadOnlyMode,
  transferDate,
  senderName,
  processingDuration,
  type,
}) => {
  const { t } = useTranslation();
  const { managers } = useManagerTransferRes();
  const { currentUser } = useAuth();
  const setManagerTransferQuery = useTransferQuerySetter();
  const [isInfiniteProcessingTime, setIsInfiniteProcessingTime] = React.useState(false);

  if (!isDocCollaborator) {
    managers?.map((manager) => {
      if (manager.value === currentUser?.id) {
        managers?.splice(managers.indexOf(manager), 1);
      }
    });
  }

  const onChooseNoneProcessingTime = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      form.setFieldsValue({ processingTime: '' });
      form.setFieldsValue({ isInfiniteProcessingTime: true });
      setIsInfiniteProcessingTime(true);
    } else {
      form.setFieldsValue({ isInfiniteProcessingTime: false });
      setIsInfiniteProcessingTime(false);
    }
  };

  const setProcessingTime = (dateString: any) => {
    form.setFieldsValue({ processingTime: dateString });
  };

  return (
    <Form
      form={form}
      onFinish={(values: TransferDocScreenFormProps) => {
        setManagerTransferQuery({
          assigneeId: values.assignee,
          collaboratorIds: values.collaborators,
          processingTime: values.processingTime,
          isInfiniteProcessingTime: values.isInfiniteProcessingTime,
          processMethod: values.processMethod,
        });
      }}
      disabled={isReadOnlyMode}>
      <Row>
        <Col span='6'>
          <Text strong>{t(i18n_sender)}</Text>
        </Col>
        <Col span='6'>{isDocCollaborator ? senderName : currentUser?.fullName}</Col>
      </Row>
      <Row className='my-6'>
        <Col span='6'>
          <Text strong>{t(i18n_implementation_date)}</Text>
        </Col>
        <Col span='6'>{transferDate}</Col>
      </Row>
      <div className='document-info'>
        {type === 'IncomingDocument'
          ? selectedDocs
              .sort((a: IncomingDocumentDto, b: IncomingDocumentDto) => a.id - b.id)
              .map((item: IncomingDocumentDto) => {
                return (
                  <React.Fragment key={item.id}>
                    <Row className='mt-3 mb-3'>
                      <Col span='6'>
                        <Text strong>{t(i18n_document)}</Text>
                      </Col>
                      <Col span='18'>{t(i18n_document_number, { id: item.incomingNumber })}</Col>
                    </Row>
                    <Row className='mt-4 mb-4' align='middle'>
                      <Col span='6'>
                        <Text strong>{t(i18n_summary)}</Text>
                      </Col>
                      <Col span='16'>
                        <TextArea rows={4} disabled defaultValue={item.summary} />
                      </Col>
                    </Row>
                  </React.Fragment>
                );
              })
          : selectedDocs
              .sort((a: OutgoingDocumentGetDto, b: OutgoingDocumentGetDto) => a.id - b.id)
              .map((item: OutgoingDocumentGetDto) => {
                return (
                  <React.Fragment key={item.id}>
                    <Row className='mt-3 mb-3'>
                      <Col span='6'>
                        <Text strong>{t(i18n_document)}</Text>
                      </Col>
                      <Col span='18'>{t(i18n_document_number, { id: item.outgoingNumber })}</Col>
                    </Row>
                    <Row className='mt-4 mb-4' align='middle'>
                      <Col span='6'>
                        <Text strong>{t(i18n_summary)}</Text>
                      </Col>
                      <Col span='16'>
                        <TextArea rows={4} disabled defaultValue={item.summary} />
                      </Col>
                    </Row>
                  </React.Fragment>
                );
              })}
      </div>
      {/*<Row className='my-6'>*/}
      {/*  <Col span='6'>*/}
      {/*    <Text strong>{`${t(i18n_document)} (${selectedDocs.length})`}</Text>*/}
      {/*  </Col>*/}
      {/*  <Col span='16'>*/}
      {/*    <List>*/}
      {/*      <VirtualList*/}
      {/*        data={selectedDocs.sort(*/}
      {/*          (a: IncomingDocumentDto, b: IncomingDocumentDto) => a.id - b.id*/}
      {/*        )}*/}
      {/*        height={itemHeight * 2}*/}
      {/*        itemHeight={itemHeight}*/}
      {/*        itemKey={'id'}>*/}
      {/*        {(item) => (*/}
      {/*          <List.Item style={{ padding: '0px' }} key={item.id}>*/}
      {/*            <div>{t(i18n_document_number, { id: item.id })}</div>*/}
      {/*          </List.Item>*/}
      {/*        )}*/}
      {/*      </VirtualList>*/}
      {/*    </List>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
      <Row className='mt-4 mb-3'>
        <Col span='6'>
          <Typography.Text strong>
            <span className='asterisk'>*</span>
            {t(i18n_assignee)}
          </Typography.Text>
        </Col>
        <Col span='16'>
          <Form.Item name='assignee'>
            <Select style={{ width: '100%' }} allowClear options={managers} />
          </Form.Item>
        </Col>
      </Row>
      {(!isTransferToSameLevel || isDocCollaborator) && (
        <>
          <Row className='mb-3'>
            <Col span='6'>
              <Typography.Text strong>
                <span className='asterisk'>*</span>
                {t(i18_collaborators)}
              </Typography.Text>
            </Col>
            <Col span='16'>
              <Form.Item name='collaborators'>
                <Select mode='multiple' allowClear options={managers} />
              </Form.Item>
            </Col>
          </Row>
          <Row className='mt-4 mb-3'>
            <Col span='6'>
              <Typography.Text strong>
                <span className='asterisk'>*</span>
                {t(i18n_process_method)}
              </Typography.Text>
            </Col>
            <Col span='16'>
              <Form.Item name='processMethod'>
                <Select style={{ width: '100%' }} allowClear options={processMethodOptions} />
              </Form.Item>
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col span='6'>
              <Typography.Text strong>
                <span className='asterisk'>*</span>
                {t(i18n_processing_time)}
              </Typography.Text>
            </Col>
            <Form.Item name='processingTime'>
              <Space direction='vertical' size={12}>
                {isReadOnlyMode ? (
                  <Text>{processingDuration}</Text>
                ) : (
                  <DatePicker
                    format={dateFormatList}
                    onChange={(_, dateString) => setProcessingTime(dateString)}
                    disabled={isInfiniteProcessingTime || isReadOnlyMode}
                    // defaultValue={isReadOnlyMode ? dayjs(processingDuration) : undefined}
                  />
                )}
              </Space>
            </Form.Item>
            {!isReadOnlyMode && (
              <Form.Item
                name='isInfiniteProcessingTime'
                style={{ display: 'inline-block', margin: '0 16px' }}
                valuePropName='checked'
                initialValue={false}>
                <Checkbox onChange={onChooseNoneProcessingTime}>
                  {t(i18n_is_infinite_processing_time)}
                </Checkbox>
              </Form.Item>
            )}
          </Row>
        </>
      )}
    </Form>
  );
};

export default ManagerScreenComponent;
