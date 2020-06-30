import { history } from 'umi';
import React from 'react';
import { Provider } from 'react-redux';
import store from '@/stores';
import { getPersistor } from '@rematch/persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import '@/utils/axiosConfig';

const persistor = getPersistor();

//渲染之前做权限校验
export function render(oldRender) {
  // 主题和token不从persist拿，加快速度
  // 设置主题
  const prevCss = localStorage.getItem('af-theme');
  prevCss && document.querySelector('#theme').setAttribute('href', prevCss);

  // 判断是否登录过
  oldRender();
  const loginRes = localStorage.getItem('af-token');
  !loginRes && history.push('/login');
}

//在初始加载和路由切换时做一些事情
export function onRouteChange(obj) {
  // await window.source.cancel()
  console.log(window.axiosArr);
  const { pathname } = obj.location;
  if (pathname !== '/login')
    store.dispatch.system.setActiveByCurrent(obj.location.pathname);
}

// 修改交给 react-dom 渲染时的根组件。
export function rootContainer(container, { routes, plugin, history }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{container}</PersistGate>
    </Provider>
  );
}
