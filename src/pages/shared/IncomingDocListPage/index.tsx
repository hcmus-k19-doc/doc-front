import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterFilled } from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
} from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { PRIMARY_COLOR } from 'config/constant';
import { RecoilRoot } from 'recoil';
import { useDistributionOrgRes } from 'shared/hooks/DistributionOrganizations';
import { useDocumentTypesRes } from 'shared/hooks/DocumentTypesQuery';
import { useIncomingDocReq, useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { DocQueryState, SearchState } from 'shared/hooks/IncomingDocumentListQuery/core/states';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

import TransferDocModal from '../../../components/TransferDocModal';

import { PAGE_SIZE, TableRowDataType } from './core/models';

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
  const [requestQuery, setRequestQuery] = useIncomingDocReq();
  const { data } = useIncomingDocRes();

  const handleOnChange = (page: number) => {
    const updatedState = { ...requestQuery, page } as DocQueryState;
    setRequestQuery(updatedState);
  };

  return (
    <div className='mt-5 flex justify-between'>
      <Button type='primary'>{t('MAIN_PAGE.BUTTON.REPORT_TO_LEADER')}</Button>

      <Pagination
        current={requestQuery.page}
        defaultCurrent={1}
        defaultPageSize={PAGE_SIZE}
        onChange={handleOnChange}
        total={data?.totalElements}
        showTotal={(total) => t('COMMON.PAGINATION.SHOW_TOTAL', { total })}
      />
    </div>
  );
};

const IncomingDocListPage: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, data } = useIncomingDocRes();
  const { documentTypes } = useDocumentTypesRes();
  const { distributionOrgs } = useDistributionOrgRes();
  const [form] = useForm();
  const [requestQuery, setRequestQuery] = useIncomingDocReq();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST')}</div>

      <Collapse bordered={false} expandIcon={ExpandIcon}>
        <Panel header={t('COMMON.SEARCH_CRITERIA.TITLE')} key='1'>
          <Form
            form={form}
            onFinish={(values: SearchState) => {
              setRequestQuery({ ...requestQuery, ...values, page: 1 });
            }}
            layout='vertical'>
            <Row justify='center'>
              <Col span={16}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name='incomingNumber'
                      label={t('search_criteria_bar.incoming_number')}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Form.Item
                      name='originalSymbolNumber'
                      label={t('search_criteria_bar.original_symbol_number')}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={11}>
                    <Form.Item name='documentTypeId' label={t('search_criteria_bar.document_type')}>
                      <Select>
                        {documentTypes?.map((documentType: any) => (
                          <Select.Option key={documentType.id} value={documentType.id}>
                            {t(`DOCUMENT_TYPE.${documentType.type}`)}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Form.Item
                      name='distributionOrgId'
                      label={t('search_criteria_bar.distribution_organization')}>
                      <Select>
                        {distributionOrgs?.map((distributionOrg: any) => (
                          <Select.Option key={distributionOrg.id} value={distributionOrg.id}>
                            {distributionOrg.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={11}>
                    <Form.Item name='arrivingDate' label={t('search_criteria_bar.arriving_date')}>
                      <DatePicker.RangePicker
                        format={DAY_MONTH_YEAR_FORMAT}
                        locale={locale}
                        className='flex flex-grow'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Form.Item
                      name='processingDuration'
                      label={t('search_criteria_bar.processing_duration')}>
                      <DatePicker.RangePicker
                        format={DAY_MONTH_YEAR_FORMAT}
                        locale={locale}
                        className='flex flex-grow'
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item name='summary' label={t('search_criteria_bar.summary')}>
                      <TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row justify='space-between'>
              <Form.Item className='ml-6'>
                <Button htmlType='submit' type='primary'>
                  Tìm kiếm
                </Button>
              </Form.Item>
              <Form.Item className='mr-6'>
                <Button
                  onClick={() => form.resetFields()}
                  htmlType='submit'
                  type='default'
                  className='px-[32px] reset-btn'>
                  {t('COMMON.SEARCH_CRITERIA.RESET')}
                </Button>
              </Form.Item>
            </Row>
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

      <Divider />

      <Button className='float-right px-8' htmlType='button' onClick={handleOnOpenModal}>
        {t('incomingDocDetailPage.button.collect')}
      </Button>

      <TransferDocModal
        isModalOpen={isModalOpen}
        handleCancel={() => {
          setIsModalOpen(false);
        }}
        handleOk={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

const IncomingDocListPageWrapper = () => (
  <RecoilRoot>
    <IncomingDocListPage />
  </RecoilRoot>
);

export default IncomingDocListPageWrapper;
