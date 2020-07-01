import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function useConfigParse(key, type) {
  const obj = useSelector(state => state.backEnd);
  const arr = obj[type];
  let val = '';
  arr.forEach(item => {
    if (item.cfgKey == key) {
      val = item.cfgValue;
    }
  });
  return val;
}

export { useConfigParse };
