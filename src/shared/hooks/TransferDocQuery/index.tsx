import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import incomingDocumentService from 'services/IncomingDocumentService';
import outgoingDocumentService from 'services/OutgoingDocumentService';

import { TransferQueryState } from './core/states';

export const initialTransferQueryState: TransferQueryState = {
  documentIds: [],
  summary: undefined,
  assigneeId: undefined,
  collaboratorIds: [],
  processingTime: undefined,
  isInfiniteProcessingTime: false,
  processMethod: undefined,
  isTransferToSameLevel: false,
};

const transferQueryState = atom<TransferQueryState>({
  key: 'TRANSFER_QUERY_STATE',
  default: initialTransferQueryState,
});

export function useTransferSettingRes(type: string) {
  const { data: settings } = useQuery({
    queryKey: ['QUERIES.TRANSFER_SETTING'],
    queryFn: () => {
      if (type === 'IncomingDocument') return incomingDocumentService.getTransferDocumentsSetting();
      else return outgoingDocumentService.getTransferOutgoingDocumentsSetting();
    },
    cacheTime: 0,
  });

  return {
    settings,
  };
}

export const useTransferQuery = () => useRecoilState(transferQueryState);

export const useTransferQuerySetter = () => useSetRecoilState(transferQueryState);
