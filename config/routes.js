export default [
  { exact: true, path: '/', redirect: '/login' },
  { path: '/login', component: '@/pages/login' }, // 登录页
  {
    path: '/',
    component: '@/layouts/appWrap/',
    routes: [
      { path: '/warnDetail', component: '@/pages/warnDetail' }, // 预警详情
      // 预警信息
      { path: '/yjxx', component: '@/pages/warnInformation/phone' },
      { path: '/wnyjxx', component: '@/pages/warnInformation/net' },
      // 预警分发
      { path: '/yjff', component: '@/pages/warnSend/phone' },
      { path: '/wnyjff', component: '@/pages/warnSend/net' },
      // 重复预警
      { path: '/wxyj', component: '@/pages/warnRepeat/phone' },
      { path: '/wnwxyj', component: '@/pages/warnRepeat/net' },
      // 已反馈预警
      { path: '/yfkyj', component: '@/pages/warnDone/phone' },
      { path: '/wnyfkyj', component: '@/pages/warnDone/net' },
      // 系统指标
      { path: '/xtzb', component: '@/pages/sysStat/phone' },
      { path: '/wnxtzb', component: '@/pages/sysStat/net' },
    ],
  },
];
