import { useState, useCallback } from 'react';
import { useModel } from '../.umi/plugin-model/useModel';

export default () => {
  // 顶部哪个被激活 （预警/统计/设置）
  const [topActive, setActive] = useState(
    localStorage.getItem('af-top') || null,
  );
  // 哪个最外层的menu被激活
  const [activeMenu, setActiveMenu] = useState(
    JSON.parse(localStorage.getItem('af-activeMenu')) || null,
  );

  // 切换顶部激活的同时，将值保存在缓存中
  const setTopActive = useCallback(code => {
    setActive(code);
    localStorage.setItem('af-top', code);
    let menus = JSON.parse(localStorage.getItem('af-menus'));

    menus = menus.find(item => item.code === code);
    setActiveMenu(menus);
    localStorage.setItem('af-activeMenu', JSON.stringify(menus));
  }, []);
  return {
    topActive,
    setTopActive,
    activeMenu,
  };
};
