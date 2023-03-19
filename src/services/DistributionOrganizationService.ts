import axios from 'axios';

import { REACT_APP_DOC_MAIN_SERVICE_URL } from '../config/constant';
import { DistributionOrganizationDto } from '../models/doc-main-models';

export function getDistributionOrganizations() {
  return axios
    .get<DistributionOrganizationDto[]>(
      `${REACT_APP_DOC_MAIN_SERVICE_URL}/distribution-organizations`
    )
    .then((response) => response.data);
}
