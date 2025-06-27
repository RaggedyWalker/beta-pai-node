import { BASE_URL } from '../config';
import http from '../utils/http';
import { AxiosResponse } from 'axios';

const akShareService = (
  url: string,
  params?: unknown
): Promise<AxiosResponse> => {
  return http.get(url, {
    baseURL: BASE_URL + ':80' + '/aktool/api/public/',
    params
  });
};
export default akShareService;
