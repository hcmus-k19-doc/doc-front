import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { ProcessingMethodDto } from 'models/doc-main-models';

async function getProcessingMethods() {
  return await axios.get<ProcessingMethodDto[]>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/processing-methods`
  );
}

const processingMethodService = {
  getProcessingMethods,
};

export default processingMethodService;
