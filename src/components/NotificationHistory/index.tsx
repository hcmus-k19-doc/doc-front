import { useEffect, useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DownCircleTwoTone, UpCircleTwoTone } from '@ant-design/icons';
import { Empty, List, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useAuth } from 'components/AuthComponent';
import { ContainerHeight } from 'components/PageHeader/core/common';
import { TransferHistoryDto } from 'models/doc-main-models';
import VirtualList from 'rc-virtual-list';

import userService from '../../services/UserService';

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
  const [loading, setLoading] = useState(false);

  const handleOnOpenModal = async (event: any, transferHistory: TransferHistoryDto) => {
    if (!transferHistory.isRead) {
      try {
        await userService.updateNotificationStatus(transferHistory.id);
        props.setUnreadNotificationCount(props.unreadNotificationCount - 1);
      } catch (error) {
        console.error(error);
      }
    }
    event.preventDefault();
    props.handleNotificationClose();
    setIsModalOpen(true);
    setSelectedTransferHistory(transferHistory);
  };

  const handleOnCancelModal = () => {
    setIsModalOpen(false);
    modalForm.resetFields();
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await userService.updateAllNotificationStatus();
      props.setUnreadNotificationCount(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newTransferHistory = props.notifications.find(
      (item) => item.id === selectedTransferHistory?.id
    );
    setSelectedTransferHistory(newTransferHistory);
  }, [props.notifications]);

  return (
    <>
      {props.notifications.length > 0 ? (
        <>
          <List>
            <VirtualList
              data={props.notifications}
              height={ContainerHeight}
              itemHeight={47}
              itemKey='id'
              onScroll={props.onScroll}>
              {(item: TransferHistoryDto) => (
                <List.Item
                  className={item.isRead ? 'read' : 'unread'}
                  key={item.id}
                  onClick={(event) => handleOnOpenModal(event, item)}>
                  <List.Item.Meta
                    avatar={
                      item.senderId === currentUser?.id ? (
                        <UpCircleTwoTone twoToneColor='#52c41a' className='avatar' />
                      ) : (
                        <DownCircleTwoTone twoToneColor='#0096FF' className='avatar' />
                      )
                    }
                    title={t('transfer_history.title')}
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
                  <div hidden={item.isRead} className='circle'></div>
                </List.Item>
              )}
            </VirtualList>
          </List>
          <div className='notification-actions'>
            {loading ? ( // Render loading indicator when isLoading is true
              <Spin className={'spin'} />
            ) : (
              <a onClick={handleMarkAllAsRead}>{t('notification.mark_all_as_read')}</a>
            )}
          </div>

          <TransferHistoryDetailModal
            form={modalForm}
            isModalOpen={isModalOpen}
            handleClose={handleOnCancelModal}
            transferHistory={selectedTransferHistory as TransferHistoryDto}
            isTransferHistoryLoading={props.isTransferHistoryLoading}
          />
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.no_data.no_notification')}
        />
      )}
    </>
  );
};

export default NotificationHistory;
