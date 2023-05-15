import { TransferDocumentType } from 'models/doc-main-models';
import { atom } from 'recoil';

const transferDocModalState = atom({
  key: 'transferDocModalState',
  default: TransferDocumentType.TRANSFER_TO_GIAM_DOC,
});

export { transferDocModalState };
