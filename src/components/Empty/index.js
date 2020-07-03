import React from 'react';
import img from '@img/empty.png';
import styles from './index.less';

const TableEmpty = props => (
  <div className={`${styles.systemEmpty} ${props.className}`}>
    <img src={img} alt="empty" />
    <span>{props.content}</span>
  </div>
);

export default TableEmpty;
