import React, { useEffect } from 'react';
import { Breadcrumb, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { Prompt } from 'umi';
import './index.less';

export default props => {
  const {
    activeMenu: { breadName },
  } = useSelector(state => state.system);

  // 刷新
  const refreshCurrentPage = () => {
    props.history.go(props.location.pathname);
  };
  // 返回
  const backPage = () => {
    if (props.history.location.pathname === '/yjxx') {
      // message.info('再返回就到登录了!')
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
        {/*<Prompt*/}
        {/*  message={async location => {*/}
        {/*    await window.source.cancel()*/}
        {/*    return true*/}
        {/*  }}*/}
        {/*/>*/}
      </div>
    </div>
  );
};
