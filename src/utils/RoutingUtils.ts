import { useLocation } from 'react-router-dom';
import { Location, NavigateFunction, useNavigate } from 'react-router-dom';

export let globalNavigate: NavigateFunction;
export let globalLocation: Location;

export const GlobalHistory = () => {
  globalNavigate = useNavigate();
  globalLocation = useLocation();

  return null;
};
