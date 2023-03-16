import { createUseStyles } from 'react-jss';

export const useStyle = createUseStyles((theme: any) => ({
  boldText: {
    fontWeight: 'bold',
    fontSize: '15px',
    color: theme.color,
  },
}));
