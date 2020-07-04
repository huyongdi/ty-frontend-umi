import React, { useEffect } from 'react';
import MenuTop from '../MenuTop';
import MenuLeft from '../MenuLeft';
import Breadcrumb from '../Breadcrumb';
import axios from 'axios';
import moment from 'moment';
import styles from './index.less';
import { useDispatch, useSelector } from 'react-redux';

export default props => {
  const configObj = useSelector(state => state.backEnd);
  const { backEnd } = useDispatch();
  // 系统初次加载时做一些操作 请求config
  useEffect(() => {
    backEnd.getBackEndConfig();
    backEnd.getIdentify();
    backEnd.getNextOrg();
    backEnd.getAllOrg();
  }, []);

  let downProps = {
    ...configObj,
    moment,
    is1920: document.body.clientWidth === 1920,
    is1600: document.body.clientWidth === 1600,
    dateFormat: 'YYYY-MM-DD HH:mm:ss', // 转化为时分秒：比如td显示
    pickFormat: 'YYYY-MM-DD HH:mm', // 转化为时分，比如时间选择器
    showTime: 'HH:mm',
    immerChange: (fun, key, val) => {
      fun(draft => {
        draft[key] = val;
      });
    },
  };
  return (
    <div className={styles.appWrap}>
      <MenuTop {...props} />
      <div className={styles.appMain}>
        <MenuLeft {...props} />
        <div className={styles.rightMain}>
          <Breadcrumb {...props} />
          <div className={styles.pageWrap}>
            {React.cloneElement(props.children, { ...downProps })}
          </div>
        </div>
      </div>
    </div>
  );
};
