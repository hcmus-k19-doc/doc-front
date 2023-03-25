import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { FolderDto } from 'models/doc-main-models';

async function getFolders() {
  const response = await axios.get<FolderDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/folders`);

  return response;
}

const folderService = {
  getFolders,
};

export default folderService;
