import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  message,
  Modal,
  Select,
  DatePicker,
  Statistic,
} from 'antd';
import { useEventTarget, useDebounceFn } from '@umijs/hooks';
import axios from 'axios';
import styles from './index.less';
import { useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import { useParams, useLocation } from 'umi';
import timeImg from '@img/time.svg';
import msToHMS from '@utils/msToHMS';

const { RangePicker } = DatePicker;
const { Countdown } = Statistic;

export default props => {
  return <div className={styles.mapWrap}>地图</div>;
};
