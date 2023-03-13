import { TokenDto } from 'models/models';

const AUTH_LOCAL_STORAGE_KEY = 'doc-auth-react-v';

export const getAuth = () => {
  if (!localStorage) {
    return;
  }

  const token = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!token) {
    return;
  }

  try {
    const auth = JSON.parse(token) as TokenDto;
    if (auth) {
      return auth;
    }
  } catch (error) {
    console.error('Local Storage Parse Error: ', error);
  }
};

export const setAuth = (auth: TokenDto) => {
  if (!localStorage) {
    return;
  }

  try {
    const lsValue = JSON.stringify(auth);
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};

export const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();
      if (auth && auth.access_token) {
        config.headers.Authorization = `Bearer ${auth.access_token}`;
      }

      return config;
    },
    (err: unknown) => Promise.reject(err)
  );
}
