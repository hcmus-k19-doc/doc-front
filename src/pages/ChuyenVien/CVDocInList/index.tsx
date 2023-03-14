import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
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
import { format } from 'date-fns';
import { getIncomingDocuments } from 'services/IncomingDocumentService';

import { FooterProps, PAGE_SIZE, TableDataType, TableRowDataType } from './models';

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

const Footer: React.FC<FooterProps> = ({ totalElements, setPage }) => {
  const { t } = useTranslation();

  return (
    <div className='mt-5 flex justify-between'>
      <Button type='primary' ghost>
        {t('MAIN_PAGE.BUTTON.REPORT_TO_LEADER')}
      </Button>

      <Pagination
        defaultCurrent={1}
        defaultPageSize={PAGE_SIZE}
        onChange={(page) => setPage(page)}
        total={totalElements}
        showTotal={(total) => t('COMMON.PAGINATION.SHOW_TOTAL', { total })}
      />
    </div>
  );
};

const CVDocInList: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = React.useState(1);

  const { isLoading, data } = useQuery(
    `QUERIES.INCOMING_DOCUMENT_LIST-${page}-${PAGE_SIZE}`,
    () => {
      return getIncomingDocuments('', page)
        .then((data) => {
          const totalElements = data.totalElements;
          const rowsData: TableRowDataType[] = data.payload.map((item) => {
            return {
              key: item.id,
              id: item.id,
              issueLevel: t(`SENDING_LEVEL.${item.sendingLevel.level}`),
              type: t(`DOCUMENT_TYPE.${item.documentType.type}`),
              arriveId: item.incomingNumber,
              originId: item.originalSymbolNumber,
              arriveDate: format(new Date(item.arrivingDate), 'dd-MM-yyyy'),
              issuePlace: item.distributionOrg.name,
              summary: item.summary,
              fullText: '',
              status: 'HEHE',
              deadline: 'HUHU',
            };
          });

          const tableData: TableDataType = {
            page: 1,
            totalElements: totalElements,
            payload: rowsData,
          };
          return tableData;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );

  return (
    <div>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST')}</div>

      <Collapse bordered={false} expandIcon={ExpandIcon}>
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
        loading={isLoading}
        rowSelection={{ type: 'checkbox' }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={() => <Footer totalElements={data?.totalElements || 0} setPage={setPage} />}
      />
    </div>
  );
};

export default CVDocInList;
