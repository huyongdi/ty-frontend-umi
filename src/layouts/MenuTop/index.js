import React, { useState, useEffect } from 'react';
import { Modal, Dropdown } from 'antd';
import { useBoolean } from '@umijs/hooks';
import axios from 'axios';
import menuIcon from '@utils/menuIcon';
import { Menu } from 'antd';
import { useModel } from 'umi';

import { AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';

import styles from './index.less';
import logo from '@img/logo.png';

// 监听用户，3分钟不操作的时候就去请求接口
let moveInterval = null;
const userAction = unread => {
  let definitionTime = 3 * 60 * 1000; // 3 * 60 * 1000 // 定义时间为3分钟
  let remainTime = definitionTime; //  剩余时间

  // 定义的时间进行倒计时
  moveInterval = setInterval(() => {
    remainTime -= 1000;
    if (remainTime === 0) {
      remainTime = definitionTime;
      showModalAndSendMsg(unread);
    }
  }, 1000);

  // 用户做了操作时候就重置剩余时间
  document.onmousemove = () => {
    // console.log('操作了鼠标')
    remainTime = definitionTime;
  };
  document.onkeydown = () => {
    // console.log('操作了键盘')
    remainTime = definitionTime;
  };
};
// 每超过3分钟不操作，则发请求和弹框
const showModalAndSendMsg = unread => {
  if (unread <= 0) return;
  if (document.getElementsByClassName('userNoticeModal').length === 0) {
    Modal.info({
      className: 'userNoticeModal',
      title: '您有待操作信息，请及时反馈！',
      okText: '知道了',
    });
  }
  axios.post('antifraud//smsTeamplte/threeMinuteSendSms').then(res => {
    console.log(res);
  });
};

// 消息websocket
const getMessage = (unread, setUnread) => {
  const player = document.getElementById('player');
  const {
    accountInfo: {
      personInfo: { idCard },
    },
  } = JSON.parse(localStorage.getItem('af-user'));
  let ws = new WebSocket(
    `ws://${window.location.hostname}:9920/websocket/${idCard}/${idCard}/1`,
  );
  ws.onopen = () => {
    // console.log('已连上')
  };
  ws.onmessage = res => {
    let wsObj = JSON.parse(JSON.parse(res.data).content);
    setUnread(wsObj.increment ? unread + wsObj.value : unread - wsObj.value);
    if (wsObj.increment) {
      player.src = require(`@media/type${wsObj.level || 1}.mp3`);
      player.play();
    }
  };
  ws.onclose = () => {
    // console.log('已关闭')
  };
};

// 站内信相关
const getMsgCount = async setUnread => {
  const res = await axios.post('antifraud/fraud/stat/unfeedback');
  setUnread(res);
};

// 刷新预警列表
const refreshList = async () => {};

export default props => {
  const [unread, setUnread] = useState(0);
  const { state, toggle, setTrue, setFalse } = useBoolean(false);
  const {
    activeMenuInfo: { top },
    setMenuActive,
  } = useModel('system') || {};

  const menus = JSON.parse(localStorage.getItem('af-menus'));
  const {
    accountInfo: { name },
  } = JSON.parse(localStorage.getItem('af-user'));
  const BACK_URL = process.env.BACK_PATH || `${window.location.hostname}:89`;
  const token = localStorage.getItem('af-token');
  useEffect(() => {
    getMsgCount(setUnread);
    getMessage(unread, setUnread);
    userAction(unread);
    return () => {
      clearInterval(moveInterval);
    };
  }, []);
  // 退出登录
  const logout = () => {
    localStorage.clear();
    // window.location.reload();
    props.history.length = 0;
    props.history.push('/login');
  };
  return (
    <div className={styles.headerWrap}>
      <audio id="player">
        <source src={null} />
      </audio>
      <img className={styles.logo} src={logo} alt="logo" />
      <span className={styles.sysName}>重庆市反诈狙击手</span>
      <ul className={styles.main}>
        {menus.map(item => {
          return (
            <li
              key={item.name}
              className={top === item.code ? styles.liIn : ''}
              onClick={() => setMenuActive({ top: item.code })}
            >
              <i className={`${menuIcon(item.name)} iconfont`} />
              <span>{item.name}</span>
            </li>
          );
        })}
      </ul>
      <div
        className={styles.msg}
        onMouseEnter={setTrue}
        onMouseLeave={setFalse}
      >
        <i className={`iconfont iconxiaoxi ${styles.img}`} />
        <span className={styles.title}>消息</span>
        {unread > 0 && <span className={styles.unread}>{unread}</span>}
      </div>
      <div className={styles.userName}>
        <Dropdown
          overlay={
            <Menu selectedKeys={[]} style={{ marginTop: 0 }}>
              <Menu.Item
                icon={<AppstoreOutlined />}
                onClick={() =>
                  window.open(`http://${BACK_URL}/login?token=${token}`)
                }
              >
                后台管理
              </Menu.Item>
              <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
                退出登录
              </Menu.Item>
            </Menu>
          }
        >
          <label className={styles.nameLabel}>{name}</label>
        </Dropdown>
      </div>
      {unread > 0 && (
        <div
          className={`${styles.hideRefresh} ${state ? '' : 'hide'}`}
          onMouseEnter={setTrue}
          onMouseLeave={setFalse}
        >
          <span className={styles.tra} />
          <span className={styles.count}>
            当前待处理{unread >= 0 ? unread : 0}条
          </span>
          <span onClick={refreshList}>点击刷新</span>
        </div>
      )}
    </div>
  );
};
