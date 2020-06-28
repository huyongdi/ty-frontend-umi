import React, { useState, useEffect } from 'react';
import { Input, message, Modal } from 'antd';
import { useEventTarget } from '@umijs/hooks';
import axios from 'axios';
import { useModel } from 'umi';
import { useDispatch, useSelector } from 'react-redux';

import styles from './index.less';
import logo from '@img/logo.png';
import loginAccount from '@img/login-account.svg';
import loginPwd from '@img/login-password.svg';
import chromeImg from '@img/login-chrome.png';

// 判断chrome版本号
const judgeVersion = () => {
  let browser = {
    msie: false, // IE
    chrome: false, // chrome
    firefox: false,
    opera: false,
    safari: false,
    name: 'unknown',
    version: 0,
  };

  let userAgent = window.navigator.userAgent.toLowerCase();
  if (/(msie|chrome|firefox|opera|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
    browser[RegExp.$1] = true;
    browser.name = RegExp.$1;
    browser.version = RegExp.$2;
  } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) {
    browser.safari = true;
    browser.name = 'safari';
    browser.version = RegExp.$2;
  }

  if (!browser.chrome) {
    // message.warn('请使用chrome浏览器')
    Modal.warn({
      style: { top: 20 },
      className: 'loginNoticeModal',
      title: (
        <span>
          请使用chrome浏览器
          <img
            src={chromeImg}
            alt=""
            style={{ verticalAlign: 'top', marginLeft: 10, marginRight: 5 }}
          />
          <a
            href={`${window.location.hostname}/download/80.0.3987.87_chrome_installer64%E4%BD%8D.exe`}
          >
            Chrome浏览器
          </a>
        </span>
      ),
      footer: null,
      keyboard: false,
      width: 400,
    });
  } else {
    let versionArr = browser.version.split('.');
    if (parseInt(versionArr[0]) < 49) {
      // message.warn('您的浏览器版本过低，请点击页面下方的下载地址进行下载')
      Modal.warn({
        style: { top: 20 },
        className: 'loginNoticeModal',
        title: (
          <span>
            检测到当前浏览器版本过低，为保证正常使用，请下载新版
            <img
              src={chromeImg}
              alt=""
              style={{ verticalAlign: 'top', marginLeft: 10, marginRight: 5 }}
            />
            <a
              href={`${window.location.hostname}/download/80.0.3987.87_chrome_installer64%E4%BD%8D.exe`}
            >
              Chrome浏览器
            </a>
          </span>
        ),
        footer: null,
        keyboard: false,
        width: 650,
      });
    }
  }
};

export default props => {
  const [nameProps] = useEventTarget();
  const [pwdProps] = useEventTarget();
  // const { p, status } = useSelector(state => state.system)
  const { system } = useDispatch();

  useEffect(() => {
    judgeVersion();
  }, []);

  // 点击登录按钮
  const login = async () => {
    const userName = nameProps.value;
    const password = pwdProps.value;
    if (!userName) {
      message.warn('用户名不能为空!');
      return;
    }
    if (!password) {
      message.warn('密码不能为空!');
      return;
    }
    const loginRes = await axios.post('authcenter/auth/login', {
      userName,
      password,
      productCode: 'af',
    });
    if (loginRes) {
      localStorage.setItem('af-token', loginRes.token);
      const userInfoRes = await axios.post(
        'authcenter/auth/getUserInfoByToken',
        {
          token: loginRes.token,
        },
      );
      localStorage.setItem('af-user', JSON.stringify(userInfoRes));
      if (userInfoRes) {
        const menusRes = await axios('authcenter/menus/af');
        localStorage.setItem('af-menus', JSON.stringify(menusRes));
        system.updateKey([
          'activeMenu',
          {
            top: menusRes[0].code,
            menus: menusRes[0],
            openCode: [menusRes[0].child[0].code],
            selectCode: [menusRes[0].child[0].child[0].code],
          },
        ]);
        props.history.push('/yjxx');
      }
    }
  };

  return (
    <div className={styles.loginWrap}>
      <div className={styles.mainWrap}>
        <div className={styles.sysTitle}>
          <img src={logo} alt="logo" />
          <span className={styles.sysName}>重庆市反诈狙击手</span>
        </div>
        <div className={styles.welcome}>欢迎登录</div>
        <div className={styles.idWarp}>
          <img src={loginAccount} alt="登录图" />
          <Input {...nameProps} placeholder="请输入账号" />
        </div>
        <div className={styles.pwWarp}>
          <img src={loginPwd} alt="登录图" />
          <Input {...pwdProps} type="password" placeholder="请输入密码" />
        </div>
        <div className={styles.submitBtn} onClick={login}>
          登录
        </div>
        <div className={styles.copyright}>
          Copyright©2020 深圳市天彦通信股份有限公司
        </div>
      </div>
    </div>
  );
};
