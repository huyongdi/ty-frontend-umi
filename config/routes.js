export default [
  { exact: true, path: '/', redirect: '/login' },
  { path: '/login', component: '@/pages/login' }, // 登录页
  {
    path: '/',
    component: '@/layouts/appWrap/',
    routes: [
      // 预警信息
      { path: '/yjxx', component: '@/pages/warnInformation/phone' },
      { path: '/wnyjxx', component: '@/pages/warnInformation/net' },
    ],
  },
];
