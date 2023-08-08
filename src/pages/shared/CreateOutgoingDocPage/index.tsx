import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Col, Form, Input, message, Row, Select, Upload, UploadProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { RcFile, UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import axios from 'axios';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
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
import DocFormValidators from 'shared/validators/DocFormValidators';

import DocCKEditor from '../../../components/DocCKEditor';

import './index.css';

function CreateOutgoingDocPage() {
  const navigate = useNavigate();
  const [form] = useForm();
  const showAlert = useSweetAlert();
  const [loading, setLoading] = useState<boolean>(false);

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
      folder: foldersQuery.data?.[0].id, //Folder van ban di
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
        DocFormValidators.addFilesFieldError(
          form,
          t('create_outgoing_doc_page.message.file_duplicate_error')
        );
      }

      // Check file max count
      if (form.getFieldValue('files')?.fileList?.length >= 3) {
        DocFormValidators.addFilesFieldError(
          form,
          t('create_outgoing_doc_page.message.file_max_count_error')
        );
      }

      // Check file type
      const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
      if (!isValidType) {
        DocFormValidators.addFilesFieldError(
          form,
          t('create_outgoing_doc_page.message.file_type_error')
        );
      }

      // Check file size (max 10MB)
      const isValidSize = file.size < MAX_FILE_SIZE;
      if (!isValidSize) {
        DocFormValidators.addFilesFieldError(
          form,
          t('create_outgoing_doc_page.message.file_size_error')
        );
      }

      return (isValidType && isValidSize && !isDuplicate) || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} ${t('create_outgoing_doc_page.message.file_success')}`);
      } else if (status === 'error') {
        DocFormValidators.addFilesFieldError(
          form,
          `${info.file.name} ${t('create_outgoing_doc_page.message.file_error')}`
        );
      }
    },
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const outgoingDocument = new FormData();
      if (values.files !== undefined) {
        values.files.fileList.forEach((file: any) => {
          outgoingDocument.append('attachments', file.originFileObj);
        });

        delete values.files;
      }

      const outgoingDocumentPostDto: OutgoingDocumentPostDto = {
        ...values,
      };

      outgoingDocument.append('outgoingDocumentPostDto', JSON.stringify(outgoingDocumentPostDto));
      const response = await outgoingDocumentService.createOutgoingDocument(outgoingDocument);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: t('create_outgoing_doc_page.message.success'),
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate('/main/docout/out-list');
        });
      }
    } catch (error) {
      // Only in this case, deal to the UX, just show a popup instead of navigating to error page
      const errorMessage =
        axios.isAxiosError(error) && error.response?.status === 400
          ? error.response.data.message
          : t('create_outgoing_doc_page.message.error');
      showAlert({
        icon: 'error',
        html: t(errorMessage),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/main/docout/out-list');
  };

  return (
    <>
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
                      message: t('create_outgoing_doc_page.form.document_type_required').toString(),
                    },
                  ]}>
                  <Select>{renderDocumentTypes()}</Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('create_outgoing_doc_page.form.distribution_org')}
                  name='publishingDepartment'
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('create_outgoing_doc_page.form.distribution_org_required')}`,
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
                    DocFormValidators.NoneBlankValidator(
                      t('create_outgoing_doc_page.form.original_symbol_number_required')
                    ),
                  ]}
                  label={
                    <>
                      <div className='mr-2'>
                        {t('create_outgoing_doc_page.form.original_symbol_number')}
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
                  label={t('create_outgoing_doc_page.form.urgency')}
                  name='urgency'
                  required
                  rules={[
                    DocFormValidators.NoneBlankValidator(
                      t('create_outgoing_doc_page.form.urgency_required')
                    ),
                  ]}>
                  <Select>
                    <Select.Option value={Urgency.HIGH}>
                      {t(`outgoing_doc_detail_page.urgency.${Urgency.HIGH}`)}
                    </Select.Option>
                    <Select.Option value={Urgency.MEDIUM}>
                      {t(`outgoing_doc_detail_page.urgency.${Urgency.MEDIUM}`)}
                    </Select.Option>
                    <Select.Option value={Urgency.LOW}>
                      {t(`outgoing_doc_detail_page.urgency.${Urgency.LOW}`)}
                    </Select.Option>
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
                    DocFormValidators.NoneBlankValidator(
                      t('create_outgoing_doc_page.form.confidentiality_required')
                    ),
                  ]}>
                  <Select>
                    <Select.Option value={Confidentiality.HIGH}>
                      {t(`outgoing_doc_detail_page.confidentiality.${Confidentiality.HIGH}`)}
                    </Select.Option>
                    <Select.Option value={Confidentiality.MEDIUM}>
                      {t(`outgoing_doc_detail_page.confidentiality.${Confidentiality.MEDIUM}`)}
                    </Select.Option>
                    <Select.Option value={Confidentiality.LOW}>
                      {t(`outgoing_doc_detail_page.confidentiality.${Confidentiality.LOW}`)}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  required
                  rules={[
                    DocFormValidators.NoneBlankValidator(
                      t('create_outgoing_doc_page.form.receive_org_required')
                    ),
                  ]}
                  label={t('create_outgoing_doc_page.form.receive_org')}
                  name='recipient'>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  required
                  rules={[
                    DocFormValidators.NoneBlankValidator(
                      t('create_outgoing_doc_page.form.name_required')
                    ),
                  ]}
                  label={t('create_outgoing_doc_page.form.name')}
                  name='name'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t('create_outgoing_doc_page.form.summary')} name='summary' required>
              <DocCKEditor
                data={form.getFieldValue('summary') || ''}
                onChange={(_, editor) => {
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

          <Row className='my-3'>
            <Button
              type='primary'
              size='large'
              htmlType='submit'
              className='mr-5'
              loading={loading}>
              {t('create_outgoing_doc_page.button.save')}
            </Button>
            <Button
              type='default'
              size='large'
              className='mr-5'
              onClick={onCancel}
              disabled={loading}>
              {t('create_outgoing_doc_page.button.cancel')}
            </Button>
          </Row>
        </Row>
      </Form>
    </>
  );
}

export default CreateOutgoingDocPage;
