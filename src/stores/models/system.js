// 用来维护系统自己的状态 比如activemenu token等等
import produce from 'immer';

const initState = {
  // 登录成功后存的数据
  token: null,
  userInfo: null,
  allMenus: null,
  theme: null,
  // 被激活的导航
  activeMenu: {
    top: null, // 顶部哪个被激活：预警 统计 设置
    menus: null, // 被激活的菜单（包括所有层级）数组
    openCode: null, // 左侧导航哪个默认展开 (电话预警/网络预警) 数组
    selectCode: null, // 左侧导航选中了哪个具体的页面 数组
    breadName: [], // 面包屑导航的数组
  },
};
export default {
  state: initState,
  reducers: {
    updateKey(state, data) {
      return produce(state, draftState => {
        if (Array.isArray(data)) {
          // 不是第一层的传数组 比如['activeMenu',{}]
          const len = data.length;
          const obj = data[len - 1];
          for (let key in obj) {
            len === 2 && (draftState[data[0]][key] = obj[key]);
            // len === 3 && (draftState[data[0]][data[1]][key] = obj[key])
          }
        } else {
          // 最外层约定传对象
          for (let key in data) {
            draftState[key] = data[key];
          }
        }
      });
    },
  },
  effects: {
    // 路由变化时，设置active 要拿的东西有点多，递归不方便处理，后面看基础服务的更新再调整
    async setActiveByCurrent(payload, rootState) {
      console.log(payload);
      const { allMenus } = rootState.system;
      allMenus.forEach(menus => {
        menus.child.forEach(item => {
          item.child.forEach(val => {
            if (val.path === payload) {
              this.updateKey([
                'activeMenu',
                {
                  top: menus.code,
                  menus,
                  openCode: [item.code],
                  selectCode: [val.code],
                  breadName: [menus.name, item.name, val.name],
                },
              ]);
            }
          });
        });
      });
    },
  },
};
