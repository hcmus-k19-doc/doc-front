import { useTranslation } from 'react-i18next';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Empty, List } from 'antd';
import { format, parseISO } from 'date-fns';

import { AttachmentsComponentProps } from './core/models';

import './index.css';

const parseLocalDateTimeToFormatedDate = (dateTimeString: string, t: any) => {
  const dateTime = parseISO(dateTimeString);

  const formattedDate = format(dateTime, 'dd-MM-yyyy');
  const formattedTime = format(dateTime, 'HH:mm:ss');

  return `${formattedDate} ${t('attachments.at_time')} ${formattedTime}`;
};

const Attachments: React.FC<AttachmentsComponentProps> = (props: AttachmentsComponentProps) => {
  const { t } = useTranslation();

  return (
    <div className='linked-documents'>
      <div className='flex justify-between linked-header'>
        <div className='linked-label font-semibold'>{t('attachments.title')}</div>

        <div className='text-primary pr-2'>
          <span className='ml-2 cursor-pointer text-link'></span>
        </div>
      </div>
      {props.attachments.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.no_data.no_attachment')}
        />
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={props.attachments}
          renderItem={(item, index) => {
            return (
              <List.Item
                actions={[
                  <span
                    key={`delete-${item.id}`}
                    onClick={() => {
                      console.log('delete document', item.alfrescoFileId);
                    }}>
                    <CloseCircleOutlined />
                  </span>,
                ]}>
                <List.Item.Meta
                  title={
                    <div>
                      <span className='cursor-pointer text-primary text-link mr-2'>
                        {index + 1}. {item.fileName}
                      </span>
                    </div>
                  }
                  description={`${t(
                    'attachments.created_date'
                  )}: ${parseLocalDateTimeToFormatedDate(item.createdDate as string, t)}`}
                />
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

export default Attachments;
