import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PATH_DIRECTOR } from 'config/path';
import * as _ from 'lodash';

export const AuthDirector = (routerListDirector: any) => {
  const authDirector = [
    {
      path: PATH_DIRECTOR.DIRECTOR,
      exact: true,
      component: () => 'Director secret page',
    },
  ];

  const mergerRouterAuthList = () => {
    return _.values(
      _.merge(_.keyBy(authDirector, 'serviceCode'), _.keyBy(routerListDirector, 'serviceCode'))
    )?.filter((val) => val?.permission?.usedFlag && val?.path);
  };

  const result = useMemo(() => mergerRouterAuthList(), [routerListDirector]);
  return result;
};
