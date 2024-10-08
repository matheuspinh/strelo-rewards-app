import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  users:{
    list: '/api/users',
    register: '/api/users/register',
    delete: '/api/users',
    detail: '/api/users/',
    update: '/api/users/'
  },
  missions:{
    list: '/api/missions',
    register: '/api/missions',
    delete: '/api/missions',
    detail: '/api/mission',
    update: '/api/mission',
    complete: '/api/mission/complete'
  },
  badges:{
    list: '/api/badges',
    register: '/api/badges',
    delete: '/api/badges',
    detail: '/api/badges',
    update: '/api/badges'
  },
  privileges:{
    list: '/api/privileges',
    register: '/api/privilege',
    delete: '/api/privilege',
    detail: '/api/privilege',
    update: '/api/privilege'
  },
  levels:{
    list: '/api/levels',
    register: '/api/levels',
    levelUp: '/api/levels',
    update: '/api/levels',
    detail: '/api/levels'
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
