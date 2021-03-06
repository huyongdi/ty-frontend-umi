import React, { useEffect } from 'react';
import { useBoolean } from '@umijs/hooks';
import menuIcon from '@utils/menuIcon';
import { Link } from 'umi';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';

import styles from './index.less';
import './menu.less';

const menuRender = menus => {
  return menus.child.map(menu => {
    if (menu.child.length === 0) {
      return (
        <Menu.Item
          key={menu.code}
          icon={<i className={`iconfont ${menuIcon(menu.name)}`} />}
        >
          <Link to={menu.path}>{menu.name}</Link>
        </Menu.Item>
      );
    } else {
      return (
        <Menu.SubMenu
          key={menu.code}
          title={menu.name}
          icon={<i className={`iconfont ${menuIcon(menu.name)}`} />}
        >
          {menuRender(menu)}
        </Menu.SubMenu>
      );
    }
  });
};

export default props => {
  const { state: collapsed, toggle, setTrue, setFalse } = useBoolean(false);
  const {
    activeMenu: { openCode, selectCode, menus },
  } = useSelector(state => state.system);
  return (
    <div className={styles.menuWrap}>
      <Menu
        key={selectCode}
        className="leftMenu"
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        defaultOpenKeys={openCode}
        defaultSelectedKeys={selectCode}
      >
        {menuRender(menus)}
      </Menu>
    </div>
  );
};
