import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';

import { DistributionOrganizationDto } from '../models/doc-main-models';

async function getDistributionOrgs() {
  const response = await axios.get<DistributionOrganizationDto[]>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/distribution-organizations`
  );

  return response;
}

const distributionOrgService = {
  getDistributionOrgs,
};

export default distributionOrgService;
