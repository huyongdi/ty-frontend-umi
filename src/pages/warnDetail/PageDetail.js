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
import dhbc from '@img/dianhuabc.png';
import PageHandleFeedback from './PageHandleFeedback';
import { CloseOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Countdown } = Statistic;

export default props => {
  const [fraudInfo, setFraud] = useImmer({
    // 已反馈表格，反馈人和单位
    fkPerson: [],
    fkOrg: [],
  });
  useEffect(() => {
    props.fraudFeedback &&
      props.fraudFeedback.forEach(item => {
        setFraud(draft => {
          draft.fkPerson.push(item.userName);
          draft.fkOrg.push(item.organName || '--');
        });
      });
  }, []);

  // 跳转到人员档案页面
  const jumpToPerson = item => () => {};

  const {
    pageType,
    axiosType,
    moment,
    dateFormat,
    repeat,
    time,
    organName,
    fraudFeedback,
    fraudReturnVisit,
    levelDesc,
    level,
    fraudTypeDesc,
    id,
    victim,
    rawTime,
    money,
    qq,
    alipay,
    website,
    blackListExist,
    vimIpaScription,
    pushTimes,
    callTimes,
    latestTime,
    callDuration,
    pushTime,
    pusher,
    suspect,
    lawcase,
    rawType,
  } = props;
  const repeatResult = repeat && repeat.length > 0 ? repeat[0] : {};

  return (
    <>
      <div className={`${styles.detailWrap}`}>
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
                className={`iconfont iconyujinghuifang ${styles.icon1} ${
                  pageType === 3 &&
                  fraudReturnVisit &&
                  fraudReturnVisit.userName
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
        <div className={styles.yjData}>
          <span className="lineT">预警数据</span>
          <div className={styles.dataC}>
            <img src={dhbc} alt="图片" />
            <div className={styles.bcFont}>
              <span className={styles.extCircle}>
                <span className={styles.innCircle}>{levelDesc || level}</span>
              </span>
              <span className={styles.type} style={{ marginTop: 100 }}>
                {fraudTypeDesc}
              </span>
            </div>
            <div className={styles.dataRight}>
              <div>
                <span className={styles.tName}>预警编号</span>
                <span className={styles.tValue}>{id}</span>
                <span className={styles.tName}>受害人账号</span>
                <span className={styles.tValue}>{victim && victim.phone}</span>
              </div>
              <div>
                <span className={styles.tName}>交易时间</span>
                <span className={styles.tValue}>
                  {rawTime ? moment(rawTime).format(dateFormat) : '--'}
                </span>
                <span className={styles.tName}>交易金额(元)</span>
                <span className={styles.tValue}>{money || '--'}</span>
              </div>
              {axiosType === 'net' ? (
                <>
                  <div>
                    <span className={styles.tName}>受害人QQ</span>
                    <span className={styles.tValue}>{qq || '--'}</span>
                    <span className={styles.tName}>受害人支付宝号</span>
                    <span className={styles.tValue}>{alipay || '--'}</span>
                  </div>
                  <div>
                    <span className={styles.tName}>涉案网站</span>
                    <span className={styles.tValue}>
                      {website || '--'}
                      {website && !blackListExist && (
                        <span
                          className={styles.rydangan}
                          onClick={props.addToBlack(website, 'WEBSITE')}
                        >
                          加入黑名单
                        </span>
                      )}
                      {blackListExist && (
                        <span className={styles.inBlack}>已加入黑名单</span>
                      )}
                    </span>
                    <span className={styles.tName}>受害人IP归属</span>
                    <span className={styles.tValue}>
                      {vimIpaScription || '--'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className={styles.tName}>推送次数</span>
                    <span className={styles.tValue}>{pushTimes || '--'}</span>
                    <span className={styles.tName}>通话次数</span>
                    <span className={styles.tValue}>{callTimes || '--'}</span>
                  </div>
                  <div>
                    <span className={styles.tName}>最近联系时间</span>
                    <span className={styles.tValue}>
                      {latestTime
                        ? moment(latestTime).format(dateFormat)
                        : '--'}
                    </span>
                    <span className={styles.tName}>通话时长(秒)</span>
                    <span className={styles.tValue}>
                      {callDuration || '--'}
                    </span>
                  </div>
                </>
              )}
              <div>
                <span className={styles.tName}>推送时间</span>
                <span className={styles.tValue}>
                  {pushTime ? moment(pushTime).format(dateFormat) : '--'}
                </span>
                <span className={styles.tName}>推送单位</span>
                <span className={styles.tValue}>{pusher || '--'}</span>
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
                  {(victim && victim.phone) || '--'}
                </span>
                <span className={styles.tName}>嫌疑人号码</span>
                <span className={styles.tValue}>
                  {(suspect && suspect.phone) || '--'}
                  {suspect && suspect.phone && (
                    <span
                      className={styles.rydangan}
                      onClick={props.addToBlack(
                        suspect && suspect.phone,
                        'PHONE',
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
                  {(victim && victim.name) || '--'}
                </span>
                <span className={styles.tName}>嫌疑人姓名</span>
                <span className={styles.tValue}>
                  {(suspect && suspect.name) || '--'}
                </span>
              </div>
              <div>
                <span className={styles.tName}>受害人身份证号</span>
                <span className={styles.tValue}>
                  {(victim && victim.idcard) || '--'}
                  {victim && victim.idcard && (
                    <span
                      className={styles.rydangan}
                      onClick={jumpToPerson({
                        idCard: victim.idcard,
                        name: victim.name,
                      })}
                    >
                      {/*<i className="iconfont iconrenyuandangan"/>*/}
                      {/*人员档案*/}
                    </span>
                  )}
                </span>
                <span className={styles.tName}>嫌疑人身份证号</span>
                <span className={styles.tValue}>
                  {(suspect && suspect.idcard) || '--'}
                  {suspect && suspect.idcard && (
                    <span
                      className={styles.rydangan}
                      onClick={jumpToPerson({
                        idCard: suspect.idcard,
                        name: suspect.name,
                      })}
                    >
                      {/*<i className="iconfont iconrenyuandangan"/>*/}
                      {/*人员档案*/}
                    </span>
                  )}
                </span>
              </div>
              <div>
                <span className={styles.tName}>受害人银行卡号</span>
                <span className={styles.tValue}>
                  {(victim && victim.bankcard) || '--'}
                </span>
                <span className={styles.tName}>嫌疑人银行卡号</span>
                <span className={styles.tValue}>
                  {(suspect && suspect.bankcard) || '--'}
                </span>
              </div>
              <div>
                <span className={styles.tName}>受害人户籍地址</span>
                <span className={styles.tValue}>
                  {(victim && victim.bankcard) || '--'}
                </span>
                <span className={styles.tName}>嫌疑人户籍地址</span>
                <span className={styles.tValue}>
                  {(suspect && suspect.bankcard) || '--'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {lawcase && (
          <div className={`${styles.yjData} ${styles.personData}`}>
            <span className="lineT">关联案件</span>
            <div className={styles.dataC} style={{ height: 100 }}>
              <div
                className={styles.dataRight}
                style={{ width: '100%', borderBottom: 'none' }}
              >
                <div>
                  <span className={styles.tName}>案件编号</span>
                  <span className={styles.tValue}>
                    {(lawcase && lawcase.code) || '--'}
                  </span>
                  <span className={styles.tName}>立案时间</span>
                  <span className={styles.tValue}>
                    {(lawcase &&
                      lawcase.registTime &&
                      moment(lawcase.registTime).format(dateFormat)) ||
                      '--'}
                  </span>
                </div>
                <div>
                  <span className={styles.tName}>案件类型</span>
                  <span className={styles.tValue}>
                    {lawcase ? '诈骗' : '--'}
                  </span>
                  <span className={styles.tName}>涉案金额</span>
                  <span className={styles.tValue}>
                    {(lawcase && lawcase.money) || '--'}
                  </span>
                </div>
                <div className={styles.ajDiv}>
                  <div
                    className={`${styles.tName} ${styles.ajName}`}
                    style={{ float: 'left' }}
                  >
                    案件描述
                  </div>
                  <span className={`${styles.tValue} ${styles.ajDetail}`}>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {(lawcase && lawcase.description) || '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*如果是已经反馈过的，需要显示责任操作人和处置反馈 列表*/}

        {pageType !== 4 && fraudFeedback && fraudFeedback.length > 0 && (
          <div className={styles.zrr}>
            <span className="lineT">责任操作人</span>
            <div className={styles.content}>
              <div className={styles.one}>
                <span className={styles.tName}>反馈人</span>
                <span className={styles.tValue}>
                  {fraudInfo.fkPerson.join(' , ')}
                </span>
              </div>
              <div className={styles.one}>
                <span className={styles.tName}>所属单位</span>
                <span className={styles.tValue}>
                  {fraudInfo.fkOrg.join(',')}
                </span>
              </div>
              <div className={styles.one}>
                <span className={styles.tName}>反馈时间</span>
                <span className={styles.tValue}>
                  {fraudFeedback &&
                    moment(
                      fraudFeedback[fraudFeedback.length - 1].updated,
                    ).format(dateFormat)}
                </span>
              </div>
            </div>
          </div>
        )}
        {pageType !== 4 &&
          fraudFeedback &&
          fraudFeedback.map(item => {
            return (
              <div key={item.id} className={styles.yjz}>
                <span className="lineT">处置反馈</span>
                <div className={styles.content}>
                  <div className={styles.one}>
                    <span className={styles.tName}>反馈时间</span>
                    <span className={styles.tValue}>
                      {moment(item.created).format(dateFormat)}
                    </span>
                  </div>
                  <div className={styles.one}>
                    <span className={styles.tName}>处置方式</span>
                    <span className={styles.tValue}>
                      {item.resultPhoneDesc} {item.resultSmsDesc}{' '}
                      {item.resultVisitDesc}
                    </span>
                  </div>
                  <div className={styles.one}>
                    <span className={styles.tName}>处置内容</span>
                    <span className={styles.tValue}>
                      {item.handleContentDesc || '--'}
                    </span>
                  </div>
                  <div className={styles.one}>
                    <span className={styles.tName}>受骗金额(元)</span>
                    <span className={styles.tValue}>
                      {item.moneyDefraud || '--'}
                    </span>
                  </div>
                  <div className={styles.one}>
                    <span className={styles.tName}>劝阻金额(元)</span>
                    <span className={styles.tValue}>
                      {item.moneyDissuade || '--'}
                    </span>
                  </div>
                  <div className={styles.one}>
                    <span className={styles.tName}>实际预警等级</span>
                    <span className={styles.tValue}>
                      {item.riskLevelDesc || '--'}
                    </span>
                  </div>
                  <div className={styles.one}>
                    <span className={styles.tName}>实际诈骗类型</span>
                    <span className={styles.tValue}>
                      {item.fraudTypeDesc || '--'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        {pageType === 3 && listResult.fraudReturnVisit && (
          <div className={styles.zrr}>
            <span className="lineT">回访</span>
            <div className={styles.content}>
              <div className={styles.one}>
                <span className={styles.tName}>有效性</span>
                <span className={styles.tValue}>
                  {fraudReturnVisit.truthful === 'N' ? '无效' : '有效'}
                </span>
              </div>
              <div className={styles.one}>
                <span className={styles.tName}>回访人</span>
                <span className={styles.tValue}>
                  {fraudReturnVisit.userName || '--'}
                </span>
              </div>
              <div className={styles.one}>
                <span className={styles.tName}>回访时间</span>
                <span className={styles.tValue}>
                  {fraudReturnVisit &&
                    moment(fraudReturnVisit.created).format(dateFormat)}
                </span>
              </div>
              <div className={styles.one}>
                <span className={styles.tName}>回访说明</span>
                <span className={styles.tValue}>
                  {fraudReturnVisit.remark || '--'}
                </span>
              </div>
            </div>
          </div>
        )}

        {pageType === 1 && <PageHandleFeedback {...props} />}
      </div>
    </>
  );
};
