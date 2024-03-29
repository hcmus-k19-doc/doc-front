import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import moment from 'moment';
import { getColorBaseOnStatus } from 'pages/shared/IncomingDocListPage/core/common';
import { useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { YEAR_MONTH_DAY_FORMAT } from 'utils/DateTimeUtils';

import Footer from './components/Footer';
import IncomingDocumentSearchForm from './components/IncomingDocumentSearchForm';
import { IncomingDocListSearchProps, TableRowDataType } from './core/models';

import './index.css';

const IncomingDocListSearch: React.FC<IncomingDocListSearchProps> = ({
  linkedDocuments,
  selectedDocumentsToLink,
  handleSelectedDocumentsToLinkChanged,
}) => {
  const { isLoading, data, isFetching } = useIncomingDocRes(true);

  const navigate = useNavigate();

  const columns: ColumnsType<TableRowDataType> = [
    {
      title: t('incomingDocListPage.table.columns.arriveId'),
      dataIndex: 'arriveId',
      sorter: (a, b) => a.arriveId.localeCompare(b.arriveId),
    },
    {
      title: t('incomingDocListPage.table.columns.originId'),
      dataIndex: 'originId',
      sorter: (a, b) => a.originId.localeCompare(b.originId),
    },
    {
      title: t('incomingDocListPage.table.columns.name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('incomingDocListPage.table.columns.type'),
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      filters: [...new Set(data?.payload.map((item) => item.type))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
    },
    {
      title: t('incomingDocListPage.table.columns.arriveDate'),
      dataIndex: 'arriveDate',
      sorter: (a, b) =>
        moment(a.arriveDate, YEAR_MONTH_DAY_FORMAT).diff(
          moment(b.arriveDate, YEAR_MONTH_DAY_FORMAT)
        ),
    },
    {
      title: t('incomingDocListPage.table.columns.status'),
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [...new Set(data?.payload.map((item) => item.status))].map((item) => ({
        text: item,
        value: item,
      })),
      render: (_, record) => {
        return <Tag color={getColorBaseOnStatus(record.status, t)}>{record.status}</Tag>;
      },
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedDocumentsToLink.map((doc: { id: any }) => doc.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: TableRowDataType[]) => {
      handleSelectedDocumentsToLinkChanged(selectedRows);
    },
  };

  return (
    <>
      <IncomingDocumentSearchForm />

      <div className='mb-3'></div>

      <Table
        style={{ width: 'auto' }}
        loading={isLoading || isFetching}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              navigate(`/main/docin/in-detail/${record.id}`);
            },
          };
        }}
        rowClassName={() => 'row-hover'}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          getCheckboxProps: (record) => ({
            disabled: linkedDocuments?.some((doc: { id: number }) => doc.id === record.id),
          }),
        }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 900 }}
        pagination={false}
        footer={() => <Footer />}
      />
    </>
  );
};

export default IncomingDocListSearch;
