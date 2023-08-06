import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  TimePicker,
  Upload,
  UploadProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { RcFile, UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import axios from 'axios';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import {
  Confidentiality,
  DistributionOrganizationDto,
  DocumentTypeDto,
  FolderDto,
  IncomingDocumentPostDto,
  Urgency,
} from 'models/doc-main-models';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import DateValidator from 'shared/validators/DateValidator';
import DocFormValidators from 'shared/validators/DocFormValidators';
import { DAY_MONTH_YEAR_FORMAT, HH_MM_SS_FORMAT } from 'utils/DateTimeUtils';
import { constructIncomingNumber } from 'utils/IncomingNumberUtils';

import './index.css';

function ReceiveIncomingDocPage() {
  const navigate = useNavigate();
  const [form] = useForm();
  const showAlert = useSweetAlert();
  const [loading, setLoading] = useState<boolean>(false);

  const [foldersQuery, documentTypesQuery, distributionOrgsQuery] = useDropDownFieldsQuery();

  const renderFolders = () => {
    return foldersQuery.data?.map((folder: FolderDto) => (
      <Select.Option key={folder.id} value={folder.id}>
        {folder.folderName}
      </Select.Option>
    ));
  };

  const renderDistributionOrg = () => {
    return distributionOrgsQuery.data?.map((org: DistributionOrganizationDto) => (
      <Select.Option key={org.id} value={org.id}>
        {org.name}
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

  const handleFolderChange = (value: any) => {
    const folder: FolderDto =
      foldersQuery.data?.find((folder: FolderDto) => folder.id === value) ?? ({} as FolderDto);
    form.setFieldValue('incomingNumber', constructIncomingNumber(folder));
  };

  useEffect(() => {
    form.setFieldsValue({
      folder: foldersQuery.data?.[0].id,
      incomingNumber: constructIncomingNumber(foldersQuery.data?.[0] || ({} as FolderDto)),
      documentType: documentTypesQuery.data?.[0].id,
      distributionOrg: distributionOrgsQuery.data?.[0].id,
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
          t('receiveIncomingDocPage.message.file_duplicate_error')
        );
      }

      // Check file max count
      if (form.getFieldValue('files')?.fileList?.length >= 3) {
        DocFormValidators.addFilesFieldError(
          form,
          t('receiveIncomingDocPage.message.file_max_count_error')
        );
      }

      // Check file type
      const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
      if (!isValidType) {
        DocFormValidators.addFilesFieldError(
          form,
          t('receiveIncomingDocPage.message.file_type_error')
        );
      }

      // Check file size (max 10MB)
      const isValidSize = file.size < MAX_FILE_SIZE;
      if (!isValidSize) {
        DocFormValidators.addFilesFieldError(
          form,
          t('receiveIncomingDocPage.message.file_size_error')
        );
      }

      return (isValidType && isValidSize && !isDuplicate) || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} ${t('receiveIncomingDocPage.message.file_success')}`);
      } else if (status === 'error') {
        DocFormValidators.addFilesFieldError(
          form,
          t(`${info.file.name} ${t('receiveIncomingDocPage.message.file_error')}`)
        );
      }
    },
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (values.files.fileList.length === 0) {
        DocFormValidators.addFilesFieldError(form, t('receiveIncomingDocPage.form.filesRequired'));
        return;
      }

      const incomingDocument = new FormData();
      values.files.fileList.forEach((file: any) => {
        incomingDocument.append('attachments', file.originFileObj);
      });

      delete values.files;

      const incomingDocumentPostDto: IncomingDocumentPostDto = {
        ...values,
        distributionDate: new Date(values.distributionDate),
        arrivingDate: new Date(values.arrivingDate),
        arrivingTime: values.arrivingTime?.format(HH_MM_SS_FORMAT),
      };

      incomingDocument.append('incomingDocumentPostDto', JSON.stringify(incomingDocumentPostDto));
      const response = await incomingDocumentService.createIncomingDocument(incomingDocument);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: `${t('receiveIncomingDocPage.message.success')}`,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate('/main/docin');
        });
      }
    } catch (error) {
      // Only in this case, deal to the UX, just show a popup instead of navigating to error page
      const errorMessage =
        axios.isAxiosError(error) && error.response?.status === 400
          ? error.response.data.message
          : 'receiveIncomingDocPage.message.error';

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
    navigate('/main/docin');
  };

  return (
    <div>
      <div className='text-lg text-primary'>{t('receiveIncomingDocPage.title')}</div>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.docFolder')}
                  name='folder'
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('receiveIncomingDocPage.form.docFolderRequired')}`,
                    },
                  ]}>
                  <Select onChange={(value: number) => handleFolderChange(value)}>
                    {renderFolders()}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.documentType')}
                  name='documentType'
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('receiveIncomingDocPage.form.documentTypeRequired')}`,
                    },
                  ]}>
                  <Select>{renderDocumentTypes()}</Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.incomingNumber')}
                  name='incomingNumber'
                  rules={[
                    DocFormValidators.NoneBlankValidator(
                      t('receiveIncomingDocPage.form.incomingNumberRequired')
                    ),
                  ]}
                  required>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={
                    <>
                      <div className='mr-2'>
                        {t('receiveIncomingDocPage.form.originalSymbolNumber')}
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
                  required
                  name='originalSymbolNumber'
                  rules={[
                    DocFormValidators.NoneBlankValidator(
                      t('receiveIncomingDocPage.form.originalSymbolNumberRequired')
                    ),
                  ]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.distributionOrg')}
                  name='distributionOrg'
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('receiveIncomingDocPage.form.distributionOrgRequired')}`,
                    },
                  ]}>
                  <Select>{renderDistributionOrg()}</Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.distributionDate')}
                  name='distributionDate'
                  required
                  rules={[
                    DocFormValidators.FutureOrPresentDateValidator(
                      `${t('receiveIncomingDocPage.form.distributionDateGreaterThanNowError')}`
                    ),
                    {
                      message: `${t('receiveIncomingDocPage.form.distributionDateInvalid')}`,
                      validator: (_, value) => {
                        const arrivingDate = form.getFieldValue('arrivingDate');
                        return DateValidator.validateBeforeAfter(value, arrivingDate);
                      },
                    },
                    {
                      required: true,
                      message: `${t('receiveIncomingDocPage.form.distributionDateRequired')}`,
                    },
                  ]}>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.arrivingDate')}
                  name='arrivingDate'
                  required
                  rules={[
                    DocFormValidators.FutureOrPresentDateValidator(
                      `${t('receiveIncomingDocPage.form.arrivingDateGreaterThanNowError')}`
                    ),
                    {
                      message: `${t('receiveIncomingDocPage.form.arrivingDateInvalid')}`,
                      validator: (_, value) => {
                        const distributionDate = form.getFieldValue('distributionDate');
                        return DateValidator.validateBeforeAfter(distributionDate, value);
                      },
                    },
                    {
                      required: true,
                      message: `${t('receiveIncomingDocPage.form.arrivingDateRequired')}`,
                    },
                  ]}>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' />
                </Form.Item>
              </Col>

              <Col span={2}></Col>

              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.arrivingTime')}
                  name='arrivingTime'
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('receiveIncomingDocPage.form.arrivingTimeRequired')}`,
                    },
                  ]}>
                  <TimePicker className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.urgency')}
                  name='urgency'
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('receiveIncomingDocPage.form.urgencyRequired')}`,
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
                  label={t('receiveIncomingDocPage.form.confidentiality')}
                  name='confidentiality'
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('receiveIncomingDocPage.form.confidentialityRequired')}`,
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
                  label={t('incomingDocDetailPage.form.name')}
                  required
                  name='name'
                  rules={[
                    DocFormValidators.NoneBlankValidator(
                      t('incomingDocDetailPage.form.name_required')
                    ),
                  ]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t('receiveIncomingDocPage.form.summary')} name='summary' required>
              <CKEditor
                editor={ClassicEditor}
                data={form.getFieldValue('summary') || ''}
                onChange={(event, editor) => {
                  form.setFieldValue('summary', editor.getData());
                }}
              />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={7}>
            <Form.Item
              label={t('receiveIncomingDocPage.form.files')}
              name='files'
              required
              rules={[
                {
                  required: true,
                  message: `${t('receiveIncomingDocPage.form.filesRequired')}`,
                },
              ]}>
              <Dragger {...fileProps}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>{t('receiveIncomingDocPage.form.fileHelper')}</p>
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
              {t('receiveIncomingDocPage.form.button.save')}
            </Button>
            <Button
              type='default'
              size='large'
              className='mr-5'
              onClick={() => {
                onCancel();
              }}
              disabled={loading}>
              {t('receiveIncomingDocPage.form.button.cancel')}
            </Button>
          </Row>
        </Row>
      </Form>
    </div>
  );
}

export default ReceiveIncomingDocPage;
