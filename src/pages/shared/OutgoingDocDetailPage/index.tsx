import { useState } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Col, DatePicker, Form, Input, message, Row, Select, UploadProps } from 'antd';
import { Skeleton } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Dragger from 'antd/es/upload/Dragger';
import { PRIMARY_COLOR } from 'config/constant';
import dayjs from 'dayjs';
import {
  Confidentiality,
  DepartmentDto,
  DocumentTypeDto,
  FolderDto,
  OutgoingDocumentGetDto,
  OutgoingDocumentPutDto,
  Urgency,
} from 'models/doc-main-models';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import { useOutgoingDocumentDetailQuery } from 'shared/hooks/OutgoingDocumentDetailQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';
import { globalNavigate } from 'utils/RoutingUtils';

import './index.css';

function OutgoingDocDetailPage() {
  const queryClient = useQueryClient();

  const { docId } = useParams();
  const { t } = useTranslation();
  const [form] = useForm();
  const showAlert = useSweetAlert();

  const [isEditing, setIsEditing] = useState(false);

  const [foldersQuery, documentTypesQuery, distributionOrgsQuery, departmentsQuery] =
    useDropDownFieldsQuery();

  const { isLoading, data } = useOutgoingDocumentDetailQuery(+(docId || 1));

  const initForm = (outgoingDocument: OutgoingDocumentGetDto) => {
    form.setFieldsValue({
      folder: outgoingDocument.folder?.id,
      outgoingNumber: outgoingDocument.outgoingNumber,
      documentType: outgoingDocument.documentType?.id,
      publishingDepartment: outgoingDocument.publishingDepartment?.id,
      urgency: outgoingDocument.urgency,
      confidentiality: outgoingDocument.confidentiality,
      originalSymbolNumber: outgoingDocument.originalSymbolNumber,
      recipient: outgoingDocument.recipient,
      releaseDate: outgoingDocument.releaseDate ? dayjs(outgoingDocument.releaseDate) : null,
      summary: outgoingDocument.summary,
      signer: outgoingDocument.signer,
    });
  };

  const onCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  if (!isLoading) {
    if (data?.data) {
      const outgoingDocument: OutgoingDocumentGetDto = data?.data;

      initForm(outgoingDocument);
    } else {
      globalNavigate('error');
    }
  }

  const renderFolders = () => {
    return foldersQuery.data?.map((folder: FolderDto) => (
      <Select.Option key={folder.id} value={folder.id}>
        {folder.folderName}
      </Select.Option>
    ));
  };

  const renderDepartments = () => {
    return departmentsQuery.data?.map((org: DepartmentDto) => (
      <Select.Option key={org.id} value={org.id}>
        {org.departmentName}
      </Select.Option>
    ));
  };

  const renderDocumentTypes = () => {
    return documentTypesQuery.data?.map((docType: DocumentTypeDto) => (
      <Select.Option key={docType.id} value={docType.id}>
        {docType.type}
      </Select.Option>
    ));
  };

  const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const fileProps: UploadProps = {
    name: 'file',
    multiple: true,
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} ${t('outgoing_doc_detail_page.message.file_success')}`);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('outgoing_doc_detail_page.message.file_error')}`);
      }
    },
  };

  const saveChange = async (values: any) => {
    try {
      delete values.files;

      const document: OutgoingDocumentPutDto = {
        ...values,
        id: +(docId || 0),
        releaseDate: values.releaseDate ? new Date(values.releaseDate) : null,
      };

      const response = await outgoingDocumentService.updateOutgoingDocument(document);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: t('outgoing_doc_detail_page.message.edit_success') as string,
          showConfirmButton: false,
          timer: 2000,
        });
        setIsEditing(false);
        await queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_DETAIL', +(docId || 0)]);
      }
    } catch (error) {
      //Only in this case, deal to the UX, just show a popup instead of navigating to error page
      showAlert({
        icon: 'error',
        html: t('outgoing_doc_detail_page.message.error') as string,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div className='text-lg text-primary'>{t('outgoing_doc_detail_page.title')}</div>
          <Form form={form} layout='vertical' disabled={!isEditing} onFinish={saveChange}>
            <Row>
              <Col span={16}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      label={t('outgoing_doc_detail_page.form.doc_folder')}
                      name='folder'
                      required>
                      <Select disabled>{renderFolders()}</Select>
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Form.Item
                      label={t('outgoing_doc_detail_page.form.document_type')}
                      name='documentType'
                      required
                      rules={[
                        {
                          required: true,
                          message: t(
                            'outgoing_doc_detail_page.form.document_type_required'
                          ) as string,
                        },
                      ]}>
                      <Select>{renderDocumentTypes()}</Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={11}>
                    <Form.Item
                      required
                      label={t('outgoing_doc_detail_page.form.release_number')}
                      name='outgoingNumber'>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Form.Item
                      label={t('outgoing_doc_detail_page.form.distribution_date')}
                      name='releaseDate'>
                      <DatePicker
                        format={DAY_MONTH_YEAR_FORMAT}
                        className='w-full'
                        disabled
                        placeholder='dd/mm/yyyy'
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={11}>
                    <Form.Item
                      label={t('outgoing_doc_detail_page.form.distribution_org')}
                      name='publishingDepartment'
                      required
                      rules={[
                        {
                          required: true,
                          message: t(
                            'outgoing_doc_detail_page.form.distribution_org_required'
                          ) as string,
                        },
                      ]}>
                      <Select>{renderDepartments()}</Select>
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Form.Item
                      required
                      rules={[
                        {
                          required: true,
                          message: t(
                            'outgoing_doc_detail_page.form.original_symbol_number_required'
                          ) as string,
                        },
                      ]}
                      label={
                        <>
                          <div className='mr-2'>
                            {t('outgoing_doc_detail_page.form.original_symbol_number')}
                          </div>
                          <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/thoi-su-phap-luat/tu-van-phap-luat/30698/cach-ghi-so-hieu-van-ban-hanh-chinh-dung-chuan-phap-luat'>
                            <QuestionCircleOutlined
                              style={{ color: PRIMARY_COLOR }}
                              className='help-icon'
                            />
                          </a>
                        </>
                      }
                      name='originalSymbolNumber'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={11}>
                    <Form.Item
                      label={t('outgoing_doc_detail_page.form.urgency')}
                      name='urgency'
                      required
                      rules={[
                        {
                          required: true,
                          message: t('outgoing_doc_detail_page.form.urgency_required') as string,
                        },
                      ]}>
                      <Select>
                        <Select.Option value={Urgency.HIGH}>Cao</Select.Option>
                        <Select.Option value={Urgency.MEDIUM}>Trung bình</Select.Option>
                        <Select.Option value={Urgency.LOW}>Thấp</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Form.Item
                      label={t('outgoing_doc_detail_page.form.confidentiality')}
                      name='confidentiality'
                      required
                      rules={[
                        {
                          required: true,
                          message: t(
                            'outgoing_doc_detail_page.form.confidentiality_required'
                          ) as string,
                        },
                      ]}>
                      <Select>
                        <Select.Option value={Confidentiality.HIGH}>Cao</Select.Option>
                        <Select.Option value={Confidentiality.MEDIUM}>Trung bình</Select.Option>
                        <Select.Option value={Confidentiality.LOW}>Thấp</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={11}>
                    <Form.Item
                      required
                      rules={[
                        {
                          required: true,
                          message: t(
                            'outgoing_doc_detail_page.form.receive_org_required'
                          ) as string,
                        },
                      ]}
                      label={t('outgoing_doc_detail_page.form.receive_org')}
                      name='recipient'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Form.Item label={t('outgoing_doc_detail_page.form.signer')} name='signer'>
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label={t('outgoing_doc_detail_page.form.summary')} name='summary'>
                  <CKEditor
                    disabled={!isEditing}
                    editor={ClassicEditor}
                    data={form.getFieldValue('summary')}
                    onChange={(event, editor) => {
                      form.setFieldValue('summary', editor.getData());
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={7}>
                <Form.Item label={t('outgoing_doc_detail_page.form.files')} name='files'>
                  <Dragger {...fileProps}>
                    <p className='ant-upload-drag-icon'>
                      <InboxOutlined />
                    </p>
                    <p className='ant-upload-text'>
                      {t('outgoing_doc_detail_page.form.file_helper')}
                    </p>
                  </Dragger>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Row className='w-full justify-end '>
            {isEditing ? (
              <React.Fragment>
                <Button
                  type='default'
                  size='large'
                  htmlType='button'
                  className='mr-5'
                  onClick={onCancel}>
                  {t('outgoing_doc_detail_page.button.cancel')}
                </Button>
                <Button
                  type='primary'
                  size='large'
                  htmlType='button'
                  className='mr-5'
                  onClick={() => {
                    form.submit();
                  }}>
                  {t('outgoing_doc_detail_page.button.save')}
                </Button>
              </React.Fragment>
            ) : (
              <Button
                type='primary'
                size='large'
                htmlType='button'
                className='mr-5'
                onClick={() => {
                  setIsEditing(true);
                }}>
                {t('outgoing_doc_detail_page.button.edit')}
              </Button>
            )}

            <Button type='primary' size='large' htmlType='button' className='mr-5'>
              {t('outgoing_doc_detail_page.button.publish')}
            </Button>
            <Button type='primary' size='large' htmlType='button'>
              {t('outgoing_doc_detail_page.button.report')}
            </Button>
          </Row>
        </>
      )}
    </>
  );
}

export default OutgoingDocDetailPage;