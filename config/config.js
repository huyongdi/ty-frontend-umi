import { defineConfig } from 'umi';
import routes from './routes';
import themeArr from './theme'

export default defineConfig({
  ignoreMomentLocale: true, // 忽略 moment 的 locale 文件，用于减少尺寸。
  dynamicImport: {}, // 按需加载
  nodeModulesTransform: { // 设置 node_modules 目录下依赖文件的编译方式
    type: 'none',
  },
  alias: { // 别名
    '@store': '@/stores',
  },
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    themeArr.forEach(({name,path}) => {
      memo.entry(name).add(path).end()
    })
  },
  routes,
});
