import axios from 'axios';
import { Notification } from 'antd';
import store from '@/stores';

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
    // 在发送请求之前做些什么
    config.headers.authentication = localStorage.getItem('af-token');
    // config.cancelToken = new CancelToken(function executor(c) {
    //   // executor 函数接收一个 cancel 函数作为参数
    //   config.cancel = c
    // })
    if (config.url.includes('mock')) {
      // mock的数据
    } else {
      config.url = 'f-api/' + config.url;
    }
    // window.axiosArr.push(config)
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
      showMsg(res.data.code, res.data.message || '');
      return res.data.result;
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
