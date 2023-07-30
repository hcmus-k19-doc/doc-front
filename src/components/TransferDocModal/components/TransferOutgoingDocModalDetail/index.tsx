import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpOutlined, SwapOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Col, Divider, Menu, Modal, Row, Spin, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import { PRIMARY_COLOR } from 'config/constant';
import format from 'date-fns/format';
import dayjs from 'dayjs';
import {
  DocSystemRoleEnum,
  ProcessingDocumentTypeEnum,
  ReturnRequestPostDto,
  ReturnRequestType,
  TransferDocumentMenuConfig,
  TransferDocumentModalSettingDto,
  UserDto,
} from 'models/doc-main-models';
import { transferDocDetailModalState } from 'pages/shared/IncomingDocListPage/core/states';
import { useRecoilState } from 'recoil';
import returnRequestService from 'services/ReturnRequestService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { useTransferSettingRes } from 'shared/hooks/TransferDocQuery';
import { DAY_MONTH_YEAR_FORMAT_2 } from 'utils/DateTimeUtils';
import { getStepOutgoingDocument } from 'utils/TransferDocUtils';

import DirectorScreenComponent from '../../components/DirectorScreenComponent';
import ExpertScreenComponent from '../../components/ExpertScreenComponent';
import ManagerScreenComponent from '../../components/ManagerScreenComponent';
import SecretaryScreenComponent from '../../components/SecretaryScreenComponent';
import {
  ComponentMap,
  getItem,
  MenuItem,
  MenuSelectProps,
  TransferModalDetailProps,
} from '../../core/models';

import './index.css';
const componentMap: ComponentMap = {
  1: DirectorScreenComponent,
  2: ManagerScreenComponent,
  3: SecretaryScreenComponent,
  4: ExpertScreenComponent,
};
const { Title } = Typography;
const TransferOutgoingDocModalDetail: React.FC<TransferModalDetailProps> = ({
  isModalOpen,
  handleClose,
  form,
  transferredDoc,
  transferDocumentDetail,
  type,
  loading,
}) => {
  const { settings } = useTransferSettingRes('OutgoingDocument');
  const [transferLabel, setTransferLabel] = useState<string>('');
  const [processingDuration, setProcessingDuration] = useState<string>('');
  const { t } = useTranslation();
  const [, setTransferDocModalItem] = useRecoilState(transferDocDetailModalState);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
  const [detailModalSetting, setDetailModalSetting] = useState<TransferDocumentModalSettingDto>();
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const showAlert = useSweetAlert();
  const [isReturnRequestModalOpen, setIsReturnRequestModalOpen] = useState<boolean>(false);
  const [returnRequestReason, setReturnRequestReason] = useState<string>('');
  const showReturnRequestModal = () => {
    setIsReturnRequestModalOpen(true);
  };

  const hideReturnRequestModal = () => {
    setIsReturnRequestModalOpen(false);
  };

  const onReturnRequestReasonChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReturnRequestReason(e.target.value);
  };

  const [transferDate, setTransferDate] = useState<string>('');
  useEffect(() => {
    if (settings && settings.menuConfigs) {
      const newSetting = {
        ...settings,
        menuConfigs:
          currentUser?.role === DocSystemRoleEnum.TRUONG_PHONG ||
          currentUser?.role === DocSystemRoleEnum.HIEU_TRUONG
            ? settings?.menuConfigs?.filter((item) => {
                if (transferredDoc?.isDocCollaborator) {
                  return item.isTransferToSameLevel === true;
                }
                return item.isTransferToSameLevel === false;
              }) || []
            : settings?.menuConfigs || [],
      };

      setDetailModalSetting(newSetting);
      setTransferLabel(newSetting.menuConfigs[0].transferDocumentTypeLabel);
      setTransferDocModalItem({
        transferDocumentType: newSetting.menuConfigs[0].transferDocumentType,
        isTransferToSameLevel: newSetting.menuConfigs[0].isTransferToSameLevel,
      });
      setDefaultSelectedKeys([newSetting.menuConfigs[0].menuKey.toString()]);
    }
  }, [settings, transferredDoc]);

  useEffect(() => {
    if (transferDocumentDetail) {
      const { baseInfo, assigneeId, collaboratorIds } = transferDocumentDetail;
      form.setFieldsValue({
        summary: baseInfo.summary,
        assignee: assigneeId,
        collaborators: collaboratorIds,
        processingTime: dayjs(baseInfo.processingDuration),
        isInfiniteProcessingTime: baseInfo.isInfiniteProcessingTime,
        processingMethod: baseInfo.processingMethod,
      });
      setTransferDate(format(new Date(baseInfo.transferDate), DAY_MONTH_YEAR_FORMAT_2));
      if (baseInfo.isInfiniteProcessingTime) {
        const value = t('transfer_modal.secretary_view.is_infinite_processing_time');
        setProcessingDuration(value);
      } else {
        setProcessingDuration(
          format(new Date(baseInfo.processingDuration), DAY_MONTH_YEAR_FORMAT_2)
        );
      }
    }
  }, [transferDocumentDetail]);

  const items = detailModalSetting?.menuConfigs?.reduce(
    (acc: MenuItem[], item: TransferDocumentMenuConfig) => {
      return [
        ...acc,
        getItem(
          item.menuLabel,
          item.menuKey,
          item.isTransferToSameLevel ? (
            <SwapOutlined className={'transfer-icon'} />
          ) : (
            <ArrowUpOutlined className={'transfer-icon'} />
          )
        ),
      ];
    },
    []
  );

  const handleMenuOnSelect = ({ selectedKeys }: MenuSelectProps) => {
    detailModalSetting?.menuConfigs?.forEach((item) => {
      if (item.menuKey === parseInt(selectedKeys[0])) {
        setTransferDocModalItem({
          transferDocumentType: item.transferDocumentType,
          isTransferToSameLevel: item.isTransferToSameLevel,
        });
        setTransferLabel(item.transferDocumentTypeLabel);
      }
    });
  };

  const handleSwitchScreen = () => {
    const menuConfig = detailModalSetting?.menuConfigs.find(
      (item) => item.transferDocumentTypeLabel === transferLabel
    );

    if (menuConfig) {
      const Component = componentMap[menuConfig.componentKey];
      return (
        <Component
          form={form}
          selectedDocs={[transferredDoc]}
          isTransferToSameLevel={menuConfig.isTransferToSameLevel}
          isDocCollaborator={transferredDoc?.isDocCollaborator}
          isReadOnlyMode={true}
          transferDate={transferDate}
          senderName={transferDocumentDetail?.senderName}
          processingDuration={processingDuration}
          type={type}
        />
      );
    }

    return (
      <DirectorScreenComponent
        form={form}
        selectedDocs={[transferredDoc]}
        isTransferToSameLevel={false}
        isDocCollaborator={transferredDoc?.isDocCollaborator}
        isReadOnlyMode={true}
        transferDate={transferDate}
        senderName={transferDocumentDetail?.senderName}
        type={type}
        processingDuration={processingDuration}
      />
    );
  };

  const handleReturnRequest = async () => {
    const returnRequestPostDto: ReturnRequestPostDto = {
      currentProcessingUserId: transferDocumentDetail?.assigneeId || -1,
      previousProcessingUserId: currentUser?.id || -1,
      documentIds: [transferDocumentDetail?.baseInfo?.documentId || -1],
      documentType: ProcessingDocumentTypeEnum.OUTGOING_DOCUMENT,
      reason: returnRequestReason,
      step: getStepOutgoingDocument(currentUser as UserDto, true),
      returnRequestType: ReturnRequestType.WITHDRAW,
    };
    setIsLoading(true);
    try {
      const response = await returnRequestService.createReturnRequest(returnRequestPostDto);
      console.log('returnRequestPostDto', returnRequestPostDto, response);

      showAlert({
        icon: 'success',
        html: t('withdraw.success'),
        showConfirmButton: true,
      });
      setReturnRequestReason('');
      hideReturnRequestModal();
      handleClose();
      queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_LIST']);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showAlert({
          icon: 'warning',
          html: t(error.response?.data.message || 'withdraw.error'),
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
        });
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderButtons = () => {
    const buttons = [];
    // doi voi outgoing document => van thu khong duoc rut lai van ban
    // neu cap tren chua xu ly => co the rut lai
    if (
      currentUser?.role !== DocSystemRoleEnum.VAN_THU &&
      transferredDoc?.isDocTransferredByNextUserInFlow === false &&
      !transferredDoc?.isDocCollaborator
    ) {
      buttons.push(
        <Button
          key='widthdraw'
          type='primary'
          onClick={showReturnRequestModal}
          className='danger-button'
          loading={isLoading}>
          {t('transfer_modal.button.withdraw')}
        </Button>
      );
    }
    // doi voi outgoing document => chuyen vien khong duoc tra lai van ban
    // neu ban chua xu ly => co the tra lai
    if (
      currentUser?.role !== DocSystemRoleEnum.CHUYEN_VIEN &&
      transferredDoc?.isDocTransferred === false &&
      !transferredDoc?.isDocCollaborator
    ) {
      buttons.push(
        <Button
          key='send_back'
          type='primary'
          onClick={handleClose}
          className='danger-button'
          loading={isLoading}>
          {t('transfer_modal.button.send_back')}
        </Button>
      );
    }
    buttons.push(
      <Button key='ok' type='primary' onClick={handleClose} loading={isLoading}>
        OK
      </Button>
    );
    return buttons;
  };

  return (
    <>
      <Modal
        title={`${transferLabel}`}
        open={isModalOpen}
        onCancel={handleClose}
        footer={renderButtons()}
        width={1000}>
        <Divider />
        <Row className='mt-5'>
          <Col span='5'>
            <Menu
              className='h-full'
              onSelect={handleMenuOnSelect}
              defaultSelectedKeys={defaultSelectedKeys}
              mode='inline'
              theme='light'
              items={items}
            />
          </Col>
          <Col span='1'></Col>
          <Col span='18'>
            {loading ? ( // Render loading indicator when isLoading is true
              <Spin className={'spin'} />
            ) : (
              handleSwitchScreen() // Render your content when isLoading is false
            )}
          </Col>
        </Row>
      </Modal>
      <Modal
        title=''
        centered
        open={isReturnRequestModalOpen}
        onOk={handleReturnRequest}
        okText={t('transfer_modal.button.ok')}
        cancelText={t('transfer_modal.button.cancel')}
        onCancel={hideReturnRequestModal}
        bodyStyle={{ marginBottom: 30 }}
        cancelButtonProps={{ loading: isLoading }}
        confirmLoading={isLoading}>
        <Title level={5}>{t('withdraw.input_reason')}</Title>
        <TextArea
          showCount
          maxLength={100}
          style={{ height: '80px !important', resize: 'none' }}
          onChange={onReturnRequestReasonChange}
          value={returnRequestReason}
          allowClear
        />
      </Modal>
    </>
  );
};

export default TransferOutgoingDocModalDetail;
