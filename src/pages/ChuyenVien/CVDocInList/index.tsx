import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterFilled } from '@ant-design/icons';
import {
  Button,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  Pagination,
  Select,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PRIMARY_COLOR } from 'config/constant';
import { RecoilRoot } from 'recoil';
import { useRequestQuery, useResponseQuery } from 'shared/hooks/IncomingDocumentListQuery';
import { DocQueryState } from 'shared/hooks/IncomingDocumentListQuery/stateModel';

import { PAGE_SIZE, TableRowDataType } from './models';

import './index.css';

const { Panel } = Collapse;
const { TextArea } = Input;

const columns: ColumnsType<TableRowDataType> = [
  {
    title: 'STT',
    dataIndex: 'id',
  },
  {
    title: 'Cấp gửi',
    dataIndex: 'issueLevel',
  },
  {
    title: 'Loại văn bản',
    dataIndex: 'type',
  },
  {
    title: 'Số đến theo sổ',
    dataIndex: 'arriveId',
    render: (text: string) => <a className='link'>{text}</a>,
  },
  {
    title: 'Số ký hiệu gốc',
    dataIndex: 'originId',
    render: (text: string) => <a className='link'>{text}</a>,
  },
  {
    title: 'Ngày đến',
    dataIndex: 'arriveDate',
  },
  {
    title: 'Nơi phát hành',
    dataIndex: 'issuePlace',
  },
  {
    title: 'Trích yếu',
    dataIndex: 'summary',
    width: '25%',
  },
  {
    title: 'Toàn văn',
    dataIndex: 'fullText',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
  },
  {
    title: 'Thời hạn xử lý',
    dataIndex: 'deadline',
  },
];

const ExpandIcon = () => {
  return <FilterFilled style={{ color: PRIMARY_COLOR }} />;
};

const Footer = () => {
  const { t } = useTranslation();
  const [requestQuery, setRequestQuery] = useRequestQuery();
  const { data } = useResponseQuery();

  const handleOnChange = (page: number) => {
    const updatedState = { ...requestQuery, page } as DocQueryState;
    setRequestQuery(updatedState);
  };

  return (
    <div className='mt-5 flex justify-between'>
      <Button type='primary'>{t('MAIN_PAGE.BUTTON.REPORT_TO_LEADER')}</Button>

      <Pagination
        defaultCurrent={1}
        defaultPageSize={PAGE_SIZE}
        onChange={handleOnChange}
        total={data?.totalElements}
        showTotal={(total) => t('COMMON.PAGINATION.SHOW_TOTAL', { total })}
      />
    </div>
  );
};

const CVDocInList: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, data } = useResponseQuery();
  const [requestQuery, setRequestQuery] = useRequestQuery();

  return (
    <div>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST')}</div>

      <Collapse bordered={false} expandIcon={ExpandIcon}>
        <Panel header={t('COMMON.SEARCH_CRITERIA.TITLE')} key='1'>
          <Form
            onFinish={(values) => {
              setRequestQuery({ ...requestQuery, ...values } as DocQueryState);
            }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}>
            <div className='grid grid-cols-2'>
              <Form.Item name='incomingNumber' label={t('search_criteria_bar.incoming_number')}>
                <Input />
              </Form.Item>

              <Form.Item
                name='originalSymbolNumber'
                label={t('search_criteria_bar.original_symbol_number')}>
                <Input />
              </Form.Item>

              <Form.Item name='documentType' label={t('search_criteria_bar.document_type')}>
                <Select>
                  <Select.Option value='demo'>Demo</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name='distributionOrg'
                label={t('search_criteria_bar.distribution_organization')}>
                <Select>
                  <Select.Option value='demo'>Demo</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name='arrivingDate' label={t('search_criteria_bar.arriving_date')}>
                <DatePicker className='flex flex-grow' />
              </Form.Item>

              <Form.Item
                name='processingDuration'
                label={t('search_criteria_bar.processing_duration')}>
                <DatePicker className='flex flex-grow' />
              </Form.Item>

              <Form.Item name='summary' label={t('search_criteria_bar.summary')}>
                <TextArea rows={4} />
              </Form.Item>
            </div>

            <Form.Item className='ml-6'>
              <Button htmlType='submit' type='primary'>
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>

      <Divider />

      <Table
        loading={isLoading}
        rowSelection={{ type: 'checkbox' }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={Footer}
      />
    </div>
  );
};

const CVDocInListWrapper = () => (
  <RecoilRoot>
    <CVDocInList />
  </RecoilRoot>
);

export default CVDocInListWrapper;
