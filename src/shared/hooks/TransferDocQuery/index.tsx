import { atom, useRecoilState, useSetRecoilState } from 'recoil';

import { DirectorTransferQueryState } from './core/states';

const directorTransferQueryState = atom<DirectorTransferQueryState>({
  key: 'DIRECTOR_TRANSFER_QUERY_STATE',
});

export const useDirectorTransferQuery = () => useRecoilState(directorTransferQueryState);

export const useDirectorTransferQuerySetter = () => useSetRecoilState(directorTransferQueryState);
