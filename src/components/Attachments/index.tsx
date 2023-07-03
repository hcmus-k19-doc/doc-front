import { List } from 'antd';

import { AttachmentsComponentProps } from './core/models';

import './index.css';

const Attachments: React.FC<AttachmentsComponentProps> = (props: AttachmentsComponentProps) => {
  return (
    <List
      itemLayout='horizontal'
      dataSource={props.attachments}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <div>
                <span className='cursor-pointer text-primary text-link mr-2'>{item.fileName}</span>
                <span>{item.createdBy}</span>
              </div>
            }
            description={item.createdDate}
          />
        </List.Item>
      )}
    />
  );
};

export default Attachments;
