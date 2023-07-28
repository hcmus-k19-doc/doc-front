import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Menu, Modal, Row, Spin } from 'antd';
import { useAuth } from 'components/AuthComponent';
import format from 'date-fns/format';
import dayjs from 'dayjs';
import {
  DocSystemRoleEnum,
  TransferDocumentMenuConfig,
  TransferDocumentModalSettingDto,
} from 'models/doc-main-models';
import { transferDocDetailModalState } from 'pages/shared/IncomingDocListPage/core/states';
import { useRecoilState } from 'recoil';
import { useTransferSettingRes } from 'shared/hooks/TransferDocQuery';
import { DAY_MONTH_YEAR_FORMAT_2 } from 'utils/DateTimeUtils';

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

const TransferDocModalDetail: React.FC<TransferModalDetailProps> = ({
  isModalOpen,
  handleClose,
  form,
  transferredDoc,
  transferDocumentDetail,
  type,
  loading,
}) => {
  const { settings } = useTransferSettingRes('IncomingDocument');
  const [transferLabel, setTransferLabel] = useState<string>('');
  const [processingDuration, setProcessingDuration] = useState<string>('');
  const { t } = useTranslation();

  const [, setTransferDocModalItem] = useRecoilState(transferDocDetailModalState);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
  const [detailModalSetting, setDetailModalSetting] = useState<TransferDocumentModalSettingDto>();
  const { currentUser } = useAuth();

  const [transferDate, setTransferDate] = useState<string>('');
  useEffect(() => {
    if (settings && settings.menuConfigs) {
      const newSetting = {
        ...settings,
        menuConfigs:
          currentUser?.role !== DocSystemRoleEnum.CHUYEN_VIEN
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
          type={type}
          processingDuration={processingDuration}
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
        processingDuration={processingDuration}
        type={type}
      />
    );
  };

  const renderButtons = () => {
    const buttons = [];
    // doi voi incoming document => chuyen vien khong duoc rut lai van ban
    if (currentUser?.role !== DocSystemRoleEnum.CHUYEN_VIEN) {
      buttons.push(
        <Button key='ok' type='primary' onClick={handleClose} danger>
          {t('transfer_modal.button.withdraw')}
        </Button>
      );
    }
    buttons.push(
      <Button key='ok' type='primary' onClick={handleClose}>
        OK
      </Button>
    );
    return buttons;
  };

  return (
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
  );
};

export default TransferDocModalDetail;
