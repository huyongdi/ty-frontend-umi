import React, { useState, useEffect } from 'react';
import store from '../../stores';
import { Button } from 'antd';
import styles from './index.less';
import { Link, useModel } from 'umi';

export default function(props) {
  const { user, signin } = useModel(
    'test',
    ({ user, signin }) => ({ user, signin }),
  );

  return (
    <div className={styles.abc}>
      {user}
      <Link to="/login">跳转到LOGIN</Link>
      <button onClick={() => signin()}>
        Click store
      </button>

    </div>
  );
}
