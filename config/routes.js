export default [
  { path: '/login', component: '@/pages/login' },
  {
    path: '/',
    component: '@/layouts/appWrap/',
    routes: [
      { path: '/home', component: '@/pages/home' },
      { path: '/test', component: '@/pages/test' },
    ],
  },
];
