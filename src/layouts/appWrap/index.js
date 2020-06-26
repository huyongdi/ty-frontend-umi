import React, { useState, useEffect } from 'react';
import { Input, message, Modal } from 'antd';
import { useEventTarget } from '@umijs/hooks';
import axios from 'axios';
import MenuTop from '../MenuTop';
import styles from './index.less';

export default props => {
  return (
    <div className={styles.appWrap}>
      <MenuTop />
      <div className={styles.appMain}></div>
    </div>
  );
};
