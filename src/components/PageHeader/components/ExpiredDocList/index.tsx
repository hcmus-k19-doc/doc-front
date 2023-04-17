import React from 'react';
import { List, Skeleton, Typography } from 'antd';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DocumentReminderDetailsDto, DocumentReminderStatusEnum } from 'models/doc-main-models';
import { useDocumentReminderDetailsRes } from 'shared/hooks/DocumentReminderQuery';
import { DEFAULT_DATE_FORMAT } from 'utils/DateTimeUtils';

const { Text } = Typography;

dayjs.extend(customParseFormat);

interface Props {
  selectedStatus: DocumentReminderStatusEnum;
}

function DocumentReminderDetailsList({ selectedStatus }: Props) {
  const { data, isLoading } = useDocumentReminderDetailsRes();
  console.log(data);
  return (
    <List
      itemLayout='horizontal'
      dataSource={data?.[selectedStatus]}
      renderItem={(item: DocumentReminderDetailsDto) => {
        return (
          <List.Item>
            <Skeleton avatar title={false} loading={isLoading} active>
              <List.Item.Meta
                title={<a className='font-bold'>{item.incomingNumber}</a>}
                description={item.summary}
              />
              <Text type='secondary' className='w-32 text-end'>
                {format(new Date(item.expirationDate), DEFAULT_DATE_FORMAT)}
              </Text>
            </Skeleton>
          </List.Item>
        );
      }}
    />
  );
}

export default DocumentReminderDetailsList;
