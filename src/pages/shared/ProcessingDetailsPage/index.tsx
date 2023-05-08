import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Table, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import { ColumnsType } from 'antd/es/table';
import PageHeader from 'components/PageHeader';
import { t } from 'i18next';
import { useProcessingDetailsRes } from 'shared/hooks/ProcessingDetailQuery';

import { ProcessingDetailsRowDataType } from './core/models';

const columns: ColumnsType<ProcessingDetailsRowDataType> = [
  {
    title: t('processing_detail_page.table.column.step'),
    dataIndex: 'step',
    align: 'center',
  },
  {
    title: t('processing_detail_page.table.column.incoming_number'),
    dataIndex: 'incomingNumber',
    align: 'center',
  },
  {
    title: t('processing_detail_page.table.column.full_name'),
    dataIndex: 'fullName',
    align: 'center',
  },
  {
    title: t('processing_detail_page.table.column.department'),
    dataIndex: 'department',
    align: 'center',
  },
  {
    title: t('processing_detail_page.table.column.role'),
    dataIndex: 'role',
    align: 'center',
  },
];

function ProcessingDetailsPage() {
  const { incomingDocumentId } = useParams();
  const { data, isFetching } = useProcessingDetailsRes(Number(incomingDocumentId));

  return (
    <div className='mx-12'>
      <div className='text-lg text-primary'>{t('processing_detail_page.title')}</div>

      <Table
        loading={isFetching}
        rowClassName={() => 'row-hover'}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1500 }}
        pagination={false}
      />
    </div>
  );
}

export default function ProcessingDetailsPageWrapper() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <PageHeader />
      <Content style={{ padding: '0 50px', minHeight: '100vh' }} className='mt-12'>
        <Layout className='py-5' style={{ backgroundColor: colorBgContainer }}>
          <ProcessingDetailsPage />
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        HCMUS &copy; 2023 Hệ thống phê duyệt và phát hành văn thư
      </Footer>
    </Layout>
  );
}
