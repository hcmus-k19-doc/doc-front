import React from 'react';
import clsx from 'clsx';

import { useStyle } from './styles';

const VanThu: React.FC = () => {
  const theme = {
    color: 'red',
  };
  const classes = useStyle({ theme });
  return <div className={clsx(classes.boldText)}>Van Thu Component</div>;
};

export default VanThu;
