import { history } from 'umi';
import React from 'react';
import { Provider } from 'react-redux';
import store from '@/stores';

//渲染之前做权限校验
export function render(oldRender) {
  // 设置主题
  const prevCss = localStorage.getItem('fk-theme');
  document.head.querySelector('#theme').setAttribute('href', prevCss);
  if (true) {
    console.log(8888);
    oldRender();
  } else {
    console.log(9999);
    history.push('/login');
  }
}

//在初始加载和路由切换时做一些事情
export function onRouteChange(obj) {
  console.log(obj);
  // bacon(location.pathname);
}

// 修改交给 react-dom 渲染时的根组件。
export function rootContainer(container, { routes, plugin, history }) {
  console.log(routes);
  return <Provider store={store}>
    {container}
  </Provider>;
}
