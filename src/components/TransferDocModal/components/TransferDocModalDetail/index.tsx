import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Menu, Modal, Row } from 'antd';
import {
  TransferDocumentMenuConfig,
  TransferDocumentModalSettingDto,
} from 'models/doc-main-models';
import { transferDocModalState } from 'pages/shared/IncomingDocListPage/core/states';
import { useRecoilState } from 'recoil';
import { useTransferSettingRes } from 'shared/hooks/TransferDocQuery';

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
}) => {
  const { settings } = useTransferSettingRes();
  const [transferLabel, setTransferLabel] = useState<string>('');
  const [, setTransferDocModalItem] = useRecoilState(transferDocModalState);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
  const [detailModalSetting, setDetailModalSetting] = useState<TransferDocumentModalSettingDto>();

  // only get the menuConfigs that isTransferToSameLevel === false
  // const detailModalSetting = {
  //   ...settings,
  //   menuConfigs: settings?.menuConfigs?.filter((item) => {
  //     return item.isTransferToSameLevel === false;
  //   }),
  // };

  useEffect(() => {
    if (settings && settings.menuConfigs) {
      const newSetting = {
        ...settings,
        menuConfigs:
          settings?.menuConfigs?.filter((item) => {
            return item.isTransferToSameLevel === false;
          }) || [],
      };
      console.log('newSetting', newSetting);
      setDetailModalSetting(newSetting);
      setTransferLabel(newSetting.menuConfigs[0].transferDocumentTypeLabel);
      setTransferDocModalItem({
        transferDocumentType: newSetting.menuConfigs[0].transferDocumentType,
        isTransferToSameLevel: newSetting.menuConfigs[0].isTransferToSameLevel,
      });
      setDefaultSelectedKeys([newSetting.menuConfigs[0].menuKey.toString()]);
    }
  }, [settings]);
  console.log('settngs', settings);
  console.log('detail-settiing', detailModalSetting);
  console.log('transferredDoc', transferredDoc);
  const items = detailModalSetting?.menuConfigs?.reduce(
    (acc: MenuItem[], item: TransferDocumentMenuConfig) => {
      return [...acc, getItem(item.menuLabel, item.menuKey)];
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
        />
      );
    }

    return (
      <DirectorScreenComponent
        form={form}
        selectedDocs={[transferredDoc]}
        isTransferToSameLevel={false}
      />
    );
  };

  return (
    <Modal
      title={`${transferLabel}`.toUpperCase()}
      open={isModalOpen}
      footer={[
        <Button key='ok' type='primary' onClick={handleClose}>
          OK
        </Button>,
      ]}
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

export default TransferDocModalDetail;
