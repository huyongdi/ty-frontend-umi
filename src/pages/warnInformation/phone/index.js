import React, { useState, useEffect } from 'react';
import { Input, message, Modal } from 'antd';
import { useEventTarget } from '@umijs/hooks';
import axios from 'axios';
import { useModel } from 'umi';

import styles from './index.less';

export default props => {
  console.log(props);
  useEffect(() => {
    console.log(666);
    axios.get('/mock/tags');
  }, []);
  return <div className={styles.loginWrap}>电话预警</div>;
};
