import React, { useState, useEffect } from 'react';
import { Input, message, Modal, Dropdown } from 'antd';
import { useEventTarget } from '@umijs/hooks';
import axios from 'axios';

import { Menu } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import logo from '@img/logo.png';

export default props => {
  const {
    accountInfo: { name },
  } = JSON.parse(localStorage.getItem('af-user'));
  return (
    <div className={styles.headerWrap}>
      <img className={styles.logo} src={logo} alt="logo" />
      <span className={styles.sysName}>重庆市反诈狙击手</span>
      <ul className={styles.main}></ul>
      <div className={styles.msg}>
        <i className={`iconfont iconxiaoxi ${styles.img}`} />
        <span className={styles.title}>消息</span>
        {/*{*/}
        {/*  unread > 0 && <span className={styles.count}>{unread >= 0 ? unread : 0}</span>*/}
        {/*}*/}
      </div>
      <div className={styles.userName}>
        <Dropdown
          overlay={
            <Menu selectedKeys={[]} style={{ marginTop: 0 }}>
              <Menu.Item icon={<AppstoreOutlined />}>后台管理</Menu.Item>
              <Menu.Item icon={<LogoutOutlined />}>退出登录</Menu.Item>
            </Menu>
          }
        >
          <label className={styles.nameLabel}>{name}</label>
        </Dropdown>
      </div>
    </div>
  );
};
