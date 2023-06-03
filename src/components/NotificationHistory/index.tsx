import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Avatar, List, message } from 'antd';
import { useAuth } from 'components/AuthComponent';
import { TransferHistoryDto, TransferHistorySearchCriteriaDto } from 'models/doc-main-models';
import VirtualList from 'rc-virtual-list';
import userService from 'services/UserService';

import './index.css';

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;
const defaultPageSize = 10;

const NotificationHistory: React.FC = () => {
  const [data, setData] = useState<TransferHistoryDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const appendData = async () => {
    // fetch(fakeDataUrl)
    //   .then((res) => res.json())
    //   .then((body) => {
    //     setData(data.concat(body.results));
    //     message.success(`${body.results.length} more items loaded!`);
    //   });
    try {
      const searchCriteria: TransferHistorySearchCriteriaDto = {
        userId: currentUser?.id || -1,
      };
      const response = await userService.getTransferHistory(
        searchCriteria,
        currentPage,
        defaultPageSize
      );
      setCurrentPage((currentPage) => currentPage + 1);
      console.log(response);
      if (response.length > 0) {
        setData(response);
        message.success(t('transfer_history.loaded_more_item', { number: defaultPageSize }));
      } else {
        message.success(t('transfer_history.no_more_item'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    appendData();
  }, []);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
      appendData();
    }
  };

  return (
    <>
      <List>
        <VirtualList
          data={data}
          height={ContainerHeight}
          itemHeight={47}
          itemKey='id'
          onScroll={onScroll}>
          {(item: TransferHistoryDto) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  item.senderId === currentUser?.id ? (
                    <Avatar icon={<ArrowDownOutlined />} className='avatar' />
                  ) : (
                    <Avatar icon={<ArrowUpOutlined />} className='avatar' />
                  )
                }
                title={<a href='#'>{t('transfer_history.title')}</a>}
                description={t('transfer_history.message', {
                  sender:
                    item.id === currentUser?.id
                      ? t('transfer_history.default_sender')
                      : item.senderName,
                  receiver:
                    item.id === currentUser?.id
                      ? item.receiverName
                      : t('transfer_history.default_receiver'),
                  documentId: item.documentIds.join(', '),
                })}
              />
              <div>
                <a href='#'>{t('transfer_history.button.view_detail')}</a>
              </div>
            </List.Item>
          )}
        </VirtualList>
      </List>
      <div className='notification-actions'>
        <a href='#'>Mark all as read</a>
      </div>
    </>
  );
};

export default NotificationHistory;
