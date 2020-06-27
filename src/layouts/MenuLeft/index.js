import React, { useState, useEffect } from 'react';
import { Input, message, Modal, Dropdown } from 'antd';
import { useBoolean } from '@umijs/hooks';
import axios from 'axios';
import menuIcon from '@utils/menuIcon';
import { Menu } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import './menu.less';

const menuRender = menus => {
  return menus.map(menu => {
    console.log(menu);
    // const MenuSVGIconComponent = menuSVGMap[menu.icon]
    const MenuIcon = menu.icon ? (
      <i className={`${menu.icon} iconfont`} style={{ marginRight: 10 }} />
    ) : null;
    if (menu.child && menu.child.length) {
      return (
        <Menu.SubMenu
          key={menu.code}
          menutype={menu.type}
          title={
            <span>
              {MenuIcon}
              <span>{menu.name}</span>
            </span>
          }
        >
          {this.menuRender(menu.child)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={menu.path} menutype={menu.type}>
        {MenuIcon}
        <span>{menu.name}</span>
      </Menu.Item>
    );
  });
};

export default props => {
  const { state: collapsed, toggle, setTrue, setFalse } = useBoolean(false);
  let menus = JSON.parse(localStorage.getItem('af-menus'));
  console.log(menus);
  return (
    <div className={styles.menuWrap}>
      <Menu
        // defaultSelectedKeys={['1']}
        // defaultOpenKeys={['sub1']}
        className="leftMenu"
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
      >
        {/*{menuRender(menus)}*/}
        <Menu.Item key="1" icon={<i className="iconfont iconbeipianjine" />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
        <Menu.Item key="3" icon={<ContainerOutlined />}>
          Option 3
        </Menu.Item>
        <Menu.SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub2"
          icon={<AppstoreOutlined />}
          title="Navigation Two"
        >
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.SubMenu key="sub3" title="Submenu">
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      </Menu>
    </div>
  );
};
