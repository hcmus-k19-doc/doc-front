import { atom, useRecoilState, useSetRecoilState } from 'recoil';

import { TransferQueryState } from './core/states';

export const initialTransferQueryState: TransferQueryState = {
  documentIds: [],
  summary: undefined,
  assigneeId: undefined,
  collaboratorIds: [],
  processingTime: undefined,
  isInfiniteProcessingTime: false,
  processMethod: undefined,
};

const transferQueryState = atom<TransferQueryState>({
  key: 'TRANSFER_QUERY_STATE',
  default: initialTransferQueryState,
});

export const useTransferQuery = () => useRecoilState(transferQueryState);

export const useTransferQuerySetter = () => useSetRecoilState(transferQueryState);
