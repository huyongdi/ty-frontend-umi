import React, { useEffect, useState } from 'react';
import { DatePicker, message, Statistic } from 'antd';
import axios from 'axios';
import styles from './index.less';
import { useImmer } from 'use-immer';
import { useLocation } from 'umi';
import timeImg from '@img/time.svg';
import msToHMS from '@utils/msToHMS';
import PageDetail from './PageDetail';
import PageRelation from './PageRelation';
import PageMap from './PageMap';
import { CloseOutlined } from '@ant-design/icons';
import dhbc from '@img/dianhuabc.png';
import guid from '@utils/createGuid';

const { RangePicker } = DatePicker;
const { Countdown } = Statistic;

export default props => {
  const {
    state: { jumpInfo }
  } = useLocation();
  const [remainTime, setRemainTime] = useState(null);
  const [detailPage, setDetail] = useImmer({
    // 详情页面数据
    tType: 1
  });
  const [peopleArr, setPeople] = useState(null);
  const [traArr, setTra] = useState([]);
  const [smsArr, setSms] = useState([]);
  const [repeatShow, setRepeat] = useState(false);

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
                props.moment().valueOf()
            )
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
    getTra(result.victim.phone); // 带着受害人的号码去查轨迹
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
      formData: true
    });
    result && setPeople(result);
  };

  // 获取轨迹信息
  const getTra = async phone => {
    let result = await axios.post('antifraud/trace/phone/between', {
      st: props
        .moment()
        .subtract(1, 'day')
        .valueOf(),
      et: props.moment().valueOf(),
      value: phone
    });
    if (result && Array.isArray(result)) {
      setTra(
        result.map(item => {
          item._key = 'id' + guid();
          item.lat = item.w;
          item.lng = item.j;
          return item;
        })
      );
    }
  };

  // 获取短信模板
  const getSms = async () => {
    let result = await axios.post('antifraud/smsTeamplte/page', {
      pageNum: 1,
      pageSize: 1000,
      enabled: 'Y'
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

  // 重复数据逻辑
  const showRepeat = () => {
    setRepeat(true);
  };

  // 加入黑名单
  const addToBlack = (id, type) => () => {
    let params = {
      target: id,
      targetType: type,
      type: 1
    };
    axios.post('antifraud/white/add', params).then(res => {
      if (res) {
        message.success('加入黑名单成功！');
      }
    });
  };

  const { tType, repeat, rawType, expired } = detailPage;
  const { pageType } = jumpInfo; // 1 -预警信息 2-预警分发 3-已反馈 4-无效预警
  const repeatDetail = repeat && repeat.length > 0 ? repeat[0].detail : {};

  return (
    <div className={`${styles.mainWrap} ${repeatShow && styles.in}`}>
      <div className={`${styles.normalWrap} ${repeatShow && styles.in}`}>
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
              expired ? (
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
              addToBlack={addToBlack}
            />
          )}
          {tType === 2 && <PageRelation peopleArr={peopleArr} />}
          {tType === 3 && (
            <PageMap {...jumpInfo} {...props} {...detailPage} traArr={traArr} />
          )}

          {(pageType === 1 || pageType === 2) &&
            tType === 1 &&
            repeat &&
            repeat.length > 0 && (
              <span className={styles.openData} onClick={showRepeat}>
                <i className="iconfont iconqizhi1" />
                {rawType === 8 ? '部级重复预警' : '互联网重复预警'}
              </span>
            )}
        </div>
      </div>

      {/*重复数据弹框*/}
      {repeatShow && (
        <div className={styles.repeatDiv}>
          <div className={styles.title}>
            {rawType === 8 ? '部级重复预警' : '互联网重复预警'}
            <CloseOutlined
              onClick={() => {
                setRepeat(false);
              }}
            />
          </div>
          <div className={styles.repeatWrap}>
            <div className={styles.yjData}>
              <span className="lineT">预警数据</span>
              <div className={styles.dataC}>
                <img src={dhbc} alt="图片" />
                <div className={styles.bcFont}>
                  <span className={styles.extCircle}>
                    <span className={styles.innCircle}>
                      {repeatDetail.levelDesc || repeatDetail.level}
                    </span>
                  </span>
                  <span className={styles.type} style={{ marginTop: 100 }}>
                    {repeatDetail.fraudTypeDesc || '--'}
                  </span>
                </div>
                <div className={styles.dataRight}>
                  <div>
                    <span className={styles.tName}>预警编号</span>
                    <span className={styles.tValue}>{repeatDetail.id}</span>
                    <span className={styles.tName}>受害人账号</span>
                    <span className={styles.tValue}>
                      {repeatDetail.victim && repeatDetail.victim.phone}
                    </span>
                  </div>
                  <div>
                    <span className={styles.tName}>交易时间</span>
                    <span className={styles.tValue}>
                      {repeatDetail.rawTime
                        ? props
                            .moment(repeatDetail.rawTime)
                            .format(props.dateFormat)
                        : '--'}
                    </span>
                    <span className={styles.tName}>交易金额(元)</span>
                    <span className={styles.tValue}>
                      {repeatDetail.money || '--'}
                    </span>
                  </div>
                  {jumpInfo.axiosType === 'net' ? (
                    <>
                      <div>
                        <span className={styles.tName}>受害人QQ</span>
                        <span className={styles.tValue}>
                          {repeatDetail.qq || '--'}
                        </span>
                        <span className={styles.tName}>受害人支付宝号</span>
                        <span className={styles.tValue}>
                          {repeatDetail.alipay || '--'}
                        </span>
                      </div>
                      <div>
                        <span className={styles.tName}>涉案网站</span>
                        <span className={styles.tValue}>
                          {repeatDetail.website || '--'}
                          {repeatDetail.website &&
                            !repeatDetail.blackListExist && (
                              <span
                                className={styles.rydangan}
                                onClick={addToBlack(
                                  repeatDetail.website,
                                  'WEBSITE'
                                )}
                              >
                                加入黑名单
                              </span>
                            )}
                          {repeatDetail.blackListExist && (
                            <span className={styles.inBlack}>已加入黑名单</span>
                          )}
                        </span>
                        <span className={styles.tName}>受害人IP归属</span>
                        <span className={styles.tValue}>
                          {repeatDetail.vimIpaScription || '--'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className={styles.tName}>推送次数</span>
                        <span className={styles.tValue}>
                          {repeatDetail.pushTimes || '--'}
                        </span>
                        <span className={styles.tName}>通话次数</span>
                        <span className={styles.tValue}>
                          {repeatDetail.callTimes || '--'}
                        </span>
                      </div>
                      <div>
                        <span className={styles.tName}>最近联系时间</span>
                        <span className={styles.tValue}>
                          {repeatDetail.latestTime
                            ? props
                                .moment(repeatDetail.latestTime)
                                .format(props.dateFormat)
                            : '--'}
                        </span>
                        <span className={styles.tName}>通话时长(秒)</span>
                        <span className={styles.tValue}>
                          {repeatDetail.callDuration || '--'}
                        </span>
                      </div>
                    </>
                  )}
                  <div>
                    <span className={styles.tName}>推送时间</span>
                    <span className={styles.tValue}>
                      {repeatDetail.pushTime
                        ? props
                            .moment(repeatDetail.pushTime)
                            .format(props.dateFormat)
                        : '--'}
                    </span>
                    <span className={styles.tName}>推送单位</span>
                    <span className={styles.tValue}>
                      {repeatDetail.pusher || '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.yjData} ${styles.dTop}`}>
              <span className="lineT">人员信息</span>
              <div className={styles.dataC}>
                <img src={dhbc} alt="图片" />
                <div className={styles.bcFont}>
                  <i className="iconfont icondianhua" />
                  <span className={styles.type}>电话预警</span>
                </div>
                <div className={styles.dataRight}>
                  <div>
                    <span className={styles.tName}>受害人号码</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.victim && repeatDetail.victim.phone) ||
                        '--'}
                    </span>
                    <span className={styles.tName}>嫌疑人号码</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.suspect && repeatDetail.suspect.phone) ||
                        '--'}
                      {repeatDetail.suspect && repeatDetail.suspect.phone && (
                        <span
                          className={styles.rydangan}
                          onClick={addToBlack(
                            repeatDetail.suspect && repeatDetail.suspect.phone,
                            'PHONE'
                          )}
                        >
                          <i className="iconfont iconrenyuandangan" />
                          加入黑名单
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className={styles.tName}>受害人姓名</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.victim && repeatDetail.victim.name) ||
                        '--'}
                    </span>
                    <span className={styles.tName}>嫌疑人姓名</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.suspect && repeatDetail.suspect.name) ||
                        '--'}
                    </span>
                  </div>
                  <div>
                    <span className={styles.tName}>受害人身份证号</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.victim && repeatDetail.victim.idcard) ||
                        '--'}
                      {repeatDetail.victim && repeatDetail.victim.idcard && (
                        <span className={styles.rydangan} />
                      )}
                    </span>
                    <span className={styles.tName}>嫌疑人身份证号</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.suspect && repeatDetail.suspect.idcard) ||
                        '--'}
                      {repeatDetail.suspect && repeatDetail.suspect.idcard && (
                        <span className={styles.rydangan}></span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className={styles.tName}>受害人银行卡号</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.victim && repeatDetail.victim.bankcard) ||
                        '--'}
                    </span>
                    <span className={styles.tName}>嫌疑人银行卡号</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.suspect &&
                        repeatDetail.suspect.bankcard) ||
                        '--'}
                    </span>
                  </div>
                  <div>
                    <span className={styles.tName}>受害人户籍地址</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.victim && repeatDetail.victim.bankcard) ||
                        '--'}
                    </span>
                    <span className={styles.tName}>嫌疑人户籍地址</span>
                    <span className={styles.tValue}>
                      {(repeatDetail.suspect &&
                        repeatDetail.suspect.bankcard) ||
                        '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
