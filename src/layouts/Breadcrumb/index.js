import React, { useState, useEffect } from 'react';
import { useBoolean } from '@umijs/hooks';
import { Link, useModel } from 'umi';
import { Breadcrumb, Menu } from 'antd';
import styles from './index.less';

export default props => {
  const { activeMenu } = useModel('system');
  const [breadName, setName] = useState([]);
  useEffect(() => {
    activeMenu.child.forEach(item => {
      item.child.forEach(val => {
        console.log(val.path);
        console.log(props.location.pathname);
        if (val.path === props.location.pathname) {
          setName([activeMenu.name, item.name, val.name]);
        }
      });
    });
  }, [props.location.pathname]);
  return (
    <div className={styles.breadWrap}>
      <Breadcrumb>
        {breadName.map((item, index) => {
          return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>;
        })}
      </Breadcrumb>
    </div>
  );
};
