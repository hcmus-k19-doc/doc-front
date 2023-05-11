import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { DepartmentDto } from 'models/doc-main-models';

async function getDepartments() {
  const response = await axios.get<DepartmentDto[]>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/departments`
  );

  return response;
}

const departmentService = {
  getDepartments,
};

export default departmentService;
