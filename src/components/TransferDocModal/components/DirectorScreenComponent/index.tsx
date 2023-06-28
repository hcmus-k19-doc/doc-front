import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Col, DatePicker, Form, Row, Select, Space, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { RangePickerProps } from 'antd/es/date-picker';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from 'components/AuthComponent';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IncomingDocumentDto, OutgoingDocumentGetDto } from 'models/doc-main-models';
import { useDirectorTransferRes } from 'shared/hooks/DirectorTransferQuery';
import { useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';

import {
  i18_collaborators,
  i18n_assignee,
  i18n_document,
  i18n_document_number,
  i18n_implementation_date,
  i18n_is_infinite_processing_time,
  i18n_ordinal_number,
  i18n_processing_time,
  i18n_sender,
  i18n_summary,
  TransferDocScreenFormProps,
  TransferDocScreenProps,
} from '../../core/models';

import './index.css';

dayjs.extend(customParseFormat);
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const { Text } = Typography;

const DirectorScreenComponent: React.FC<TransferDocScreenProps> = ({
  form,
  selectedDocs,
  isTransferToSameLevel,
  isDocCollaborator,
  isReadOnlyMode,
  transferDate,
  senderName,
  processingDuration,
}) => {
  const { t } = useTranslation();
  const { directors } = useDirectorTransferRes();

  const { currentUser } = useAuth();
  const [selectedAssignee, setSelectedAssignee] = useState();

  if (!isDocCollaborator) {
    directors?.map((director) => {
      if (director.value === currentUser?.id) {
        directors?.splice(directors.indexOf(director), 1);
      }
    });
  }

  useEffect(() => {
    const assigneeValue = form.getFieldValue('assignee');
    // if assignee is undefined => reset this state
    if (!assigneeValue) {
      setSelectedAssignee(undefined);
    }
  }, [form.getFieldValue('assignee')]);

  const setDirectorTransferQuery = useTransferQuerySetter();
  const [isInfiniteProcessingTime, setIsInfiniteProcessingTime] = React.useState(false);

  const onChooseNoneProcessingTime = (e: CheckboxChangeEvent) => {
    e.target.checked ? setIsInfiniteProcessingTime(true) : setIsInfiniteProcessingTime(false);
  };

  const setProcessingTime = (dateString: any) => {
    form.setFieldsValue({ processingTime: dateString });
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().endOf('day');
  };

  const handleOnFieldsChange = (changedFields: any[], allFields: any[]) => {
    if (changedFields?.[0]?.name?.[0] === 'assignee') {
      const newAssigneeValue = changedFields?.[0]?.value;
      const collaboratorsField = allFields.find((field) => field?.name[0] === 'collaborators');
      setSelectedAssignee(newAssigneeValue);

      // remove the assignee value inside collaborators if exist
      const filteredCollaborators = collaboratorsField.value?.filter(
        (collaborator: any) => collaborator !== newAssigneeValue
      );

      form.setFieldsValue({ collaborators: filteredCollaborators });
    }
  };

  return (
    <Form
      form={form}
      onFinish={(values: TransferDocScreenFormProps) => {
        setDirectorTransferQuery({
          summary: values.summary,
          assigneeId: values.assignee,
          collaboratorIds: values.collaborators,
          processingTime: values.processingTime,
          isInfiniteProcessingTime: values.isInfiniteProcessingTime,
        });
      }}
      onFieldsChange={handleOnFieldsChange}
      disabled={isReadOnlyMode}>
      <Row>
        <Col span='6'>
          <Text strong>{t(i18n_sender)}</Text>
        </Col>
        <Col span='6'>{isDocCollaborator ? senderName : currentUser?.fullName}</Col>
      </Row>
      <Row className='my-6' style={{ marginBottom: '0.5rem' }}>
        <Col span='6'>
          <Text strong>{t(i18n_implementation_date)}</Text>
        </Col>
        <Col span='6'>{transferDate}</Col>
      </Row>
      <div className='document-info'>
        {selectedDocs
          .sort(
            (
              a: IncomingDocumentDto | OutgoingDocumentGetDto,
              b: IncomingDocumentDto | OutgoingDocumentGetDto
            ) => a.id - b.id
          )
          .map((item: IncomingDocumentDto | OutgoingDocumentGetDto) => {
            return (
              <React.Fragment key={item.id}>
                <Row className='mt-3 mb-3'>
                  <Col span='6'>
                    <Text strong>{t(i18n_ordinal_number)}</Text>
                  </Col>
                  <Col span='18'>{t(i18n_document_number, { id: item.ordinalNumber })}</Col>
                </Row>
                <Row className='mt-3 mb-3'>
                  <Col span='6'>
                    <Text strong>{t(i18n_document)}</Text>
                  </Col>
                  <Col span='18'>{item.name}</Col>
                </Row>
                <Row className='mt-4 mb-4'>
                  <Col span='6'>
                    <Text strong>{t(i18n_summary)}</Text>
                  </Col>
                  <Col span='16'>
                    <div dangerouslySetInnerHTML={{ __html: item.summary }}></div>
                  </Col>
                </Row>
              </React.Fragment>
            );
          })}
      </div>
      <Row className='mb-3' style={{ marginTop: '1rem' }}>
        <Col span='6'>
          <Typography.Text strong>
            <span className='asterisk'>*</span>
            {t(i18n_assignee)}
          </Typography.Text>
        </Col>
        <Col span='16'>
          <Form.Item name='assignee'>
            <Select style={{ width: '100%' }} allowClear options={directors} />
          </Form.Item>
        </Col>
      </Row>
      {(!isTransferToSameLevel || isDocCollaborator) && (
        <>
          <Row className='mt-3 mb-3'>
            <Col span='6'>
              <Typography.Text strong>
                <span className='asterisk'>*</span>
                {t(i18_collaborators)}
              </Typography.Text>
            </Col>
            <Col span='16'>
              <Form.Item name='collaborators'>
                <Select
                  disabled={!selectedAssignee}
                  mode='multiple'
                  allowClear
                  options={directors?.filter((director) => director.value !== selectedAssignee)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col span='6'>
              <Typography.Text strong>
                <span className='asterisk'>*</span>
                {t(i18n_processing_time)}
              </Typography.Text>
            </Col>
            <Form.Item name='processingTime'>
              <Space direction='vertical' size={12}>
                {isReadOnlyMode ? (
                  <Text>{processingDuration}</Text>
                ) : (
                  <DatePicker
                    format={dateFormatList}
                    onChange={(_, dateString) => setProcessingTime(dateString)}
                    disabled={isInfiniteProcessingTime || isReadOnlyMode}
                    disabledDate={disabledDate}
                    // defaultValue={isReadOnlyMode ? dayjs(processingDuration) : undefined}
                  />
                )}
              </Space>
            </Form.Item>
            {!isReadOnlyMode && (
              <Form.Item
                name='isInfiniteProcessingTime'
                style={{ display: 'inline-block', margin: '0 16px' }}
                valuePropName='checked'
                initialValue={false}>
                <Checkbox onChange={onChooseNoneProcessingTime} value={isInfiniteProcessingTime}>
                  {t(i18n_is_infinite_processing_time)}
                </Checkbox>
              </Form.Item>
            )}
          </Row>
        </>
      )}
    </Form>
  );
};

export default DirectorScreenComponent;
