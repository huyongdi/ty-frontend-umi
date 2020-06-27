import React, { useState, useEffect } from 'react';
import MenuTop from '../MenuTop';
import MenuLeft from '../MenuLeft';
import Breadcrumb from '../Breadcrumb';

import styles from './index.less';

export default props => {
  console.log(props);
  return (
    <div className={styles.appWrap}>
      <MenuTop history={props.history} />
      <div className={styles.appMain}>
        <MenuLeft history={props.history} />
        <div className={styles.rightMain}>
          <Breadcrumb location={props.location} />
          {props.children}
        </div>
      </div>
    </div>
  );
};
