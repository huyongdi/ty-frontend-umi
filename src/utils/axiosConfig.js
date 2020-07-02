import axios from 'axios';
import { Notification } from 'antd';
import ParseMapToFormData from './ParseMapToFormData';
import store from '@/stores';
import { history } from 'umi';

const CancelToken = axios.CancelToken;
window.axiosArr = [];
// window.source = (axios.CancelToken).source()

// 根据code弹出提示
const showMsg = (code, message) => {
  let type = null,
    messageType = null;
  if (code === 200) {
    return;
  } else if (code === 300) {
    type = 'info';
    messageType = '提示';
  } else if (code === 400) {
    type = 'warning';
    messageType = '警告';
  } else if (code === 403) {
    type = 'info';
    messageType = '提示';
    history.push('/login');
  } else {
    type = 'error';
    messageType = '错误';
  }
  Notification[type]({
    message: messageType,
    description: `${
      message.includes('=') ? message.split('=')[1] : message || '未知'
    }`,
  });
};

axios.defaults.timeout = 60000;
// axios.defaults.baseURL = 'f-api/'
// axios.defaults.cancelToken = window.source.token
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    config.headers.authentication = localStorage.getItem('af-token');
    if (config.url.includes('mock')) {
      // mock的数据
    } else {
      config.url = 'f-api/' + config.url;
    }
    if (config.data && config.data.formData) {
      delete config.data.formData;
      config.data = ParseMapToFormData(config.data);
    }
    config.cancelToken = new CancelToken(function executor(c) {
      window.axiosArr.push(c);
    });
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    if (res.status === 200) {
      // network 200
      res.data.code && showMsg(res.data.code, res.data.message || '');
      if (res.data.code === 200 || res.data.statusCode === '201') {
        return res.data.result || true;
      } else {
        return null;
      }
    } else {
      showMsg(500, `${res.error}，错误代码：${res.status}` || '');
      return res;
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);
