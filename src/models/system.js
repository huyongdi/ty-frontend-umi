import { useState, useCallback } from 'react';

export default function test() {
  const menus = JSON.parse(localStorage.getItem('af-menus'));
  console.log(menus[0]);
  console.log(menus[0].code);

  const [topActive, setTopActive] = useState(menus[0].code); // 默认后台返回的第一个被激活
  console.log(topActive);
  return {
    topActive,
    setTopActive,
  };
}
