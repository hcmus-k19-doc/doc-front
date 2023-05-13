import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Select, Upload, UploadProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { RcFile, UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import { ALLOWED_FILE_TYPES, PRIMARY_COLOR } from 'config/constant';
import {
  Confidentiality,
  DepartmentDto,
  DocumentTypeDto,
  FolderDto,
  OutgoingDocumentPostDto,
  Urgency,
} from 'models/doc-main-models';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import './index.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function CreateOutgoingDocPage() {
  const { t } = useTranslation();
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [form] = useForm();
  const showAlert = useSweetAlert();

  const [foldersQuery, documentTypesQuery, distributionOrgsQuery, departmentsQuery] =
    useDropDownFieldsQuery();

  const renderFolders = () => {
    return foldersQuery.data?.map((folder: FolderDto) => (
      <Select.Option key={folder.id} value={folder.id}>
        {folder.folderName}
      </Select.Option>
    ));
  };

  const renderDepartment = () => {
    return departmentsQuery.data?.map((department: DepartmentDto) => (
      <Select.Option key={department.id} value={department.id}>
        {department.departmentName}
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

  useEffect(() => {
    form.setFieldsValue({
      folder: foldersQuery.data?.[2].id, //Folder van ban di
      documentType: documentTypesQuery.data?.[0].id,
      publishingDepartment: departmentsQuery.data?.[0].id,
      urgency: Urgency.HIGH,
      confidentiality: Confidentiality.HIGH,
    });
  });

  const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const fileProps: UploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 3,
    customRequest: dummyRequest,
    beforeUpload: (file: RcFile) => {
      // Check file duplicate
      const isDuplicate = form
        .getFieldValue('files')
        ?.fileList?.find((f: UploadFile) => f.name === file.name);
      if (isDuplicate) {
        message.error(t('create_outgoing_doc_page.form.message.file_duplicateError') as string);
      }

      // Check file max count
      if (form.getFieldValue('files')?.fileList?.length >= 3) {
        message.error(t('create_outgoing_doc_page.form.message.fileMaxCountError') as string);
      }

      // Check file type
      const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
      if (!isValidType) {
        message.error(t('processIncomingDocPage.form.message.fileTypeError') as string);
      }

      // Check file size (max 3MB)
      const isValidSize = file.size / 1024 / 1024 < 3;
      if (!isValidSize) {
        message.error(t('processIncomingDocPage.form.message.fileSizeError') as string);
      }

      return (isValidType && isValidSize && !isDuplicate) || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(
          `${info.file.name} ${t('processIncomingDocPage.form.message.fileSuccess')}`
        );
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('processIncomingDocPage.form.message.fileError')}`);
      }
    },
  };

  const onFinish = async (values: any) => {
    try {
      const outgoingDocument = new FormData();
      values.files.fileList.forEach((file: any) => {
        outgoingDocument.append('attachments', file.originFileObj);
      });

      delete values.files;

      const outgoingDocumentPostDto: OutgoingDocumentPostDto = {
        ...values,
      };

      outgoingDocument.append('outgoingDocumentPostDto', JSON.stringify(outgoingDocumentPostDto));
      const response = await outgoingDocumentService.createOutgoingDocument(outgoingDocument);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: t('create_outgoing_doc_page.message.create_success') as string,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate('/docout');
        });
      }
    } catch (error) {
      // Only in this case, deal to the UX, just show a popup instead of navigating to error page
      showAlert({
        icon: 'error',
        html: t('create_outgoing_doc_page.message.error') as string,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  };

  const onCancel = () => {
    navigate('/docout');
  };

  return (
    <div>
      <div className='text-lg text-primary'>{t('create_outgoing_doc_page.title')}</div>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('create_outgoing_doc_page.form.doc_folder')}
                  name='folder'
                  required>
                  <Select disabled>{renderFolders()}</Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('create_outgoing_doc_page.form.document_type')}
                  name='documentType'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('create_outgoing_doc_page.form.document_type_required') as string,
                    },
                  ]}>
                  <Select>{renderDocumentTypes()}</Select>
                </Form.Item>
              </Col>
            </Row>

            {/* <Row>
              <Col span={11}>
                <Form.Item
                  required
                  label={t('create_outgoing_doc_page.form.release_number')}
                  name='incomingNumber'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('create_outgoing_doc_page.form.distribution_date')}
                  name='distributionDate'>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' disabled />
                </Form.Item>
              </Col>
            </Row> */}

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('create_outgoing_doc_page.form.distribution_org')}
                  name='publishingDepartment'
                  required
                  rules={[
                    {
                      required: true,
                      message: t(
                        'create_outgoing_doc_page.form.distribution_org_required'
                      ) as string,
                    },
                  ]}>
                  <Select>{renderDepartment()}</Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  required
                  rules={[
                    {
                      required: true,
                      message: t('create_outgoing_doc_page.form.receive_org_required') as string,
                    },
                  ]}
                  label={t('create_outgoing_doc_page.form.receive_org')}
                  name='recipient'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('create_outgoing_doc_page.form.urgency')}
                  name='urgency'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('create_outgoing_doc_page.form.urgency_required') as string,
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
                  label={t('create_outgoing_doc_page.form.confidentiality')}
                  name='confidentiality'
                  required
                  rules={[
                    {
                      required: true,
                      message: t(
                        'create_outgoing_doc_page.form.confidentiality_required'
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

            <Form.Item label={t('create_outgoing_doc_page.form.summary')} name='summary'>
              <CKEditor
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
            <Form.Item label={t('create_outgoing_doc_page.form.files')} name='files'>
              <Dragger {...fileProps}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>{t('create_outgoing_doc_page.form.file_helper')}</p>
              </Dragger>
            </Form.Item>
          </Col>

          <Row className='w-full justify-end '>
            <Button type='primary' size='large' htmlType='submit' className='mr-5'>
              {t('create_outgoing_doc_page.button.save')}
            </Button>
            <Button
              type='default'
              size='large'
              className='mr-5'
              onClick={() => {
                onCancel();
              }}>
              {t('create_outgoing_doc_page.button.cancel')}
            </Button>
          </Row>
        </Row>
      </Form>
    </div>
  );
}

export default CreateOutgoingDocPage;
