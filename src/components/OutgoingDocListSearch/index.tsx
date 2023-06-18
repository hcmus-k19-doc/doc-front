import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OutgoingDocumentGetDto } from 'models/doc-main-models';
import { getColorBaseOnStatus } from 'pages/shared/IncomingDocListPage/core/common';
import { useOutgoingDocRes } from 'shared/hooks/OutgoingDocumentListQuery';

import Footer from './components/Footer';
import OutgoingDocumentSearchForm from './components/OutgoingDocumentSearchForm';
import { OutgoingDocListSearchProps, TableRowDataType } from './core/models';

import './index.css';

const OutgoingDocListSearch: React.FC<OutgoingDocListSearchProps> = ({
  linkedDocuments,
  selectedDocumentsToLink,
  handleSelectedDocumentsToLinkChanged,
}) => {
  const { t } = useTranslation();
  const { isLoading, data, isFetching } = useOutgoingDocRes(true);

  const navigate = useNavigate();

  const columns: ColumnsType<TableRowDataType> = [
    {
      title: t('outgoingDocListPage.table.columns.name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('outgoingDocListPage.table.columns.originId'),
      dataIndex: 'originId',
    },
    {
      title: t('outgoingDocListPage.table.columns.release_number'),
      dataIndex: 'releaseNumber',
      sorter: (a, b) => a.releaseNumber.localeCompare(b.releaseNumber),
    },
    {
      title: t('outgoingDocListPage.table.columns.type'),
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      filters: [...new Set(data?.payload.map((item) => item.type))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
    },
    {
      title: t('outgoingDocListPage.table.columns.status'),
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (_, record) => {
        return <Tag color={getColorBaseOnStatus(record.status, t)}>{record.status}</Tag>;
      },
    },
    {
      title: t('outgoingDocListPage.table.columns.issuePlace'),
      dataIndex: 'issuePlace',
      sorter: (a, b) => a.issuePlace.localeCompare(b.issuePlace),
      filters: [...new Set(data?.payload.map((item) => item.issuePlace))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.issuePlace.indexOf(value as string) === 0,
    },
    {
      title: t('outgoingDocListPage.table.columns.summary'),
      dataIndex: 'summary',
      width: '20%',
      render: (text) => {
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
      },
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
      <OutgoingDocumentSearchForm />

      <div className='mb-3'></div>

      <Table
        loading={isLoading || isFetching}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              navigate(`/docin/in-detail/${record.id}`);
            },
          };
        }}
        rowClassName={() => 'row-hover'}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          getCheckboxProps: (record) => ({
            disabled: linkedDocuments.some((doc: { id: number }) => doc.id === record.id),
          }),
        }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1200 }}
        pagination={false}
        footer={() => <Footer />}
      />
    </>
  );
};

export default OutgoingDocListSearch;
