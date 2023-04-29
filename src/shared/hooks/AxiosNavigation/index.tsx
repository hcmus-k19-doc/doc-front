import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useAxiosNavigation() {
  const navigationRef = useRef(useNavigate());

  useEffect(() => {
    const axiosResponseInterceptor = axios.interceptors.response.use(
      (response: any) => {
        // status with 2xx
        return response;
      },
      (error: any) => {
        switch (error?.response?.status) {
          case 500:
            navigationRef.current('/error');
            break;
          default:
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(axiosResponseInterceptor);
    };
  }, []);
}

export default function AxiosNavigation() {
  useAxiosNavigation();
  return <></>;
}
