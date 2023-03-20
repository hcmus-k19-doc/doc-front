import axios from 'axios';

import { REACT_APP_DOC_MAIN_SERVICE_URL } from '../config/constant';
import { DocumentTypeDto } from '../models/doc-main-models';

export function getDocumentTypes(): Promise<DocumentTypeDto[]> {
  return axios
    .get<DocumentTypeDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/document-types`)
    .then((response) => response.data);
}
