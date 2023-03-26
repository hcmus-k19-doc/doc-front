import { atom, useRecoilState, useSetRecoilState } from 'recoil';

import { TransferDirectorQueryState } from './core/states';

const transferDirectorQueryState = atom<TransferDirectorQueryState>({
  key: 'TRANSFER_DIRECTOR_QUERY_STATE',
});

export const useTransferDirectorQuery = () => useRecoilState(transferDirectorQueryState);

export const useTransferDirectorQuerySetter = () => useSetRecoilState(transferDirectorQueryState);
