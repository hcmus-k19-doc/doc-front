import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { DocumentTypeDto } from 'models/doc-main-models';

async function getDocumentTypes() {
  const response = await axios.get<DocumentTypeDto[]>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/document-types`
  );

  return response;
}

const documentTypeService = {
  getDocumentTypes,
};

export default documentTypeService;
