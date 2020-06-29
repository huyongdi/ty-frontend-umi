import React, { useState, useEffect } from 'react';
import { useBoolean } from '@umijs/hooks';
import { Link, useModel } from 'umi';
import { Breadcrumb, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { SearchOutlined } from '@ant-design/icons';
import './index.less';

export default props => {
  const {
    activeMenu: { breadName },
  } = useSelector(state => state.system);
  const obj = useSelector(state => state.system);
  console.log(obj);
  console.log(breadName);
  // console.log(activeMenu)
  // 刷新
  const refreshCurrentPage = () => {
    props.history.replace(props.location.pathname);
  };

  // 返回
  const backPage = () => {
    console.log(props.history.location.pathname);
    if (props.history.location.pathname === '/yjxx') {
      message.info('再返回就到登录了!');
    } else {
      props.history.goBack();
    }
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
        <span onClick={backPage}>
          <i className="iconfont iconfanhui" />
          返回
        </span>
      </div>
    </div>
  );
};
