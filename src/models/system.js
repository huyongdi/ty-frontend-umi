import { useState, useCallback } from 'react';
import { useModel } from '../.umi/plugin-model/useModel';
import produce from 'immer';

export default () => {
  // 被激活的导航
  const [activeMenuInfo, setActive] = useState(
    JSON.parse(localStorage.getItem('af-activeMenu')) || {
      top: null, // 顶部哪个被激活：预警 统计 设置
      menus: null, // 被激活的菜单（包括所有层级）
    },
  );

  // 切换顶部激活的同时，将值保存在缓存中
  const setMenuActive = useCallback(params => {
    const draftState = produce(activeMenuInfo, draft => {
      if (typeof activeMenuInfo === 'object') {
        for (let key in params) {
          console.log(key);
          draft[key] = params[key];
          if (key === 'top') {
            // 第一层变化时，统一在这里修改被激活的menus菜单
            draft.menus = JSON.parse(localStorage.getItem('af-menus')).find(
              item => item.code === params.top,
            );
          }
        }
      }
    });
    setActive(draftState);
    localStorage.setItem('af-activeMenu', JSON.stringify(draftState));
  }, []);
  return {
    activeMenuInfo,
    setMenuActive,
  };
};
