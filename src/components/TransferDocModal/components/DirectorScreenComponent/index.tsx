import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Select, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from 'components/AuthComponent';
import { useDirectorTransferRes } from 'shared/hooks/DirectorTransferQuery';
import { useDirectorTransferQuerySetter } from 'shared/hooks/TransferDocQuery';

import {
  DirectorScreenFormProps,
  DirectorScreenProps,
  i18_collaborators,
  i18n_assignee,
  i18n_document,
  i18n_implementation_date,
  i18n_sender,
  i18n_summary,
} from '../../core/models';

const { Text } = Typography;

const dummyData = {
  sender: 'Nguyễn Văn A',
  implementationDate: '01/01/2021',
  document: 'Văn bản số 1',
  summary: 'Nội dung văn bản',
  assignee: [
    {
      value: 1,
      label: 'Nguyễn Văn B',
    },
    {
      value: 2,
      label: 'Nguyễn Văn C',
    },
    {
      value: 3,
      label: 'Nguyễn Văn D',
    },
  ],
  collaborators: [
    {
      value: 1,
      label: 'Nguyễn Văn B',
    },
    {
      value: 2,
      label: 'Nguyễn Văn C',
    },
    {
      value: 3,
      label: 'Nguyễn Văn D',
    },
    {
      value: 4,
      label: 'Nguyễn Văn E',
    },
    {
      value: 5,
      label: 'Nguyễn Văn F',
    },
    {
      value: 6,
      label: 'Nguyễn Văn G',
    },
  ],
};

const DirectorScreenComponent: React.FC<DirectorScreenProps> = ({ form }) => {
  const { t } = useTranslation();
  const { directors } = useDirectorTransferRes();
  const { currentUser } = useAuth();
  const setDirectorTransferQuery = useDirectorTransferQuerySetter();

  return (
    <Form
      form={form}
      onFinish={(values: DirectorScreenFormProps) => {
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
        <Col span='6'>{dummyData.implementationDate}</Col>
      </Row>
      <Row className='mt-3 mb-3'>
        <Col span='6'>
          <Text strong>{t(i18n_document)}</Text>
        </Col>
        <Col span='6'>{dummyData.document}</Col>
      </Row>
      <Row className='mt-4 mb-4' align='middle'>
        <Col span='6'>
          <Text strong>{t(i18n_summary)}</Text>
        </Col>
        <Col span='16'>
          <Form.Item name='summary'>
            <TextArea rows={4} value={dummyData.summary} />
          </Form.Item>
        </Col>
      </Row>
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
