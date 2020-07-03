import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  message,
  Modal,
  Tooltip,
  Select,
  DatePicker,
  Statistic,
  Checkbox,
} from 'antd';
import { useEventTarget, useDebounceFn } from '@umijs/hooks';
import axios from 'axios';
import styles from './index.less';
import { useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import mapP from '@img/personM.png';
import reg from '@utils/reg';
import { Empty } from '@components';

const { RangePicker } = DatePicker;
const { Countdown } = Statistic;

export default props => {
  const {
    userInfo: {
      accountInfo: {
        personInfo: { idCard },
        name,
      },
    },
  } = useSelector(state => state.system);
  let { nextOrg, identify } = useSelector(state => state.backEnd);
  identify = 3;
  const [smsModal, setSMSModal] = useImmer({
    show: false,
    detail: null,
  });
  const [feedBackData, setFeedBack] = useImmer({
    // 反馈处置的所有信息
    phoneShow: identify !== 3, // 顶部带checkbox的
    smsShow: false,
    doorShow: identify === 3,
    subTitle: identify === 3 ? 3 : 1, // 顶部下的切换tab 电话 短信 上门 账号
    opType: 1, // 具体的操作类型： 1-本人-接通-未被骗-自主防范（初始化） 2-本人-未接通 3-本人-接通-未被骗-及时劝阻 4-本人-接通-已被骗 5-亲友 6-短信预警-模板发送 7-短信预警-自定义 8-上门处置
    opArr: [1, 6, 8], // 存储 电话 短信 上门的状态，保证前后再回来，optype还是对应的

    accessFailure: null, // 电话未接通情况
    level: null, // 预警程度
    fraudType: null, // 诈骗类型
    smsContent: null, // 短信内容
    smsInId: null, // 激活的smsID
    organCodeS: null, // 派出所
    feedbackDesc: null, // 处置内容
    visitResult: null, // 上门情况
    victim: null, // 受害人：包含发送对象
    moneyDefraud: null, // 受骗金额
    moneyDissuade: null, // 劝阻金额
    fraudTime: null, // 受骗时间

    version: null, // 后端的版本号
  });

  useEffect(() => {
    for (let i in props) {
      if (Object.keys(feedBackData).includes(i)) {
        // 定义了key的值才进行填充，避免操作了不可变数据不知道
        setFeedBack(draft => {
          draft[i] = props[i];
        });
      }
    }
  }, [props.id]);

  //  1-本人-接通-未被骗-自主防范（初始化） 2-本人-未接通 3-本人-接通-未被骗-及时劝阻 4-本人-接通-已被骗 5-亲友 6-短信预警-模板发送 7-短信预警-自定义 8-上门处置
  const changeData = (key, val) => {
    setFeedBack(draft => {
      draft[key] = val;
      // 更新状态
      if (key === 'opType') {
        let index = 0;
        if ([1, 2, 3, 4, 5].includes(val)) {
          index = 0;
        } else if ([6, 7].includes(val)) {
          index = 1;
        } else {
          index = 2;
        }
        draft.opArr[index] = val;
      }

      // 切换时，取状态
      if (key === 'subTitle') {
        let type = 1;
        if (val === 1) {
          // 切换到电话预警
          type = feedBackData.opArr[0];
        } else if (val === 2) {
          // 切换到短信预警
          type = feedBackData.opArr[1];
        } else if (val === 3) {
          // 切换到上门处置
          type = feedBackData.opArr[2];
        }
        draft.opType = type;
      }
    });
  };

  // 短信内容查看弹框
  const clickLook = item => () => {
    setSMSModal(draft => {
      draft.show = true;
      draft.detail = item;
    });
  };

  const FrontSvg = props => (
    <svg className={props.className} aria-hidden="true" style={props}>
      <use xlinkHref={props.name} />
    </svg>
  );

  // 提交
  const saveCZ = () => {
    czAxios('STRAIGHT');
  };

  const againCZ = () => {
    czAxios('AGAIN');
  };

  const refreshList = () => {
    const { axiosType } = props;
    if (axiosType === 'net') {
      props.history.push('/wnyjxx');
    } else {
      props.history.push('/yjxx');
    }
  };

  const { PHONE_TYPE, FRAUD_LEVEL, FRAUD_TYPE, peopleArr, smsArr, id } = props;
  const {
    phoneShow,
    smsShow,
    doorShow,
    subTitle,
    opType,
    victim,
    visitResult,
    feedbackDesc,
    moneyDefraud,
    level,
    fraudType,
    organCodeS,
    accessFailure,
    moneyDissuade,
    fraudTime,
    smsInId,
    smsContent,
    opArr,
    version,
  } = feedBackData;

  const czAxios = toBack => {
    // phoneShow smsShow doorShow opArr 前三个代表是否勾选了相应类型，opArr用来获取每个类型选的什么
    //  1-本人-接通-未被骗-自主防范（初始化） 2-本人-未接通 3-本人-接通-未被骗-及时劝阻 4-本人-接通-已被骗 5-亲友 6-短信预警-模板发送 7-短信预警-自定义 8-上门处置
    let called = null, // 是否接通 电话情况: 1-接通,2-未接通 ,
      defrauded = null, // 是否被骗 1-未被骗,2-已被骗
      dissuaded = null, // 劝阻结果:1-自主防范,2-及时劝阻
      targeted = null; // 联系对象: 1-本人,2-亲友
    if (phoneShow) {
      if (opArr[0] === 1) {
        called = 1;
        defrauded = 1;
        dissuaded = 1;
        targeted = 1;
      } else if (opArr[0] === 2) {
        called = 2;
        targeted = 1;
      } else if (opArr[0] === 3) {
        called = 1;
        defrauded = 1;
        dissuaded = 2;
        targeted = 1;
      } else if (opArr[0] === 4) {
        called = 1;
        defrauded = 2;
        targeted = 1;
      } else if (opArr[0] === 5) {
        targeted = 2;
      }
    }

    let params = {
      fraudId: id,
      moneyDefraud: moneyDefraud,
      moneyDissuade: moneyDissuade,
      phone: {
        accessFailure: accessFailure,
        called,
        defrauded,
        dissuaded,
        fraudTime: fraudTime ? fraudTime.valueOf() : null, // 受骗时间
        fraudType: fraudType, // 诈骗类型
        riskLevel: level, // 预警程度
        // "relation": "string", // 亲友的关系
        // "targetId": "string", // 亲友的身份证号
        targeted,
      },
      sms: {
        smsContent: smsContent,
        smsTemplateId: opArr[1] === 6 ? smsInId : null,
      },
      submitType: toBack,
      version,
      visit: {
        feedbackDesc: feedbackDesc, // 上门处置
        organCode: organCodeS, // 派出所
        visitResult: visitResult, // 上门情况
        fraudType: fraudType, // 诈骗类型
        riskLevel: level, // 预警程度
        fraudTime: fraudTime ? fraudTime.valueOf() : null, // 受骗时间
      },
    };

    // 做一些判断，来弹出提示并阻止请求
    let canAxios = true;
    let beforeMessage = null;
    if (smsShow) {
      if (!params.sms.smsContent) {
        beforeMessage = '您选择了短信预警但未处理，请处理！';
      }
    }
    if (params.moneyDefraud && !reg.float2.test(params.moneyDefraud)) {
      beforeMessage = '受骗金额最多为两位小数！';
    }
    if (params.moneyDissuade && !reg.float2.test(params.moneyDissuade)) {
      beforeMessage = '劝阻金额最多为两位小数！';
    }

    if (beforeMessage) {
      message.warn(beforeMessage);
      canAxios = false;
    }

    if (canAxios) {
      axios.post('antifraud/fraud/feedback/handle', params).then(res => {
        if (res) {
          let msg = '提交成功';
          if (phoneShow) {
            // 选择了电话
            if (smsShow) {
              // 选择了短信
              if (!doorShow) {
                // 没有选择上门
                msg = `当前预警已电话反馈&短信反馈`;
              } else {
                // 选择了上门
                if (!organCodeS) {
                  msg = '当前预警已电话&短信反馈且不需上门处置';
                } else {
                  let orgName = null;
                  nextOrg.forEach(item => {
                    if (item.code === organCodeS) {
                      orgName = item.name;
                    }
                  });
                  msg = `当前预警已电话&短信反馈且下发至${orgName}，请等待再次反馈`;
                }
              }
            } else {
              if (!doorShow) {
                msg = '当前预警已电话反馈';
              } else {
                if (!organCodeS) {
                  msg = '当前预警已电话&短信反馈且不需上门处置';
                } else {
                  let orgName = null;
                  nextOrg.forEach(item => {
                    if (item.code === organCodeS) {
                      orgName = item.name;
                    }
                  });
                  msg = `当前预警已电话&短信反馈且下发至${orgName}，请等待再次反馈`;
                }
              }
            }
          }
          message.success(msg);
          refreshList();
        }
      });
    }
  };

  return (
    <div className={styles.cz}>
      <span className="lineT">处置反馈</span>
      <div className={styles.title}>
        {identify !== 3 && (
          <div className={`${styles.one} ${styles.in}`}>
            <Checkbox checked={true} />
            <span>电话预警</span>
            <i className="iconfont icondianhua" />
          </div>
        )}
        {identify !== 3 && (
          <div
            className={`${styles.one} ${smsShow && styles.in}`}
            onClick={() => changeData('smsShow', !smsShow)}
          >
            <Checkbox checked={smsShow} />
            <span>短信预警</span>
            <i className="iconfont iconduanxinyujing" />
          </div>
        )}
        {identify !== 1 && (
          <div
            className={`${styles.one} ${doorShow && styles.in}`}
            onClick={() => changeData('doorShow', !doorShow)}
          >
            <Checkbox checked={doorShow} />
            <span>上门处置</span>
            <i className="iconfont iconshangmenchuzhi" />
          </div>
        )}
        <span
          className={`${styles.one}`}
          onClick={() =>
            window.open(
              `http://77.1.24.7:8981/fdzptcq/defaultKszf?sfzh=${idCard}`,
            )
          }
        >
          止付
        </span>
      </div>
      <div className={styles.titleShow}>
        {phoneShow && (
          <span
            className={`${styles.one} ${subTitle === 1 && styles.in}`}
            onClick={() => changeData('subTitle', 1)}
          >
            电话预警
          </span>
        )}
        {smsShow && (
          <span
            className={`${styles.one} ${subTitle === 2 && styles.in}`}
            onClick={() => changeData('subTitle', 2)}
          >
            短信预警
          </span>
        )}
        {doorShow && (
          <span
            className={`${styles.one} ${subTitle === 3 && styles.in}`}
            onClick={() => changeData('subTitle', 3)}
          >
            上门处置
          </span>
        )}
      </div>
      <div className={`${styles.content}`}>
        {/*-----电话预警-----*/}
        <div className={`${styles.phoneWrap}  ${subTitle === 1 ? '' : 'hide'}`}>
          <div className={`${styles.one}`}>
            <span className={styles.leftName}>联系对象</span>
            <div
              onClick={e => changeData('opType', 1)}
              className={`${styles.top} ${(opType === 1 ||
                opType === 2 ||
                opType === 3 ||
                opType === 4) &&
                styles.in}`}
            >
              <i
                className={`iconfont iconbenren ${styles.topImg} ${styles.br}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>本人</span>
            </div>
            <div
              className={`${styles.bot} ${opType === 5 && styles.in}`}
              onClick={e => changeData('opType', 5)}
            >
              <i
                className={`iconfont iconxingzhuangjiehe ${styles.topImg} ${styles.qy}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>亲友</span>
            </div>
          </div>

          <FrontSvg
            {...{
              name: '#iconxiayibujiantou2',
              className: `${styles.svg} ${
                opType === 1 ||
                opType === 2 ||
                opType === 3 ||
                opType === 4 ||
                opType === 5
                  ? ''
                  : 'hide'
              }`,
            }}
          />

          <div
            className={`${styles.one} ${
              opType === 1 || opType === 2 || opType === 3 || opType === 4
                ? ''
                : 'hide'
            }`}
          >
            <span className={styles.leftName}>电话接通</span>
            <div
              className={`${styles.top} ${styles.green} ${(opType === 1 ||
                opType === 3 ||
                opType === 4) &&
                styles.in}`}
              onClick={e => changeData('opType', 1)}
            >
              <i
                className={`iconfont iconjietongdianhua ${styles.topImg} ${styles.dhin}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>接通</span>
            </div>
            <div
              className={`${styles.bot} ${styles.red} ${opType === 2 &&
                styles.in}`}
              onClick={e => changeData('opType', 2)}
            >
              <i
                className={`iconfont iconweijietongdianhua ${styles.topImg} ${styles.dhout}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>未接通</span>
            </div>
          </div>

          <FrontSvg
            {...{
              name: '#iconxiayibujiantou2',
              className: `${styles.svg} ${
                opType === 1 || opType === 2 || opType === 3 || opType === 4
                  ? ''
                  : 'hide'
              }`,
            }}
          />

          {/*电话未接通进行填写*/}
          <div
            className={`${styles.one} ${styles.notConnect} ${
              opType === 2 ? '' : 'hide'
            }`}
          >
            <span className={`${styles.leftName} ${styles.leftNameTop}`}>
              请填写反馈内容
            </span>
            <div className={styles.connectOne}>
              <div>未接电话情况：</div>
              <Select
                className={styles.warp}
                value={accessFailure || undefined}
                placeholder="请选择未接电话情况"
                onChange={v => changeData('accessFailure', v)}
              >
                {PHONE_TYPE &&
                  PHONE_TYPE.map(item => {
                    return (
                      <Select.Option key={item.cfgKey} value={item.cfgKey}>
                        {item.cfgValue}
                      </Select.Option>
                    );
                  })}
              </Select>
            </div>
          </div>

          <div
            className={`${styles.one} ${
              opType === 1 || opType === 3 || opType === 4 ? '' : 'hide'
            }`}
          >
            <span className={styles.leftName}>是否被骗</span>
            <div
              className={`${styles.top} ${styles.green} ${(opType === 1 ||
                opType === 3) &&
                styles.in}`}
              onClick={e => changeData('opType', 1)}
            >
              <i
                className={`iconfont iconweibeipian ${styles.topImg} ${styles.pian}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>未被骗</span>
            </div>
            <div
              className={`${styles.bot} ${styles.red} ${opType === 4 &&
                styles.in}`}
              onClick={e => changeData('opType', 4)}
            >
              <i
                className={`iconfont iconyibeipian ${styles.topImg} ${styles.pianY}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>已被骗</span>
            </div>
          </div>

          <FrontSvg
            {...{
              name: '#iconxiayibujiantou2',
              className: `${styles.svg} ${
                opType === 1 || opType === 3 || opType === 4 ? '' : 'hide'
              }`,
            }}
          />

          <div
            className={`${styles.one} ${
              opType === 1 || opType === 3 ? '' : 'hide'
            }`}
          >
            <span className={`${styles.leftName} ${styles.leftNameTop}`}>
              是否劝阻后止付
            </span>
            <div
              className={`${styles.top} ${opType === 1 && styles.in}`}
              onClick={e => changeData('opType', 1)}
            >
              <i
                className={`iconfont iconzizhufangfan ${styles.topImg} ${styles.pian}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>自主防范意识</span>
            </div>
            <div
              className={`${styles.bot} ${styles.red} ${opType === 3 &&
                styles.in}`}
              onClick={e => changeData('opType', 3)}
            >
              <i
                className={`iconfont iconjishiquanzu ${styles.topImg} ${styles.qz}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>及时劝阻</span>
            </div>
          </div>

          <FrontSvg
            {...{
              name: '#iconxiayibujiantou2',
              className: `${styles.svg} ${opType === 3 ? '' : 'hide'}`,
            }}
          />

          <div
            className={`${styles.one} ${styles.noSmall} ${
              styles.fkOne
            } ${opType === 4 && styles.bpOne} ${
              opType === 3 || opType === 4 ? '' : 'hide'
            }`}
          >
            <span className={`${styles.leftName} ${styles.leftNameTop}`}>
              请填写反馈内容
            </span>
            {opType === 4 && (
              <div className={styles.fkOne}>
                <span>受骗金额(元)</span>
                <Input
                  className={styles.warp}
                  value={moneyDefraud || ''}
                  onChange={e => changeData('moneyDefraud', e.target.value)}
                />
              </div>
            )}
            <div className={styles.fkOne}>
              <span>劝阻金额(元)</span>
              <Input
                className={styles.warp}
                value={moneyDissuade}
                onChange={e => changeData('moneyDissuade', e.target.value)}
              />
            </div>
            <div className={styles.fkOne}>
              <span className="required">受骗时间</span>
              <DatePicker
                className={styles.warp}
                showTime={props.showTime}
                format={props.pickFormat}
                placeholder="请选择受骗时间"
                value={fraudTime}
                onChange={date => changeData('fraudTime', date)}
              />
            </div>
            <div className={styles.fkOne}>
              <span className="required">预警程度</span>
              <Select
                className={styles.warp}
                value={level || undefined}
                placeholder="请选择预警程度"
                onChange={v => changeData('level', v)}
              >
                {FRAUD_LEVEL &&
                  FRAUD_LEVEL.map(item => {
                    return (
                      <Select.Option key={item.cfgKey} value={item.cfgKey}>
                        {item.cfgValue}
                      </Select.Option>
                    );
                  })}
              </Select>
            </div>
            <div className={styles.fkOne}>
              <span className="required">诈骗类型</span>
              <Select
                className={styles.warp}
                value={fraudType || undefined}
                placeholder="请选择诈骗类型"
                onChange={v => changeData('fraudType', v)}
              >
                {FRAUD_TYPE &&
                  FRAUD_TYPE.map(item => {
                    return (
                      <Select.Option key={item.cfgKey} value={item.cfgKey}>
                        {item.cfgValue}
                      </Select.Option>
                    );
                  })}
              </Select>
            </div>
          </div>

          {/*选择亲友之后的内容*/}
          <div
            className={`${styles.qyContent} ${styles.one} ${
              opType === 5 ? '' : 'hide'
            }`}
          >
            <span className={styles.leftName}>选择亲友</span>
            {peopleArr &&
              peopleArr.map(item => {
                return (
                  <div
                    key={item.fid}
                    className={`${styles.qyOne} ${
                      item && item.in ? styles.in : ''
                    }`}
                  >
                    <img
                      src={
                        item.photo
                          ? `data:image/jpeg;base64,${item.photo}`
                          : mapP
                      }
                      alt=""
                    />
                    <span className={styles.name}>{item.xm}</span>
                    <span className={styles.idcard}>{item.sfzh}</span>
                    <span className={styles.maybe}>
                      <i className="iconfont iconkenengguanxi" />
                      可能关系：{item.gx}
                    </span>
                    <Tooltip
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      placement="topLeft"
                      title={item.lxfs}
                      arrowPointAtCenter
                    >
                      <span className={styles.tel}>
                        Tel：{item.lxfs || '--'}
                      </span>
                    </Tooltip>
                  </div>
                );
              })}
            {(!peopleArr || peopleArr.length === 0) && (
              <Empty className={styles.noData} content="暂无关系人" />
            )}
          </div>
        </div>

        {/*-----短信预警-----*/}
        <div className={`${styles.smsWrap} ${subTitle === 2 ? '' : 'hide'}`}>
          <div className={`${styles.one} `}>
            <span className={styles.leftName}>发送方式</span>
            <div
              className={`${styles.top} ${(opType === 6 || opType === 8) &&
                styles.in}`}
              onClick={e => changeData('opType', 6)}
            >
              <i
                className={`iconfont iconduanxinmoban ${styles.topImg} ${styles.br}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>模板发送</span>
            </div>
            <div
              className={`${styles.bot} ${opType === 7 && styles.in}`}
              onClick={e => {
                changeData('smsContent', '');
                changeData('opType', 7);
              }}
            >
              <i
                className={`iconfont iconzidingyi ${styles.topImg} ${styles.zdy}`}
              />
              <FrontSvg
                {...{
                  name: '#iconxuanzhong',
                  className: `${styles.gx} ${styles.rSvg}`,
                }}
              />
              <span>自定义</span>
            </div>
          </div>

          <FrontSvg
            {...{
              name: '#iconxiayibujiantou2',
              className: `${styles.svg} ${
                opType === 6 || opType === 7 || opType === 8 ? '' : 'hide'
              }`,
            }}
          />

          {/*已有的模板*/}
          <div
            className={`${styles.one} ${styles.noSmall} ${styles.dxContent} ${
              opType === 6 ? '' : 'hide'
            }`}
          >
            <span
              className={`${styles.leftName} ${styles.leftNameTop}`}
              style={{ height: 145 }}
            >
              选择发送模板
            </span>
            {smsArr &&
              smsArr.map(item => {
                return (
                  <div
                    className={`${styles.mbOne} ${
                      item.id === smsInId ? styles.in : ''
                    }`}
                    key={item.id}
                    onClick={() => {
                      changeData('smsInId', item.id);
                      changeData('smsContent', item.content);
                    }}
                  >
                    <span className={styles.mbT}>{item.title}</span>
                    <span className={styles.mbC}>{item.content}</span>
                    <span className={styles.look} onClick={clickLook(item)}>
                      查看
                    </span>
                  </div>
                );
              })}
          </div>
          {/*自定义模板*/}
          <div
            className={`${styles.one} ${styles.dxContent} ${
              opType === 7 || opType === 8 ? '' : 'hide'
            }`}
          >
            <span
              className={`${styles.leftName} ${styles.leftNameTop}`}
              style={{ height: 125, top: 90 }}
            >
              {opType === 7 ? '自定义短信' : '发送模板'}
            </span>
            <div className={styles.textareaOne}>
              <span className="required">短信内容：</span>
              <Input.TextArea
                type="text"
                placeholder="请录入短信内容"
                value={smsContent}
                className={styles.dxC}
                onChange={e => changeData('smsContent', e.target.value)}
              />
            </div>
            <div className={styles.textareaOne}>
              <span>发送对象：{(victim && victim.phone) || '--'}</span>
              {/*<Input type="text" disabled value={victim && victim.phone || '--'}/>*/}
            </div>
          </div>
        </div>

        {/*上门处置*/}
        <div
          className={`${styles.one} ${styles.doorWrap} ${
            subTitle === 3 ? '' : 'hide'
          }`}
          style={{ width: identify !== 2 ? 700 : 500, padding: '10px 50px' }}
        >
          <span className={`${styles.leftName} ${styles.leftNameTop}`}>
            请填写上门情况
          </span>
          {identify !== 3 && (
            <div className={styles.fkOne} style={{ float: 'right' }}>
              <div style={{ marginBottom: 10 }}>派出所：</div>
              <Select
                placeholder={'请选择派出所' || undefined}
                className={styles.warp}
                value={organCodeS}
                onChange={v => changeData('organCodeS', v)}
              >
                <Select.Option value={null}>无须上门处置</Select.Option>
                {nextOrg.map(item => {
                  return (
                    <Select.Option key={item.code} value={item.code}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
          )}
          {identify !== 2 && (
            <>
              <div className={styles.fkOne}>
                <div className="required">上门情况：</div>
                <Select
                  className={styles.warp}
                  value={visitResult || undefined}
                  placeholder="请选择上门情况"
                  onChange={v => changeData('visitResult', v)}
                  style={{ marginTop: 10 }}
                >
                  <Select.Option value="1">已上门劝阻</Select.Option>
                  <Select.Option value="2">无效上门</Select.Option>
                </Select>
              </div>
              {visitResult !== '2' && (
                <>
                  <div className={styles.fkOne}>
                    <div className="required">处置内容：</div>
                    <Select
                      className={styles.warp}
                      value={feedbackDesc || undefined}
                      placeholder="请选择处置内容"
                      onChange={v => changeData('feedbackDesc', v)}
                      style={{ marginTop: 10 }}
                    >
                      <Select.Option value="1">已被骗</Select.Option>
                      <Select.Option value="2">未被骗</Select.Option>
                      <Select.Option value="3">未知</Select.Option>
                    </Select>
                  </div>
                  <div className={styles.fkOne}>
                    <span>受骗金额(元)</span>
                    <Input
                      className={styles.warp}
                      value={moneyDefraud || ''}
                      onChange={e => changeData('moneyDefraud', e.target.value)}
                    />
                  </div>
                  <div className={styles.fkOne}>
                    <span>劝阻金额(元)</span>
                    <Input
                      className={styles.warp}
                      value={moneyDissuade}
                      onChange={e =>
                        changeData('moneyDissuade', e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.fkOne}>
                    <span className={feedbackDesc === '1' ? 'required' : ''}>
                      受骗时间
                    </span>
                    <DatePicker
                      className={styles.warp}
                      showTime={props.showTime}
                      format={props.pickFormat}
                      placeholder="请选择受骗时间"
                      value={fraudTime}
                      onChange={date => changeData('fraudTime', date)}
                    />
                  </div>
                  <div className={`${styles.fkOne} ${styles.rightSelect1}`}>
                    <span className="required">预警程度</span>
                    <Select
                      className={styles.warp}
                      value={level || undefined}
                      placeholder="请选择预警程度"
                      onChange={v => changeData('level', v)}
                    >
                      {FRAUD_LEVEL &&
                        FRAUD_LEVEL.map(item => {
                          return (
                            <Select.Option
                              key={item.cfgKey}
                              value={item.cfgKey}
                            >
                              {item.cfgValue}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </div>
                  <div className={`${styles.fkOne} ${styles.rightSelect2}`}>
                    <span className="required">诈骗类型</span>
                    <Select
                      className={styles.warp}
                      value={fraudType || undefined}
                      placeholder="请选择诈骗类型"
                      onChange={v => changeData('fraudType', v)}
                    >
                      {FRAUD_TYPE &&
                        FRAUD_TYPE.map(item => {
                          return (
                            <Select.Option
                              key={item.cfgKey}
                              value={item.cfgKey}
                            >
                              {item.cfgValue}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className={`${styles.btn} ${subTitle ? '' : 'hide'}`} id="btnWrap">
        {identify === 2 && organCodeS ? (
          ''
        ) : (
          <span onClick={saveCZ} className={styles.submit}>
            <i className="iconfont icontijiao" />
            直接提交
          </span>
        )}
        <span onClick={againCZ} className={styles.submitAgain}>
          需要再次反馈
        </span>
      </div>

      <Modal
        title="短信详情"
        visible={smsModal.show}
        className={styles.smsModal}
        onCancel={() =>
          setSMSModal(draft => {
            draft.show = false;
          })
        }
        onOk={() =>
          setSMSModal(draft => {
            draft.show = false;
          })
        }
        centered={true}
        footer={null}
      >
        <div className={styles.one}>
          <span className="bold">短信标题：</span>
          {smsModal.detail && smsModal.detail.title}
        </div>
        <div className={`${styles.one} ${styles.smsC}`}>
          <span className="bold">短信内容：</span>
          {smsModal.detail && smsModal.detail.content}
        </div>
      </Modal>
    </div>
  );
};
