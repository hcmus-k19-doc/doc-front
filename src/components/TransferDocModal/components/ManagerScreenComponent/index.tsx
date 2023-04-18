import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Col, DatePicker, Form, List, Row, Select, Space, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useAuth } from 'components/AuthComponent';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import VirtualList from 'rc-virtual-list';
import { useManagerTransferRes } from 'shared/hooks/ManagerTransferQuery';
import { useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import { DAY_MONTH_YEAR_FORMAT_2 } from 'utils/DateTimeUtils';

import {
  i18_collaborators,
  i18n_assignee,
  i18n_document,
  i18n_document_number,
  i18n_implementation_date,
  i18n_is_infinite_processing_time,
  i18n_processing_time,
  i18n_sender,
  TransferDocScreenFormProps,
  TransferDocScreenProps,
} from '../../core/models';

dayjs.extend(customParseFormat);
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const { Text } = Typography;
const itemHeight = 50;

const ManagerScreenComponent: React.FC<TransferDocScreenProps> = ({ form, selectedDocs }) => {
  const { t } = useTranslation();
  const { managers } = useManagerTransferRes();
  const { currentUser } = useAuth();
  const setManagerTransferQuery = useTransferQuerySetter();
  const [isInfiniteProcessingTime, setIsInfiniteProcessingTime] = React.useState(false);

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
      <Row className='my-6'>
        <Col span='6'>
          <Text strong>{`${t(i18n_document)} (${selectedDocs.length})`}</Text>
        </Col>
        <Col span='16'>
          <List>
            <VirtualList
              data={selectedDocs.sort((a, b) => a.id - b.id)}
              height={itemHeight * 2}
              itemHeight={itemHeight}
              itemKey={'id'}>
              {(item) => (
                <List.Item key={item.id}>
                  <div>{t(i18n_document_number, { id: item.id })}</div>
                </List.Item>
              )}
            </VirtualList>
          </List>
        </Col>
      </Row>
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
              disabled={isInfiniteProcessingTime}
            />
          </Space>
        </Form.Item>
        <Form.Item
          name='isInfiniteProcessingTime'
          style={{ display: 'inline-block', margin: '0 16px' }}
          valuePropName='checked'>
          <Checkbox onChange={onChooseNoneProcessingTime}>
            {t(i18n_is_infinite_processing_time)}
          </Checkbox>
        </Form.Item>
      </Row>
    </Form>
  );
};

export default ManagerScreenComponent;
