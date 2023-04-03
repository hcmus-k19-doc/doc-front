import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import TransferDocModal from 'components/TransferDocModal';
import { RecoilRoot } from 'recoil';
import { useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import {
  initialDirectorTransferQueryState,
  useDirectorTransferQuerySetter,
} from 'shared/hooks/TransferDocQuery';

import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import { TableRowDataType } from './core/models';

import './index.css';

const columns: ColumnsType<TableRowDataType> = [
  {
    title: 'STT',
    dataIndex: 'id',
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

const IncomingDocListPage: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, data } = useIncomingDocRes();
  const [modalForm] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const directorTransferQuerySetter = useDirectorTransferQuerySetter();

  const handleOnOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOnCancelModal = () => {
    setIsModalOpen(false);
    modalForm.resetFields();
    directorTransferQuerySetter(initialDirectorTransferQueryState);
  };

  const handleOnOkModal = () => {
    setIsModalOpen(false);
    modalForm.submit();
    modalForm.resetFields();
    directorTransferQuerySetter(initialDirectorTransferQueryState);
  };

  return (
    <>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST')}</div>

      <SearchForm />

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
        {t('incomingDocDetailPage.button.transfer')}
      </Button>

      <TransferDocModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
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
