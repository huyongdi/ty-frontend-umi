import React, { useState, useEffect } from 'react';
import store from '../../stores';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.less';
import { Link } from 'umi';
import { useModel } from '../../.umi/plugin-model/useModel';
import login from '../../stores/models/login';

export default function(props) {
  // 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = useState(0);
  const { p, status } = useSelector(state => state.login);
  const dispatch = useDispatch();

  const { user } = useModel('test', model => ({ user: model.user }));

  const changeTheme = path => () => {
    localStorage.setItem('fk-theme', path);
    document.head.querySelector('#theme').setAttribute('href', path);
  };

  return (
    <div className={styles.abc}>
      {user}
      {status}
      {p && p.x}
      <Button type="primary">123</Button>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <Link to="/home">跳转到HOME</Link>
      <button onClick={() => dispatch.login.updateKey({ status: '123' })}>
        Click store
      </button>

      <Button onClick={changeTheme('/theme2.css')}>切换主题2</Button>
      <Button onClick={changeTheme('/theme1.css')}>切换主题1</Button>
    </div>
  );
}