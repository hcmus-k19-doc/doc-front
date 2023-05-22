import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Col, DatePicker, Form, Row, Select, Space, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from 'components/AuthComponent';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSecretaryTransferRes } from 'shared/hooks/SecretaryTransferQuery';
import { useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';

import { IncomingDocumentDto } from '../../../../models/doc-main-models';
import {
  i18_collaborators,
  i18n_assignee,
  i18n_document,
  i18n_document_number,
  i18n_implementation_date,
  i18n_is_infinite_processing_time,
  i18n_processing_time,
  i18n_sender,
  i18n_summary,
  TransferDocScreenFormProps,
  TransferDocScreenProps,
} from '../../core/models';

dayjs.extend(customParseFormat);
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const { Text } = Typography;

const SecretaryScreenComponent: React.FC<TransferDocScreenProps> = ({
  form,
  selectedDocs,
  isTransferToSameLevel,
  isDocCollaborator,
  isReadOnlyMode,
  transferDate,
  senderName,
}) => {
  const { t } = useTranslation();
  const { secretaries } = useSecretaryTransferRes();
  const { currentUser } = useAuth();
  const setSecretaryTransferQuery = useTransferQuerySetter();
  const [isInfiniteProcessingTime, setIsInfiniteProcessingTime] = React.useState(false);

  if (!isDocCollaborator) {
    secretaries?.map((secretarie) => {
      if (secretarie.value === currentUser?.id) {
        secretaries?.splice(secretaries.indexOf(secretarie), 1);
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
        setSecretaryTransferQuery({
          assigneeId: values.assignee,
          collaboratorIds: values.collaborators,
          processingTime: values.processingTime,
          isInfiniteProcessingTime: values.isInfiniteProcessingTime,
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
        {selectedDocs
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
          })}
      </div>
      <Row className='mt-4 mb-3'>
        <Col span='6'>
          <Typography.Text strong>
            <span className='asterisk'>*</span>
            {t(i18n_assignee)}
          </Typography.Text>
        </Col>
        <Col span='16'>
          <Form.Item name='assignee'>
            <Select style={{ width: '100%' }} allowClear options={secretaries} />
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
                <Select mode='multiple' allowClear options={secretaries} />
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
                <DatePicker
                  format={dateFormatList}
                  onChange={(_, dateString) => setProcessingTime(dateString)}
                  disabled={isInfiniteProcessingTime || isReadOnlyMode}
                />
              </Space>
            </Form.Item>
            <Form.Item
              name='isInfiniteProcessingTime'
              style={{ display: 'inline-block', margin: '0 16px' }}
              valuePropName='checked'
              initialValue={false}>
              <Checkbox onChange={onChooseNoneProcessingTime}>
                {t(i18n_is_infinite_processing_time)}
              </Checkbox>
            </Form.Item>
          </Row>
        </>
      )}
    </Form>
  );
};

export default SecretaryScreenComponent;
