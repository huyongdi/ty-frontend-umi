import { useState, useCallback } from 'react';

export default function test() {
  const [topActive, setActive] = useState(
    localStorage.getItem('af-top') || null,
  ); // 默认后台返回的第一个被激活
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
