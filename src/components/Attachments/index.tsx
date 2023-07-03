import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseCircleOutlined, DownloadOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Dropdown, Empty, List, MenuProps, Spin } from 'antd';
import { AttachmentDto } from 'models/doc-main-models';
import attachmentService from 'services/AttachmentService';

import { downloadFileFromBlob, parseLocalDateTimeToFormatedDate } from './core/common';
import { AttachmentsComponentProps } from './core/models';

import './index.css';

const Attachments: React.FC<AttachmentsComponentProps> = (props: AttachmentsComponentProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<AttachmentDto>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownloadFile = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await attachmentService.getFileContentFromS3Key(
        selectedFile?.alfrescoFileId as string
      );
      downloadFileFromBlob(data.data, selectedFile?.fileName as string);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewFile = (event: any) => {
    event.preventDefault();
    console.log('preview', selectedFile);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Spin spinning={loading}>
          <a onClick={handlePreviewFile}>
            <FileSearchOutlined style={{ marginRight: '8px' }} />
            {t('attachments.preview')}
          </a>
        </Spin>
      ),
    },
    {
      key: '2',
      label: (
        <Spin spinning={loading}>
          <a onClick={handleDownloadFile}>
            <DownloadOutlined style={{ marginRight: '8px' }} />
            {t('attachments.download')}
          </a>
        </Spin>
      ),
    },
  ];

  const onOpenChange = (open: boolean, file: AttachmentDto) => {
    if (open) {
      setSelectedFile(file);
    }
  };

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
                    <Dropdown
                      menu={{ items }}
                      trigger={['click']}
                      overlayClassName='dropdown-menu'
                      placement='bottomLeft'
                      onOpenChange={(open) => onOpenChange(open, item)}>
                      <div>
                        <span className='cursor-pointer text-primary text-link mr-2'>
                          {index + 1}. {item.fileName}
                        </span>
                      </div>
                    </Dropdown>
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
