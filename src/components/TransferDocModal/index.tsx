import React, { useEffect, useState } from 'react';
import { Col, Divider, Menu, Modal, Row } from 'antd';
import { format } from 'date-fns';
import { TransferDocumentMenuConfig } from 'models/doc-main-models';
import { transferDocModalState } from 'pages/shared/IncomingDocListPage/core/states';
import { useRecoilState } from 'recoil';
import { useTransferSettingRes } from 'shared/hooks/TransferDocQuery';
import { DAY_MONTH_YEAR_FORMAT_2 } from 'utils/DateTimeUtils';

import DirectorScreenComponent from './components/DirectorScreenComponent';
import ExpertScreenComponent from './components/ExpertScreenComponent';
import ManagerScreenComponent from './components/ManagerScreenComponent';
import SecretaryScreenComponent from './components/SecretaryScreenComponent';
import {
  ComponentMap,
  getItem,
  MenuItem,
  MenuSelectProps,
  TransferModalProps,
} from './core/models';

const componentMap: ComponentMap = {
  1: DirectorScreenComponent,
  2: ManagerScreenComponent,
  3: SecretaryScreenComponent,
  4: ExpertScreenComponent,
};

const TransferDocModal: React.FC<TransferModalProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  selectedDocs,
  type,
}) => {
  const { settings } = useTransferSettingRes(type);
  const [transferLabel, setTransferLabel] = useState<string>('');
  const [, setTransferDocModalItem] = useRecoilState(transferDocModalState);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);

  const transferDate = format(new Date(), DAY_MONTH_YEAR_FORMAT_2);
  useEffect(() => {
    if (settings && settings.menuConfigs) {
      setTransferLabel(settings.menuConfigs[0].transferDocumentTypeLabel);
      setTransferDocModalItem({
        transferDocumentType: settings.menuConfigs[0].transferDocumentType,
        isTransferToSameLevel: settings.menuConfigs[0].isTransferToSameLevel,
      });
      setDefaultSelectedKeys([settings.menuConfigs[0].menuKey.toString()]);
    }
  }, [settings]);

  const items = settings?.menuConfigs?.reduce(
    (acc: MenuItem[], item: TransferDocumentMenuConfig) => {
      return [...acc, getItem(item.menuLabel, item.menuKey)];
    },
    []
  );

  const handleMenuOnSelect = ({ selectedKeys }: MenuSelectProps) => {
    settings?.menuConfigs?.forEach((item) => {
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
    const menuConfig = settings?.menuConfigs.find(
      (item) => item.transferDocumentTypeLabel === transferLabel
    );

    if (menuConfig) {
      const Component = componentMap[menuConfig.componentKey];
      return (
        <Component
          form={form}
          selectedDocs={selectedDocs}
          isTransferToSameLevel={menuConfig.isTransferToSameLevel}
          isDocCollaborator={false}
          isReadOnlyMode={false}
          transferDate={transferDate}
          senderName={''}
          type={type}
        />
      );
    }

    return (
      <DirectorScreenComponent
        form={form}
        selectedDocs={selectedDocs}
        isTransferToSameLevel={false}
        isDocCollaborator={false}
        isReadOnlyMode={false}
        transferDate={transferDate}
        senderName={''}
        type={type}
      />
    );
  };

  return (
    <Modal
      title={`${transferLabel}`.toUpperCase()}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
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
            items={type === 'IncomingDocument' ? items : items?.slice(0, 1)}
          />
        </Col>
        <Col span='1'></Col>
        <Col span='18'>{handleSwitchScreen()}</Col>
      </Row>
    </Modal>
  );
};

export default TransferDocModal;
