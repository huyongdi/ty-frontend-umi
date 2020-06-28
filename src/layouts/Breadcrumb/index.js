import React, { useState, useEffect } from 'react';
import { useBoolean } from '@umijs/hooks';
import { Link, useModel } from 'umi';
import { Breadcrumb, Button } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import './index.less';

export default props => {
  const {
    activeMenuInfo: { menus },
    setMenuActive,
  } = useModel('system');
  const [breadName, setName] = useState([]);
  useEffect(() => {
    // 递归不方便处理，先遍历层级，后面看基础服务做改进
    // 遍历找到面包屑 并设置active
    menus.child.forEach(item => {
      item.child.forEach(val => {
        if (val.path === props.location.pathname) {
          setName([menus.name, item.name, val.name]);
          setMenuActive({
            openCode: [item.code],
            selectCode: [val.code],
          });
        }
      });
    });
  }, [props.location.pathname]);

  // 刷新
  const refreshCurrentPage = () => {
    props.history.replace(props.location.pathname);
  };

  // 返回
  const backPage = () => {
    props.history.goBack();
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
