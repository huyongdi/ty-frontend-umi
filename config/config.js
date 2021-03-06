import { defineConfig } from 'umi';
import routes from './routes';
import themeArr from './theme';

export default defineConfig({
  ignoreMomentLocale: false,
  // dynamicImport: {}, // 按需加载
  runtimePublicPath: true,
  nodeModulesTransform: {
    // 设置 node_modules 目录下依赖文件的编译方式
    type: 'none',
  },
  alias: {
    // 别名
    '@img': '@/assets/img',
    '@media': '@/assets/media',
    '@store': '@/stores',
    '@utils': '@/utils',
    '@components': '@/components',
  },
  mock: {},
  routes,
  headScripts: [{ src: '/iconfont.js' }],
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    themeArr.forEach(({ name, path }) => {
      memo
        .entry(name)
        .add(path)
        .end();
    });
    memo.module
      .rule('media')
      .test(/\.(mp3|4)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'));
  },
});
