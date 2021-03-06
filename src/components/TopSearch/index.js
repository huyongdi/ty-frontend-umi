import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  message,
  Modal,
  Select,
  DatePicker,
  TreeSelect,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import reg from '@utils/reg';

import styles from './index.less';
import { useSelector } from 'react-redux';
import { useImmer } from 'use-immer';

const { RangePicker } = DatePicker;
export default props => {
  let initState = {
    // 预警信息 电话
    num: null, // 号码
    level: '', // 预警等级
    startTime: '', // 开始时间
    endTime: '', // 结束时间
    showModal: false, // 弹出框是否显示
    source: '', // 来源
    callDuration: null, // 通话时长
    callTimes: null, // 通话次数
    processType: '', // 状态
    fraudType: '', // 诈骗类型

    account: null, //QQ
    bankcard: null, //银行卡号
    idcard: null, //身份证号
    website: null, // 涉案网址

    orgType: '', // 分发至
    time0: '', // 是否超时

    fkOrg: null, // 反馈单位
    moreFK: '', // 多次反馈
    fkZT: '', // 反馈状态
    czFS: '', // 处置方式
    bpMoney: null, // 被骗金额
    qzMoney: null, // 劝阻金额
  };
  const [condition, setCondition] = useImmer(initState);
  const { nextOrg, allOrg } = useSelector(state => state.backEnd);
  const changeData = (key, val) => {
    setCondition(draft => {
      draft[key] = val;
    });
  };

  // 时间选择改变时
  const onDateChange = value => {
    changeData('startTime', value[0]);
    changeData('endTime', value[1]);
  };

  // 弹出框逻辑
  const handleOk = () => {
    let { callDuration, callTimes } = condition;
    if (callDuration && !reg.isInt.test(callDuration)) {
      message.warn('通话时长请填写正整数');
      return;
    }
    if (callTimes && !reg.isInt.test(callTimes)) {
      message.warn('通话次数请填写正整数');
      return;
    }
    props.setTableInfo(draft => {
      draft.pageNum = 1;
      draft.pageSize = 10;
      draft.changeCondition = Math.random();
      for (let i in condition) {
        draft[i] = condition[i];
      }
    });
    setCondition(draft => {
      draft.showModal = false;
    });
  };

  // 重置搜索
  const reset = () => {
    resetCondition();
    props.setTableInfo(draft => {
      draft.pageNum = 1;
      draft.pageSize = 10;
      draft.changeCondition = Math.random();
      for (let i in initState) {
        draft[i] = initState[i];
      }
    });
  };

  // 重置条件
  const resetCondition = () => {
    setCondition(draft => {
      for (let i in initState) {
        if (i !== 'showModal') {
          draft[i] = initState[i];
        }
      }
    });
  };

  const {
    FRAUD_LEVEL,
    FRAUD_SOURCE,
    PROCESS_TYPE,
    FRAUD_TYPE,
    HANDLE_RESULT,
  } = useSelector(state => state.backEnd);
  const { type } = props;
  return (
    <div className={styles.topSearch}>
      <div className={styles.top}>
        <span className="lineT">预警查询</span>
        <span
          className={styles.seniorSearch}
          onClick={() => {
            changeData('showModal', true);
          }}
        >
          <SearchOutlined />
          高级搜索
        </span>
      </div>
      <div className={styles.main}>
        <div className={styles.one}>
          <label>号码查询：</label>
          <Input
            placeholder="受害人/嫌疑人号码"
            value={condition.num}
            onChange={e => changeData('num', e.target.value)}
          />
        </div>
        <div className={styles.one}>
          <label>预警等级：</label>
          <Select
            className={styles.right}
            value={condition.level}
            onChange={v => changeData('level', v)}
          >
            <Select.Option value="">全部</Select.Option>
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
        <div className={styles.one}>
          <label>推送时间：</label>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format={props.pickFormat}
            onChange={onDateChange}
            value={[condition.startTime, condition.endTime]}
          />
        </div>
        <div className={styles.one}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            className={styles.searchBtn}
            onClick={() => handleOk()}
          >
            查询
          </Button>
          <Button onClick={() => reset()} icon={<ReloadOutlined />}>
            重置
          </Button>
        </div>
      </div>

      {/*type:1-预警信息电话, 2-*/}
      <Modal
        title="高级搜索"
        visible={condition.showModal}
        className={styles.mainWrap}
        onCancel={() => changeData('showModal', false)}
        onOk={handleOk}
        centered={true}
      >
        <div className={styles.one}>
          号码查询：
          <Input
            placeholder="受害人/嫌疑人号码"
            value={condition.num}
            onChange={e => changeData('num', e.target.value)}
          />
        </div>
        <div className={styles.one}>
          预警等级：
          <Select
            className={styles.seniorSelect}
            value={condition.level}
            onChange={v => changeData('level', v)}
          >
            <Select.Option value="">全部</Select.Option>
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
        <div className={styles.one}>
          推送来源：
          <Select
            className={styles.seniorSelect}
            value={condition.source}
            onChange={v => changeData('source', v)}
          >
            <Select.Option value="">全部</Select.Option>
            {FRAUD_SOURCE &&
              FRAUD_SOURCE.map(item => {
                return (
                  <Select.Option key={item.cfgKey} value={item.cfgKey}>
                    {item.cfgValue}
                  </Select.Option>
                );
              })}
          </Select>
        </div>
        {[1, 3, 5].includes(type) && (
          <>
            <div className={styles.one}>
              通话时长>(S)：
              <Input
                placeholder="请输入通话时长"
                value={condition.callDuration}
                onChange={e => changeData('callDuration', e.target.value)}
              />
            </div>
            <div className={styles.one}>
              通话次数>(次)：
              <Input
                placeholder="请输入通话次数"
                value={condition.callTimes}
                onChange={e => changeData('callTimes', e.target.value)}
              />
            </div>
          </>
        )}

        {[3, 4].includes(type) && (
          <>
            <div className={styles.one}>
              分发至：
              <Select
                className={styles.seniorSelect}
                value={condition.orgType}
                onChange={v => changeData('orgType', v)}
              >
                <Select.Option value="">全部</Select.Option>
                {nextOrg &&
                  nextOrg.map(item => {
                    return (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
              </Select>
            </div>
            <div className={styles.one}>
              是否超时：
              <Select
                className={styles.seniorSelect}
                value={condition.timeO || undefined}
                onChange={v => changeData('timeO', v)}
              >
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="1">正常</Select.Option>
                <Select.Option value="2">超时</Select.Option>
              </Select>
            </div>
          </>
        )}

        {[2, 4, 6, 8].includes(type) && (
          <>
            <div className={styles.one}>
              受害人QQ：
              <Input
                placeholder="请输入QQ号码"
                value={condition.account}
                onChange={e => changeData('account', e.target.value)}
              />
            </div>
            <div className={styles.one}>
              受害人银行卡号：
              <Input
                placeholder="请输入银行卡号"
                value={condition.bankcard}
                onChange={e => changeData('bankcard', e.target.value)}
              />
            </div>
            <div className={styles.one}>
              受害人身份证号：
              <Input
                placeholder="请输入身份证号"
                value={condition.idcard}
                onChange={e => changeData('idcard', e.target.value)}
              />
            </div>
            <div className={styles.one}>
              涉案网址：
              <Input
                placeholder="请输入网址"
                value={condition.website}
                onChange={e => changeData('website', e.target.value)}
              />
            </div>
          </>
        )}

        {type === 1 && (
          <div className={styles.one}>
            状态：
            <Select
              className={styles.seniorSelect}
              value={condition.processType}
              onChange={v => changeData('processType', v)}
            >
              <Select.Option value="">全部</Select.Option>
              {PROCESS_TYPE &&
                PROCESS_TYPE.map(item => {
                  if (
                    item.cfgValue === '分发' ||
                    item.cfgValue === '回访' ||
                    item.cfgValue === '反馈'
                  ) {
                    return null;
                  } else {
                    return (
                      <Select.Option key={item.cfgKey} value={item.cfgKey}>
                        {item.cfgValue}
                      </Select.Option>
                    );
                  }
                })}
            </Select>
          </div>
        )}

        {[7, 8].includes(type) && (
          <>
            <div className={styles.one}>
              反馈单位：
              <TreeSelect
                style={{ width: '265px' }}
                value={condition.fkOrg || undefined}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={allOrg}
                placeholder="请选择单位"
                className={styles.seniorSelect}
                treeDefaultExpandAll
                onChange={v => changeData('fkOrg', v)}
              />
            </div>
            <div className={styles.one}>
              多次反馈：
              <Select
                className={styles.seniorSelect}
                value={condition.moreFK}
                onChange={v => changeData('moreFK', v)}
              >
                <Select.Option value="">全部</Select.Option>
                <Select.Option value={2}>多次</Select.Option>
                <Select.Option value={1}>单次</Select.Option>
              </Select>
            </div>
            <div className={styles.one}>
              反馈状态：
              <Select
                className={styles.seniorSelect}
                value={condition.fkZT}
                onChange={v => changeData('fkZT', v)}
              >
                <Select.Option value="">全部</Select.Option>
                <Select.Option value={1}>正常</Select.Option>
                <Select.Option value={2}>超时</Select.Option>
              </Select>
            </div>
            <div className={styles.one}>
              处置方式：
              <Select
                className={styles.seniorSelect}
                value={condition.czFS}
                onChange={v => changeData('czFS', v)}
              >
                <Select.Option value="">全部</Select.Option>
                {HANDLE_RESULT &&
                  HANDLE_RESULT.map(item => {
                    return (
                      <Select.Option key={item.cfgKey} value={item.cfgKey}>
                        {item.cfgValue}
                      </Select.Option>
                    );
                  })}
              </Select>
            </div>
            <div className={styles.one}>
              被骗金额（元）>：
              <Input
                placeholder="请输入被骗金额"
                value={condition.bpMoney}
                onChange={v => changeData('bpMoney', v.target.value)}
              />
            </div>
            <div className={styles.one}>
              劝阻金额（元）>：
              <Input
                placeholder="请输入劝阻金额"
                value={condition.qzMoney}
                onChange={v => changeData('qzMoney', v.target.value)}
              />
            </div>
          </>
        )}
        <div className={styles.one}>
          诈骗类型：
          <Select
            className={styles.seniorSelect}
            value={condition.fraudType}
            onChange={v => changeData('fraudType', v)}
          >
            <Select.Option value="">全部</Select.Option>
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
        <div className={styles.one}>
          推送时间从：
          <DatePicker
            className={styles.seniorSelect}
            showTime={{ format: 'HH:mm' }}
            placeholder="请选择推送开始时间"
            value={condition.startTime}
            onChange={date => {
              changeData('startTime', date);
            }}
          />
        </div>
        <div className={styles.one}>
          推送时间到：
          <DatePicker
            className={styles.seniorSelect}
            showTime={{ format: 'HH:mm' }}
            placeholder="请选择推送结束时间"
            value={condition.endTime}
            onChange={date => {
              changeData('endTime', date);
            }}
          />
        </div>
        <span className={styles.clear} onClick={() => resetCondition()}>
          清除条件
        </span>
      </Modal>
    </div>
  );
};
