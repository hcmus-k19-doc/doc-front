import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Menu, Modal, Row } from 'antd';
import { TransferDocumentMenuConfig } from 'models/doc-main-models';
import { transferDocModalState } from 'pages/shared/IncomingDocListPage/core/states';
import { useRecoilState } from 'recoil';
import { useTransferSettingRes } from 'shared/hooks/TransferDocQuery';

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
  DirectorScreenComponent,
  ExpertScreenComponent,
  ManagerScreenComponent,
  SecretaryScreenComponent,
};

const TransferDocModal: React.FC<TransferModalProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  selectedDocs,
}) => {
  const { t } = useTranslation();
  const { settings } = useTransferSettingRes();
  const [transferLabel, setTransferLabel] = useState<string>('');
  const [, setTransferDocModalItem] = useRecoilState(transferDocModalState);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);

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
        />
      );
    }

    return (
      <DirectorScreenComponent
        form={form}
        selectedDocs={selectedDocs}
        isTransferToSameLevel={false}
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
            items={items}
          />
        </Col>
        <Col span='1'></Col>
        <Col span='18'>{handleSwitchScreen()}</Col>
      </Row>
    </Modal>
  );
};

export default TransferDocModal;
