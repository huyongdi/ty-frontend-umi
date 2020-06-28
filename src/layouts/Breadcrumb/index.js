import React, { useState, useEffect } from 'react';
import { useBoolean } from '@umijs/hooks';
import { Link, useModel } from 'umi';
import { Breadcrumb, Button } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import './index.less';

export default props => {
  const { activeMenu } = useModel('system');
  const [breadName, setName] = useState([]);
  useEffect(() => {
    activeMenu.child.forEach(item => {
      item.child.forEach(val => {
        if (val.path === props.location.pathname) {
          setName([activeMenu.name, item.name, val.name]);
        }
      });
    });
  }, [props.location.pathname]);
  const refreshCurrentPage = () => {
    console.log(props);
    props.history.replace(props.location.pathname);
  };
  return (
    <div className="breadWrap">
      <Breadcrumb>
        {breadName.map((item, index) => {
          return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>;
        })}
      </Breadcrumb>
      <div className="breadButton">
        <span onClick={refreshCurrentPage}>
          <i className="iconfont iconshuaxin" />
          刷新
        </span>
        <span onClick={() => props.history.goBack()}>
          <i className="iconfont iconfanhui" />
          返回
        </span>
      </div>
    </div>
  );
};
