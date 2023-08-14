import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CloseCircleOutlined,
  DownloadOutlined,
  FileSearchOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Dropdown, Empty, List, MenuProps, Modal, Spin } from 'antd';
import { AttachmentDto, FileType } from 'models/doc-main-models';
import attachmentService from 'services/AttachmentService';

import { PRIMARY_COLOR } from '../../config/constant';
import { useSweetAlert } from '../../shared/hooks/SwalAlert';

import { downloadFileFromBlob, parseLocalDateTimeToFormatedDate } from './core/common';
import { AttachmentsComponentProps } from './core/models';
import AttachmentPreviewModal from './AttachmentPreviewModal';
import ImagePreviewModal from './ImagePreviewModal';

import './index.css';

const { confirm } = Modal;

const Attachments: React.FC<AttachmentsComponentProps> = ({
  isReadOnly,
  attachmentList,
  setAttachmentList,
  isEditing,
}: {
  isReadOnly: boolean;
  attachmentList: AttachmentDto[];
  setAttachmentList: (attachmentList: AttachmentDto[]) => void;
  isEditing: boolean;
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<AttachmentDto>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const showAlert = useSweetAlert();

  const handleCancel = () => {
    setIsPreviewModalOpen(false);
  };

  const handleDownloadFile = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await attachmentService.getFileContentFromMinioByKey(
        selectedFile?.alfrescoFileId
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
    setIsPreviewModalOpen(true);
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

  const deleteFile = async (id: number) => {
    try {
      const response = await attachmentService.deleteAttachmentById(id);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: `${t('outgoing_doc_detail_page.message.delete_file_success')}`,
          showConfirmButton: false,
          timer: 2000,
        });
        setAttachmentList(attachmentList.filter((element) => element.id !== id));
      }
    } catch (error) {
      showAlert({
        icon: 'error',
        html: `${t('outgoing_doc_detail_page.message.error')}`,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  };

  const onDeleteAttachmentConfirm = (id: number) => {
    confirm({
      icon: <QuestionCircleOutlined style={{ color: PRIMARY_COLOR }} />,
      content: (
        <div className='mt-3'>{t('outgoing_doc_detail_page.message.confirm_delete_file')}</div>
      ),
      okText: t('outgoing_doc_detail_page.button.delete'),
      cancelText: t('outgoing_doc_detail_page.button.cancel'),
      onOk: async () => {
        await deleteFile(id);
      },
    });
  };

  return (
    <div className='linked-documents'>
      <div className='flex justify-between linked-header'>
        {!isReadOnly && <div className='linked-label font-semibold'>{t('attachments.title')}</div>}

        <div className='text-primary pr-2'>
          <span className='ml-2 cursor-pointer text-link'></span>
        </div>
      </div>
      {attachmentList.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('common.no_data.no_attachment')}
        />
      ) : (
        <>
          {selectedFile?.fileType === FileType.PDF ? (
            <AttachmentPreviewModal
              attachment={selectedFile as AttachmentDto}
              handleClose={handleCancel}
              isPreviewModalOpen={isPreviewModalOpen}
            />
          ) : (
            <ImagePreviewModal
              attachment={selectedFile as AttachmentDto}
              handleClose={handleCancel}
              isPreviewModalOpen={isPreviewModalOpen}
              setIsPreviewModalOpen={setIsPreviewModalOpen}
            />
          )}

          <List
            itemLayout='horizontal'
            dataSource={attachmentList}
            renderItem={(item, index) => {
              return (
                <List.Item
                  actions={[
                    !isReadOnly && (
                      <span
                        key={`delete-${item.id}`}
                        onClick={() => {
                          onDeleteAttachmentConfirm(item.id as number);
                        }}>
                        <CloseCircleOutlined hidden={!isEditing} />
                      </span>
                    ),
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
                    description={
                      !isReadOnly &&
                      `${t('attachments.created_date')}: ${parseLocalDateTimeToFormatedDate(
                        item.createdDate as string,
                        t
                      )}`
                    }
                  />
                </List.Item>
              );
            }}
          />
        </>
      )}
    </div>
  );
};

export default Attachments;
