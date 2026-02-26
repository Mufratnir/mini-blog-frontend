import axios, { AxiosRequestConfig } from 'axios';

export type AlertType = { type: 'success' | 'error'; message: string };

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Optional: attach token if you have auth
const getAuthToken = (): string | null => {
  const auth = localStorage.getItem('auth');
  if (!auth) return null;
  const LS = JSON.parse(auth);
  return LS.token || null;
};

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    if (config.headers) delete config.headers['Content-Type'];
  }
  return config;
});

// ---------------- Generic API request with loader & alert ----------------
export const apiRequest = async <T = any,>({
  method,
  url,
  data,
  params,
  setLoader,
  setAlert,
  setFormErrors,
}: {
  method: AxiosRequestConfig['method'];
  url: string;
  data?: any;
  params?: any;
  setLoader?: (value: boolean) => void;
  setAlert?: (alert: AlertType | null) => void;
  setFormErrors?: (errors: Record<string, string>) => void;
}): Promise<T | { success: true; errors?: any }> => {
  try {
    if (setLoader) setLoader(true);
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      params,
    });
    if (setLoader) setLoader(false);
    const message = response?.data?.message;
    if (setAlert && message) setAlert({ type: 'success', message });
    return response.data;
  } catch (error: any) {
    if (setLoader) setLoader(false);
    const message = error.response?.data?.message || 'Network error';
    if (setAlert) setAlert({ type: 'error', message });

    if (setFormErrors && error.response?.data?.errors) {
      const formattedErrors: { [key: string]: string } = {};
      Object.keys(error.response.data.errors).forEach((key) => {
        formattedErrors[key] = error.response.data.errors[key][0];
      });
      setFormErrors(formattedErrors);
    }

    return { success: false, errors: error.response?.data || { general: message } };
  }
};
