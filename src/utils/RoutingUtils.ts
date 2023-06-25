import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';

import { ProcessingDocumentTypeEnum } from '../models/doc-main-models';

export let globalNavigate: NavigateFunction;
export let globalLocation: Location;

export const GlobalHistory = () => {
  globalNavigate = useNavigate();
  globalLocation = useLocation();

  return null;
};

function getUrl(processingDocumentType: ProcessingDocumentTypeEnum): string {
  switch (processingDocumentType) {
    case ProcessingDocumentTypeEnum.INCOMING_DOCUMENT:
      return '/docin/in-detail';
    case ProcessingDocumentTypeEnum.OUTGOING_DOCUMENT:
      return '/docout/out-detail';
  }
}

export const routingUtils = {
  getUrl,
};
