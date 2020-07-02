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
import PageDetail from './PageDetail';
import PageRelation from './PageRelation';
import PageMap from './PageMap';

const { RangePicker } = DatePicker;
const { Countdown } = Statistic;

export default props => {
  const {
    state: { jumpInfo },
  } = useLocation();
  const [remainTime, setRemainTime] = useState(null);
  const [detailPage, setDetail] = useImmer({
    // 详情页面数据
    tType: 1,
  });
  const [peopleArr, setPeople] = useState(null);
  const [smsArr, setSms] = useState([]);

  let timeInterval = null; // 剩余时间interval

  useEffect(() => {
    getDetail();
    getSms();
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    if (detailPage.pushTime) {
      let ms =
        detailPage.pushTime + 24 * 60 * 60 * 1000 - props.moment().valueOf();
      if (ms >= 0) {
        setRemainTime(msToHMS(ms));
        timeInterval = setInterval(() => {
          setRemainTime(
            msToHMS(
              detailPage.pushTime +
                24 * 60 * 60 * 1000 -
                props.moment().valueOf(),
            ),
          );
        }, 1000);
      }
    }
  }, [detailPage.pushTime]);

  // 获取预警详情
  const getDetail = async () => {
    let detailUrl = null;
    if (jumpInfo.axiosType === 'phone') {
      detailUrl = `antifraud/fraud/detail/phone/${jumpInfo.id}`;
    } else if (jumpInfo.axiosType === 'net') {
      detailUrl = `antifraud/fraud/detail/net/${jumpInfo.id}`;
    } else if (jumpInfo.axiosType === 'repPhone') {
      detailUrl = `antifraud/fraud/wash/detail/phone/${jumpInfo.id}`;
    } else if (jumpInfo.axiosType === 'repNet') {
      detailUrl = `antifraud/fraud/wash/detail/net/${jumpInfo.id}`;
    }
    const result = await axios.get(detailUrl);
    getRelation(result.victim.idcard); // 带着受害人的身份证号去找亲友
    setDetail(draft => {
      for (let i in result) {
        draft[i] = result[i];
      }
    });
  };

  // 获取亲友信息
  const getRelation = async sfzhm => {
    let result = await axios.post('antifraud/relation/about', {
      sfzhm,
      formData: true,
    });
    result && setPeople(result);
  };

  // 获取短信模板
  const getSms = async () => {
    let result = await axios.post('antifraud/smsTeamplte/page', {
      pageNum: 1,
      pageSize: 1000,
      enabled: 'Y',
      // level: parseInt(obj.level),
      // fraudType: parseInt(obj.fraudType),
    });
    result && setSms(result.records);
  };

  const detailChange = (key, val) => {
    setDetail(draft => {
      draft[key] = val;
    });
  };

  const { tType } = detailPage;
  const { pageType } = jumpInfo; // 1 -预警信息 2-预警分发 3-已反馈 4-无效预警
  console.log(props);
  console.log(detailPage);
  console.log(jumpInfo);
  return (
    <div className={styles.mainWrap}>
      <div className={styles.top}>
        <div className={styles.topTitle}>
          <span
            className={`${tType === 1 && styles.in}`}
            onClick={() => detailChange('tType', 1)}
          >
            预警详情
          </span>
          <span
            className={`${tType === 2 && styles.in}`}
            onClick={() => detailChange('tType', 2)}
          >
            受害人关系
          </span>
          <span
            className={`${tType === 3 && styles.in}`}
            onClick={() => detailChange('tType', 3)}
          >
            受害人轨迹
          </span>
        </div>
        <div className={styles.remain}>
          <img src={timeImg} alt="" />
          {pageType === 3 ? (
            listResult.expired ? (
              '正常反馈'
            ) : (
              '超时反馈'
            )
          ) : (
            <Statistic
              value={remainTime}
              formatter={val => {
                if (!val) {
                  return <span className={styles.remainOut}>已超时</span>;
                } else {
                  return val.split('').map((item, index) => {
                    if (index === 0) {
                      return (
                        <>
                          <span>剩余时间：</span>
                          <span key={index} className={styles.countWrap}>
                            {item}
                          </span>
                        </>
                      );
                    } else {
                      return (
                        <span
                          key={index}
                          className={
                            item === ':' ? styles.colon : styles.countWrap
                          }
                        >
                          {item}
                        </span>
                      );
                    }
                  });
                }
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.main}>
        {tType === 1 && detailPage.id && (
          <PageDetail
            {...jumpInfo}
            {...props}
            {...detailPage}
            peopleArr={peopleArr}
            smsArr={smsArr}
          />
        )}
        {tType === 2 && <PageRelation />}
        {tType === 3 && <PageMap />}
      </div>
    </div>
  );
};
