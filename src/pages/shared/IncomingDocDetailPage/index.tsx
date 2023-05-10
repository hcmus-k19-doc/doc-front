import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import { Col, DatePicker, Form, Input, message, Row, Select, TimePicker, UploadProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Dragger from 'antd/es/upload/Dragger';
import DocButtonList from 'components/DocButtonList';
import DocComment from 'components/DocComment';
import { PRIMARY_COLOR } from 'config/constant';
import dayjs from 'dayjs';
import {
  Confidentiality,
  DistributionOrganizationDto,
  DocumentTypeDto,
  FolderDto,
  IncomingDocumentDto,
  IncomingDocumentPutDto,
  Urgency,
} from 'models/doc-main-models';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import { useIncomingDocumentDetailQuery } from 'shared/hooks/IncomingDocumentDetailQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import DateValidator from 'shared/validators/DateValidator';
import { DAY_MONTH_YEAR_FORMAT, HH_MM_SS_FORMAT } from 'utils/DateTimeUtils';
import { constructIncomingNumber } from 'utils/IncomingNumberUtils';

import './index.css';

function IncomingDocPage() {
  const { TextArea } = Input;
  const { docId } = useParams();
  const { t } = useTranslation();
  const [form] = useForm();
  const showAlert = useSweetAlert();

  const [isEditing, setIsEditing] = useState(false);

  /* 2^9 - 1 = 511 (9 cái nút)

  0 chỉnh sửa
  0 thu thập
  0 trình lãnh đạo
  0 chuyển xử lý
  0 phân công
  0 góp ý văn bản
  0 xác nhận đã xem
  0 trả lại
  0 yêu cầu gia hạn

  011100000 (theo chiều từ trên xún) --> 224 --> role = 224: chuyên viên chính

  Xem btn arr trong DocButtonList */

  const data = {
    role: 224,
  };

  const [foldersQuery, documentTypesQuery, distributionOrgsQuery] = useDropDownFieldsQuery();
  const incomingDocumentQuery = useIncomingDocumentDetailQuery(+(docId || 1));

  const enableEditing = () => {
    setIsEditing(true);
  };

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
    if (incomingDocumentQuery.data?.folder?.id === value) {
      form.setFieldValue('incomingNumber', incomingDocumentQuery.data?.incomingNumber);
      return;
    }

    const folder: FolderDto =
      foldersQuery.data?.find((folder: FolderDto) => folder.id === value) || ({} as FolderDto);

    form.setFieldValue('incomingNumber', constructIncomingNumber(folder));
  };

  const incomingDocument = incomingDocumentQuery.data || ({} as IncomingDocumentDto);

  if (incomingDocument) {
    form.setFieldsValue({
      folder: incomingDocument.folder?.id,
      incomingNumber: incomingDocument.incomingNumber,
      documentType: incomingDocument.documentType?.id,
      distributionOrg: incomingDocument.distributionOrg?.id,
      urgency: incomingDocument.urgency,
      confidentiality: incomingDocument.confidentiality,
      originalSymbolNumber: incomingDocument.originalSymbolNumber,
      distributionDate: dayjs(incomingDocument.distributionDate),
      arrivingDate: dayjs(incomingDocument.arrivingDate),
      arrivingTime: dayjs(incomingDocument.arrivingTime, HH_MM_SS_FORMAT),
      summary: incomingDocument.summary,
    });
  }

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
        message.success(`${info.file.name} ${t('incomingDocDetailPage.form.message.fileSuccess')}`);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('incomingDocDetailPage.form.message.fileError')}`);
      }
    },
  };

  const saveChange = async (values: any) => {
    try {
      delete values.files;

      const incomingDocument: IncomingDocumentPutDto = {
        ...values,
        id: +(docId || 0),
        distributionDate: new Date(values.distributionDate),
        arrivingDate: new Date(values.arrivingDate),
        arrivingTime: values.arrivingTime?.format(HH_MM_SS_FORMAT),
      };

      const response = await incomingDocumentService.updateIncomingDocument(incomingDocument);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: t('incomingDocDetailPage.message.success') as string,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      //Only in this case, deal to the UX, just show a popup instead of navigating to error page
      showAlert({
        icon: 'error',
        html: t('incomingDocDetailPage.message.error') as string,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  };

  const onFinishEditing = () => {
    form.submit();
  };

  return (
    <>
      <div className='text-lg text-primary'>{t('incomingDocDetailPage.title')}</div>
      <Form form={form} layout='vertical' onFinish={saveChange} disabled={!isEditing}>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.docFolder')}
                  name='folder'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.docFolderRequired') as string,
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
                  label={t('incomingDocDetailPage.form.documentType')}
                  name='documentType'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.documentTypeRequired') as string,
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
                  label={t('incomingDocDetailPage.form.incomingNumber')}
                  name='incomingNumber'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.originalSymbolNumber')}
                  required
                  name='originalSymbolNumber'
                  rules={[
                    {
                      required: true,
                      message: t(
                        'incomingDocDetailPage.form.originalSymbolNumberRequired'
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
                  label={t('incomingDocDetailPage.form.distributionOrg')}
                  name='distributionOrg'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.distributionOrgRequired') as string,
                    },
                  ]}>
                  <Select>{renderDistributionOrg()}</Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.distributionDate')}
                  name='distributionDate'
                  required
                  rules={[
                    {
                      message: t(
                        'incomingDocDetailPage.form.distributionDateGreaterThanNowError'
                      ) as string,
                      validator: (_, value) => {
                        const now = new Date();
                        return DateValidator.validateBeforeAfter(value, now);
                      },
                    },
                    {
                      message: t('incomingDocDetailPage.form.distributionDateInvalid') as string,
                      validator: (_, value) => {
                        const arrivingDate = form.getFieldValue('arrivingDate');
                        return DateValidator.validateBeforeAfter(value, arrivingDate);
                      },
                    },
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.distributionDateRequired') as string,
                    },
                  ]}>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.arrivingDate')}
                  name='arrivingDate'
                  required
                  rules={[
                    {
                      message: t(
                        'incomingDocDetailPage.form.arrivingDateGreaterThanNowError'
                      ) as string,
                      validator: (_, value) => {
                        const now = new Date();
                        return DateValidator.validateBeforeAfter(value, now);
                      },
                    },
                    {
                      message: t('incomingDocDetailPage.form.arrivingDateInvalid') as string,
                      validator: (_, value) => {
                        const distributionDate = form.getFieldValue('distributionDate');
                        return DateValidator.validateBeforeAfter(distributionDate, value);
                      },
                    },
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.arrivingDateRequired') as string,
                    },
                  ]}>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' />
                </Form.Item>
              </Col>

              <Col span={2}></Col>

              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.arrivingTime')}
                  name='arrivingTime'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.arrivingTimeRequired') as string,
                    },
                  ]}>
                  <TimePicker className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.urgency')}
                  name='urgency'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.urgencyRequired') as string,
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
                  label={t('incomingDocDetailPage.form.confidentiality')}
                  name='confidentiality'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.confidentialityRequired') as string,
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
              label={t('incomingDocDetailPage.form.summary')}
              name='summary'
              required
              rules={[
                {
                  required: true,
                  message: t('incomingDocDetailPage.form.summaryRequired') as string,
                },
              ]}>
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={7}>
            <Form.Item
              label={t('incomingDocDetailPage.form.files')}
              name='files'
              required
              rules={[
                {
                  required: true,
                  message: t('incomingDocDetailPage.form.filesRequired') as string,
                },
              ]}>
              <Dragger {...fileProps}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>{t('incomingDocDetailPage.form.fileHelper')}</p>
              </Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row className='w-full justify-end '>
        <DocButtonList
          roleNumber={data.role}
          enableEditing={enableEditing}
          isEditing={isEditing}
          onFinishEditing={onFinishEditing}
        />
      </Row>
      <div className='text-lg text-primary'>{t('incomingDocDetailPage.comment.title')}</div>
      <Row>
        <Col span={16}>
          <DocComment docId={Number(docId)} />
        </Col>
      </Row>
    </>
  );
}

export default IncomingDocPage;
