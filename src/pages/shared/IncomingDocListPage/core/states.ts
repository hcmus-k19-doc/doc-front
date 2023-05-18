import { TransferDocumentType } from 'models/doc-main-models';
import { atom } from 'recoil';

const transferDocModalState = atom({
  key: 'transferDocModalState',
  default: {
    transferDocumentType: TransferDocumentType.TRANSFER_TO_GIAM_DOC,
    isTransferToSameLevel: false,
  },
});

const transferDocDetailModalState = atom({
  key: 'transferDocModalDetailState',
  default: {
    transferDocumentType: TransferDocumentType.TRANSFER_TO_GIAM_DOC,
    isTransferToSameLevel: false,
  },
});

export { transferDocModalState, transferDocDetailModalState };
