import { atom, useRecoilState, useSetRecoilState } from 'recoil';

import { DirectorTransferQueryState } from './core/states';

export const initialDirectorTransferQueryState: DirectorTransferQueryState = {
  documentIds: [],
  summary: undefined,
  assigneeId: undefined,
  collaboratorIds: [],
};

const directorTransferQueryState = atom<DirectorTransferQueryState>({
  key: 'DIRECTOR_TRANSFER_QUERY_STATE',
  default: initialDirectorTransferQueryState,
});

export const useDirectorTransferQuery = () => useRecoilState(directorTransferQueryState);

export const useDirectorTransferQuerySetter = () => useSetRecoilState(directorTransferQueryState);
