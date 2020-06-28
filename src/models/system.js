import { useState, useCallback } from 'react';
import { useModel } from '../.umi/plugin-model/useModel';
import produce from 'immer';

export default () => {
  // 被激活的导航
  let [activeMenuInfo, setActive] = useState(
    JSON.parse(localStorage.getItem('af-activeMenu')) || {
      top: null, // 顶部哪个被激活：预警 统计 设置
      menus: null, // 被激活的菜单（包括所有层级）数组
      openCode: null, // 左侧导航哪个默认展开 (电话预警/网络预警) 数组
      selectCode: null, // 左侧导航选中了哪个具体的页面 数组
    },
  );
  // 修改被激活的导航
  const setMenuActive = useCallback(params => {
    const nextState = produce(
      JSON.parse(localStorage.getItem('af-activeMenu')) || {},
      draftState => {
        for (let key in params) {
          draftState[key] = params[key];
        }
      },
    );
    setActive(nextState);
    localStorage.setItem('af-activeMenu', JSON.stringify(nextState));
  }, []);
  return {
    activeMenuInfo,
    setMenuActive,
  };
};
