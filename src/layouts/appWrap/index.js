import React, { useState, useEffect } from 'react';
import MenuTop from '../MenuTop';
import MenuLeft from '../MenuLeft';
import Breadcrumb from '../Breadcrumb';
import axios from 'axios';
import styles from './index.less';

export default props => {
  return (
    <div className={styles.appWrap}>
      <MenuTop {...props} />
      <div className={styles.appMain}>
        <MenuLeft {...props} />
        <div className={styles.rightMain}>
          <Breadcrumb {...props} />
          <div className={styles.pageWrap}>
            {React.cloneElement(props.children, { axios: axios })}
          </div>
        </div>
      </div>
    </div>
  );
};
