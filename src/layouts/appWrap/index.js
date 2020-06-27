import React, { useState, useEffect } from 'react';
import { Input, message, Modal } from 'antd';
import { useEventTarget } from '@umijs/hooks';
import axios from 'axios';
import MenuTop from '../MenuTop';
import MenuLeft from '../MenuLeft';

import styles from './index.less';

export default props => {
  return (
    <div className={styles.appWrap}>
      <MenuTop history={props.history} />
      <div className={styles.appMain}>
        <MenuLeft history={props.history} />
        {props.children}
      </div>
    </div>
  );
};
