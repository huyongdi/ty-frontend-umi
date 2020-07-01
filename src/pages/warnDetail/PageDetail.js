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
  console.log(props);

  const {
    pageType,
    moment,
    dateFormat,
    repeat,
    time,
    organName,
    fraudFeedback,
    fraudReturnVisit,
  } = props;
  const repeatResult = repeat && repeat.length > 0 ? repeat[0] : {};
  const repeatDetail = repeat && repeat.length > 0 ? repeat[0].detail : {};

  return (
    <div className={styles.detailWrap}>
      {pageType === 4 && (
        <div className={styles.repeatTop}>
          <i className="iconfont iconClose-Circle-Fill" />
          <span className={styles.reason}>
            与{repeatResult.pusher}(
            {repeatResult.pushTime &&
              moment(repeatResult.pushTime).format(dateFormat)}
            ){repeatResult.reason}
          </span>
        </div>
      )}
      {pageType !== 4 && (
        <div className={styles.steps}>
          <div className={`${styles.one}`}>
            <i
              className={`iconfont iconxinxiyujing ${styles.icon1} ${styles.in}`}
            />
            <div>
              <span>信息预警</span>
              <span>接入 {moment(time).format(dateFormat)}</span>
            </div>
          </div>
          <i
            className={`iconfont iconxiayibujiantou1 ${
              pageType > 1 ? styles.in : ''
            } ${styles.arrow}`}
          />
          <div className={styles.one}>
            <i
              className={`iconfont iconxingzhuang ${styles.icon1} ${
                pageType > 1 ? styles.in : ''
              }`}
            />
            <div>
              <span>信息分发</span>
              <span>{organName}</span>
            </div>
          </div>
          <i
            className={`iconfont iconxiayibujiantou1 ${
              pageType > 2 ? styles.in : ''
            } ${styles.arrow}`}
          />
          <div className={styles.one}>
            <i
              className={`iconfont iconfankuichuzhi ${styles.icon1} ${
                pageType > 2 ? styles.in : ''
              }`}
            />
            <div>
              <span>
                反馈处置
                {pageType === 3 && (
                  <span className={styles.feedback}>
                    责任人：
                    {fraudFeedback &&
                      fraudFeedback.length !== 0 &&
                      fraudFeedback[fraudFeedback.length - 1].userName}
                  </span>
                )}
              </span>
              {pageType === 3 && (
                <span>
                  {fraudFeedback &&
                    fraudFeedback.length !== 0 &&
                    moment(
                      fraudFeedback[fraudFeedback.length - 1].updated,
                    ).format(dateFormat)}
                  <span className={styles.feedName}>
                    {fraudFeedback &&
                      fraudFeedback.length !== 0 &&
                      fraudFeedback[fraudFeedback.length - 1].handleType}
                  </span>
                </span>
              )}
            </div>
          </div>
          <i
            className={`iconfont iconxiayibujiantou1 ${
              pageType === 3 ? styles.in : ''
            } ${styles.arrow}`}
          />
          <div className={styles.one}>
            <i
              className={`iconfont iconyujinghuifang ${styles.icon1} 
          ${
            pageType === 3 && fraudReturnVisit && fraudReturnVisit.userName
              ? styles.in
              : ''
          }`}
            />
            <div>
              <span>
                预警回访
                {pageType === 3 && (
                  <span className={styles.feedback}>
                    责任人：{fraudReturnVisit && fraudReturnVisit.userName}
                  </span>
                )}
              </span>
              {pageType === 3 && (
                <span>
                  {' '}
                  {fraudReturnVisit &&
                    moment(fraudReturnVisit.updated).format(dateFormat)}
                  <span className={styles.feedName}>
                    {fraudReturnVisit &&
                      (fraudReturnVisit.truthful === 'N' ? '无效' : '有效')}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
