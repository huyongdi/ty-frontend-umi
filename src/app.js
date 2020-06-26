import { history } from 'umi';
import React from 'react';
import { Provider } from 'react-redux';
import store from '@/stores';

import '@/utils/axiosConfig';
import axios from 'axios';

//渲染之前做权限校验
export function render(oldRender) {
  // 设置主题
  const prevCss = localStorage.getItem('fk-theme');
  prevCss && document.querySelector('#theme').setAttribute('href', prevCss);

  // 判断是否登录过
  const loginRes = localStorage.getItem('af-token');
  oldRender();
  !loginRes && history.push('/login');
}

//在初始加载和路由切换时做一些事情
export function onRouteChange(obj) {
  console.log(obj);
  // bacon(location.pathname);
}

// 修改交给 react-dom 渲染时的根组件。
export function rootContainer(container, { routes, plugin, history }) {
  // const AppContext = React.createContext({axios});
  //
  // const appProps = {
  //   abc:axios,
  // };
  console.log('运行了provider');
  return (
    <Provider store={store}>
      {/*<AppContext.Provider value={appProps}>*/}
      {container}

      {/*</AppContext.Provider>*/}
    </Provider>
  );
}