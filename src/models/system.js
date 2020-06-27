import { useState, useCallback } from 'react';

export default function test() {
  const menus = JSON.parse(localStorage.getItem('af-menus'));
  const [topActive, setActive] = useState(
    localStorage.getItem('af-top') || menus[0].code,
  ); // 默认后台返回的第一个被激活
  console.log(topActive);
  // 切换顶部激活的同时，将值保存在缓存中
  const setTopActive = useCallback(code => {
    setActive(code);
    localStorage.setItem('af-top', code);
  }, []);
  return {
    topActive,
    setTopActive,
  };
}
