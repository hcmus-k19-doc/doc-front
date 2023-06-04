import { Button, Modal } from 'antd';
import { TransferHistoryDetailModalProps } from 'components/NotificationHistory/core/models';

const TransferHistoryDetailModal: React.FC<TransferHistoryDetailModalProps> = (
  props: TransferHistoryDetailModalProps
) => {
  return (
    <Modal
      title='20px to Top'
      style={{ top: 20 }}
      open={props.isModalOpen}
      onCancel={props.handleClose}
      footer={[
        <Button key='ok' type='primary' onClick={props.handleClose}>
          OK
        </Button>,
      ]}>
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </Modal>
  );
};

export default TransferHistoryDetailModal;
