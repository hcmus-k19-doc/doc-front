import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useAuth } from 'components/AuthComponent';
import { ContainerHeight } from 'components/PageHeader/core/common';
import { TransferHistoryDto } from 'models/doc-main-models';
import VirtualList from 'rc-virtual-list';

import TransferHistoryDetailModal from './components/TransferHistoryDetailModal';
import { NotificationHistoryProps } from './core/models';

import './index.css';

const NotificationHistory: React.FC<NotificationHistoryProps> = (
  props: NotificationHistoryProps
) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const [selectedTransferHistory, setSelectedTransferHistory] = useState<TransferHistoryDto>();

  const handleOnOpenModal = (event: any, transferHistory: TransferHistoryDto) => {
    event.preventDefault();
    props.handleNotificationClose();
    setIsModalOpen(true);
    setSelectedTransferHistory(transferHistory);
  };

  const handleOnCancelModal = () => {
    setIsModalOpen(false);
    modalForm.resetFields();
  };

  return (
    <>
      <List>
        <VirtualList
          data={props.notifications}
          height={ContainerHeight}
          itemHeight={47}
          itemKey='id'
          onScroll={props.onScroll}>
          {(item: TransferHistoryDto) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  item.senderId === currentUser?.id ? (
                    <Avatar icon={<ArrowUpOutlined />} className='avatar' />
                  ) : (
                    <Avatar icon={<ArrowDownOutlined />} className='avatar' />
                  )
                }
                title={<a href='#'>{t('transfer_history.title')}</a>}
                description={t('transfer_history.message', {
                  sender:
                    item.senderId === currentUser?.id
                      ? t('transfer_history.default_sender')
                      : item.senderName,
                  receiver:
                    item.receiverId !== currentUser?.id
                      ? item.receiverName
                      : t('transfer_history.default_receiver'),
                  documentId: item.documentIds.join(', '),
                  level: item.isTransferToSameLevel
                    ? t('transfer_history.same_level')
                    : t('transfer_history.process'),
                })}
              />
              <div>
                <a href='#' onClick={(event) => handleOnOpenModal(event, item)}>
                  {t('transfer_history.button.view_detail')}
                </a>
              </div>
            </List.Item>
          )}
        </VirtualList>
      </List>
      <div className='notification-actions'>
        <a href='#'>Mark all as read</a>
      </div>

      <TransferHistoryDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleClose={handleOnCancelModal}
        transferHistory={selectedTransferHistory as TransferHistoryDto}
      />
    </>
  );
};

export default NotificationHistory;
