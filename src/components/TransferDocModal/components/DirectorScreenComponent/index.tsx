import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Select, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from 'components/AuthComponent';
import format from 'date-fns/format';
import { useDirectorTransferRes } from 'shared/hooks/DirectorTransferQuery';
import { useIncomingDocByIdsRes } from 'shared/hooks/IncomingDocumentListQuery';
import { useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import { DAY_MONTH_YEAR_FORMAT_2 } from 'utils/DateTimeUtils';

import {
  i18_collaborators,
  i18n_assignee,
  i18n_document,
  i18n_document_number,
  i18n_implementation_date,
  i18n_sender,
  i18n_summary,
  TransferDocScreenFormProps,
  TransferDocScreenProps,
} from '../../core/models';

import './index.css';

const { Text } = Typography;

const DirectorScreenComponent: React.FC<TransferDocScreenProps> = ({ form, selectedDocIds }) => {
  const { t } = useTranslation();
  const { directors } = useDirectorTransferRes();
  const { data } = useIncomingDocByIdsRes(selectedDocIds);
  const { currentUser } = useAuth();
  const setDirectorTransferQuery = useTransferQuerySetter();

  return (
    <Form
      form={form}
      onFinish={(values: TransferDocScreenFormProps) => {
        setDirectorTransferQuery({
          summary: values.summary,
          assigneeId: values.assignee,
          collaboratorIds: values.collaborators,
        });
      }}>
      <Row>
        <Col span='6'>
          <Text strong>{t(i18n_sender)}</Text>
        </Col>
        <Col span='6'>{currentUser?.fullName}</Col>
      </Row>
      <Row className='my-6'>
        <Col span='6'>
          <Text strong>{t(i18n_implementation_date)}</Text>
        </Col>
        <Col span='6'>{format(new Date(), DAY_MONTH_YEAR_FORMAT_2)}</Col>
      </Row>
      <div className='document-info'>
        {data?.map((item) => {
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
      <Row className='mb-3'>
        <Col span='6'>
          <Text strong>{t(i18n_assignee)}</Text>
        </Col>
        <Col span='16'>
          <Form.Item name='assignee'>
            <Select style={{ width: '100%' }} allowClear options={directors} />
          </Form.Item>
        </Col>
      </Row>
      <Row className='mt-3 mb-3'>
        <Col span='6'>
          <Text strong>{t(i18_collaborators)}</Text>
        </Col>
        <Col span='16'>
          <Form.Item name='collaborators'>
            <Select mode='multiple' allowClear options={directors} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default DirectorScreenComponent;
