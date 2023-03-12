import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterFilled } from '@ant-design/icons';
import { primaryColor } from '@config/constant';
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

import './index.css';

const { Panel } = Collapse;

interface DataType {
  key: React.Key;
  id: string;
  issueLevel: string;
  type: string;
  arriveId: string;
  originId: string;
  arriveDate: string;
  issuePlace: string;
  summary: string;
  fullText: string;
  status: string;
  deadline: string;
}

const columns: ColumnsType<DataType> = [
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

const data: DataType[] = [
  {
    key: '1',
    id: '1',
    issueLevel: 'Thành phố',
    type: 'Công văn',
    arriveId: '120/ĐP',
    originId: '1237/VP-VX',
    arriveDate: '12/12/2020',
    issuePlace: 'Phòng Văn hóa',
    summary:
      'Công văn yêu cầu đăng ký tham gia chương trình abc xyz Công văn yêu cầu đăng ký tham gia chương trình abc xyz',
    fullText: '*link',
    status: 'Đã xử lý',
    deadline: '24/12/2020',
  },
  {
    key: '2',
    id: '2',
    issueLevel: 'Thành phố',
    type: 'Công văn',
    arriveId: '120/ĐP',
    originId: '1237/VP-VX',
    arriveDate: '12/12/2020',
    issuePlace: 'Phòng Văn hóa',
    summary:
      'Công văn yêu cầu đăng ký tham gia chương trình abc xyz Công văn yêu cầu đăng ký tham gia chương trình abc xyz',
    fullText: '*link',
    status: 'Đã xử lý',
    deadline: '24/12/2020',
  },
];

const { TextArea } = Input;

const CVDocInList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST')}</div>

      <Collapse
        bordered={false}
        expandIcon={() => <FilterFilled style={{ color: primaryColor }} />}>
        <Panel header={t('COMMON.SEARCH_CRITERIA.TITLE')} key='1'>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout='horizontal'
            style={{ maxWidth: 600 }}>
            <Form.Item label='Input'>
              <Input />
            </Form.Item>

            <Form.Item label='Select'>
              <Select>
                <Select.Option value='demo'>Demo</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label='DatePicker'>
              <DatePicker />
            </Form.Item>

            <Form.Item label='TextArea'>
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type='primary' ghost>
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>

      <Divider />

      <Table
        rowSelection={{ type: 'checkbox' }}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={() => (
          <div className='mt-5 flex justify-between'>
            <Button type='primary' ghost>
              {t('MAIN_PAGE.BUTTON.REPORT_TO_LEADER')}
            </Button>

            <Pagination
              pageSize={5}
              total={50}
              showTotal={(total) => t('COMMON.PAGINATION.SHOW_TOTAL', { total })}
            />
          </div>
        )}
      />
    </div>
  );
};

export default CVDocInList;
