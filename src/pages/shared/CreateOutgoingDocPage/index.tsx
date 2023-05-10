import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
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
import { ALLOWED_FILE_TYPES, PRIMARY_COLOR } from 'config/constant';
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
import { DAY_MONTH_YEAR_FORMAT, HH_MM_SS_FORMAT } from 'utils/DateTimeUtils';
import { constructIncomingNumber } from 'utils/IncomingNumberUtils';

import './index.css';

function CreateOutgoingDocPage() {
  const { t } = useTranslation();
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [form] = useForm();
  const showAlert = useSweetAlert();

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
      foldersQuery.data?.find((folder: FolderDto) => folder.id === value) || ({} as FolderDto);
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
        message.error(t('receiveIncomingDocPage.form.message.fileDuplicateError') as string);
      }

      // Check file max count
      if (form.getFieldValue('files')?.fileList?.length >= 3) {
        message.error(t('receiveIncomingDocPage.form.message.fileMaxCountError') as string);
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
          html: t('receiveIncomingDocPage.message.success') as string,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate('/docin');
        });
      }
    } catch (error) {
      // Only in this case, deal to the UX, just show a popup instead of navigating to error page
      showAlert({
        icon: 'error',
        html: t('receiveIncomingDocPage.message.error') as string,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  };

  const onCancel = () => {
    navigate('/docin');
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
                      message: t('receiveIncomingDocPage.form.docFolderRequired') as string,
                    },
                  ]}>
                  <Select onChange={(value: number) => handleFolderChange(value)}>
                    {renderFolders()}{' '}
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
                      message: t('receiveIncomingDocPage.form.documentTypeRequired') as string,
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
                  label={t('receiveIncomingDocPage.form.incomingNumber')}
                  name='incomingNumber'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('receiveIncomingDocPage.form.originalSymbolNumber')}
                  required
                  name='originalSymbolNumber'
                  rules={[
                    {
                      required: true,
                      message: t(
                        'receiveIncomingDocPage.form.originalSymbolNumberRequired'
                      ) as string,
                    },
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
                      message: t('receiveIncomingDocPage.form.distributionOrgRequired') as string,
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
                    {
                      message: t(
                        'receiveIncomingDocPage.form.distributionDateGreaterThanNowError'
                      ) as string,
                      validator: (_, value) => {
                        const now = new Date();
                        return DateValidator.validateBeforeAfter(value, now);
                      },
                    },
                    {
                      message: t('receiveIncomingDocPage.form.distributionDateInvalid') as string,
                      validator: (_, value) => {
                        const arrivingDate = form.getFieldValue('arrivingDate');
                        return DateValidator.validateBeforeAfter(value, arrivingDate);
                      },
                    },
                    {
                      required: true,
                      message: t('receiveIncomingDocPage.form.distributionDateRequired') as string,
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
                    {
                      message: t(
                        'receiveIncomingDocPage.form.arrivingDateGreaterThanNowError'
                      ) as string,
                      validator: (_, value) => {
                        const now = new Date();
                        return DateValidator.validateBeforeAfter(value, now);
                      },
                    },
                    {
                      message: t('receiveIncomingDocPage.form.arrivingDateInvalid') as string,
                      validator: (_, value) => {
                        const distributionDate = form.getFieldValue('distributionDate');
                        return DateValidator.validateBeforeAfter(distributionDate, value);
                      },
                    },
                    {
                      required: true,
                      message: t('receiveIncomingDocPage.form.arrivingDateRequired') as string,
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
                      message: t('receiveIncomingDocPage.form.arrivingTimeRequired') as string,
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
                      message: t('receiveIncomingDocPage.form.urgencyRequired') as string,
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
                      message: t('receiveIncomingDocPage.form.confidentialityRequired') as string,
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

            <Form.Item
              label={t('receiveIncomingDocPage.form.summary')}
              name='summary'
              required
              rules={[
                {
                  required: true,
                  message: t('receiveIncomingDocPage.form.summaryRequired') as string,
                },
              ]}>
              <TextArea rows={2} />
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
                  message: t('receiveIncomingDocPage.form.filesRequired') as string,
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

          <Row className='w-full justify-end '>
            <Button type='primary' size='large' htmlType='submit' className='mr-5'>
              {t('receiveIncomingDocPage.form.button.save')}
            </Button>
            <Button
              type='default'
              size='large'
              className='mr-5'
              onClick={() => {
                onCancel();
              }}>
              {t('receiveIncomingDocPage.form.button.cancel')}
            </Button>
          </Row>
        </Row>
      </Form>
    </div>
  );
}

export default CreateOutgoingDocPage;
