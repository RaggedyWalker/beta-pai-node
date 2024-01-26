import axios, { InternalAxiosRequestConfig } from 'axios';
import { LICENSE } from '../config';

const baseURL = 'http://api.mairui.club';

const axiosInstance = axios.create({
  baseURL
});
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.url = config.url + '/' + LICENSE.MAIRUI;
  return config;
});

const getStockList = () => {
  return axiosInstance.get('/hslt/list');
};

export default { getStockList };
