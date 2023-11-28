import http from '../utils/http';
import { AxiosResponse } from 'axios';

const akShareService = (
  url: string,
  params?: unknown
): Promise<AxiosResponse> => {
  return http.get(url, {
    baseURL: 'http://127.0.0.1:8080/api/public/',
    params
  });
};
export default akShareService;
