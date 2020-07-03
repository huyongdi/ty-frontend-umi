import React, { useState, useEffect } from 'react';
import { Input, message, Modal, Table, Checkbox, Tooltip, Select } from 'antd';
import { useEventTarget } from '@umijs/hooks';
import axios from 'axios';
import { useModel } from 'umi';
import { TopSearch, TransferModal, RejectModal } from '@components';
import styles from './index.less';
import pageSizeOptions from '@utils/pageSizeOptions';
import { useConfigParse } from '@utils/useParse';
// import moment from 'moment'
import { useImmer } from 'use-immer';

const getColumns = (props, jumpToDetail) => {
  return [
    {
      title: '编号',
      dataIndex: '_key',
      width: 75,
      fixed: props.is1920 ? false : 'left',
      align: 'left',
      render: (text, record) => {
        return <span className={styles.tdKey}>{text}</span>;
      },
    },
    {
      title: '预警等级',
      dataIndex: 'level',
      width: 90,
      render: (text, record) => {
        return (
          <span className={`${styles['level' + record.level]}`}>
            <span className={styles.circle} />
            {useConfigParse(text, 'FRAUD_LEVEL')}
          </span>
        );
      },
    },
    {
      title: '诈骗类型',
      dataIndex: 'fraudTypeDesc',
      ellipsis: {
        showTitle: false,
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 120,
      render: text => {
        return useConfigParse(text, 'FRAUD_SOURCE');
      },
    },
    {
      title: '受害人号码',
      dataIndex: ['victim', 'phone'],
      width: 130,
      render: text => text || '--',
    },
    {
      title: '嫌疑人号码',
      width: 130,
      dataIndex: ['suspect', 'phone'],
      render: text => text || '--',
    },
    {
      title: '通话次数',
      width: 90,
      dataIndex: 'callTimes',
      render: text => text || '--',
    },
    {
      title: '通话时长(S)',
      width: 110,
      dataIndex: 'callDuration',
      render: text => text || '--',
    },
    {
      title: '最近联系时间',
      dataIndex: 'latestTime',
      width: 180,
      render: text =>
        text ? props.moment(text).format(props.dateFormat) : '--',
    },
    {
      title: '推送时间',
      dataIndex: 'pushTime',
      width: 180,
      render: text =>
        text ? props.moment(text).format(props.dateFormat) : '--',
    },
    {
      title: '操作',
      dataIndex: 'op',
      width: 100,
      fixed: props.is1920 ? false : 'right',
      render: (text, record) => {
        return (
          <div className={styles.opWrap}>
            <a onClick={() => jumpToDetail(record)} className={styles.fkBtn}>
              <i className="iconfont iconxiangqing opIcon" />
              详情
            </a>
          </div>
        );
      },
    },
  ];
};

export default props => {
  const [tableObj, setTableInfo] = useImmer({
    // 表格
    loading: false,
    data: [],
    pageNum: 1,
    pageSize: 10,
    total: 1,
    changeCondition: null, // 搜索条件进行了变化：相当于是点了搜索，重置等等
  });

  const [allCheck, setAllCheck] = useState(false); // 全选
  const [backCheck, setBackCheck] = useState(false); // 反选
  const [allOP, setAllOP] = useState(null); // 批量select

  const [transferData, setTransfer] = useImmer({
    // 移交弹框所需数据
    showModal: false,
    transIds: [],
    close: () => {
      setTransfer(draft => {
        draft.showModal = false;
        draft.transIds = [];
      });
    },
  });
  const [rejectData, setReject] = useImmer({
    // 驳回弹框所需数据
    showModal: false,
    item: {},
    close: () => {
      setReject(draft => {
        draft.showModal = false;
        draft.item = {};
      });
    },
  });

  useEffect(() => {
    getTable();
  }, [tableObj.pageNum, tableObj.pageSize, tableObj.changeCondition]);

  // 逻辑
  // 获取表格数据
  const getTable = async () => {
    let params = {
      pageNum: tableObj.pageNum,
      pageSize: tableObj.pageSize,
      num: tableObj.num, // 号码
      level: tableObj.level, // 预警等级
      startTime: tableObj.startTime, // 开始时间
      endTime: tableObj.endTime, // 结束时间
      source: tableObj.source, // 来源
      duration: tableObj.callDuration, // 通话时长
      times: tableObj.callTimes, // 通话次数
      fraudType: tableObj.fraudType,
    };
    setTableInfo(draft => {
      draft.loading = true;
    });
    const result = await axios.post('antifraud/fraud/wash/page/phone', params);
    setTableInfo(draft => {
      draft.data = result.records.map((item, index) => {
        item._key = index + 1;
        item.check = false;
        return item;
      });
      draft.loading = false;
      draft.total = result.total;
    });
  };
  // 页码改变时
  const pageChange = (pageNum, pageSize) => {
    // 页面改变时，全选什么也要重置
    setTableInfo(draft => {
      draft.pageNum = pageNum;
      draft.pageSize = pageSize;
      draft.allCheck = false;
      draft.backCheck = false;
    });
  };

  // 跳转到详情
  const jumpToDetail = record => {
    console.log(record);
    props.history.push({
      pathname: '/warnDetail',
      state: {
        jumpInfo: { ...record, axiosType: 'repPhone', pageType: 3 },
      },
    });
  };

  // 根据分辨率改变scroll
  let scroll = {};
  if (props.is1920) {
    if (tableObj.pageSize > 10) {
      scroll = { y: 'calc(100vh - 32rem)' };
    }
  } else if (props.is1600) {
    scroll = { y: 'calc(100vh - 32rem)', x: 1600 };
  } else {
    scroll = { y: 'calc(100vh - 27rem)', x: 1600 };
  }
  const columns = getColumns(props, jumpToDetail);

  return (
    <>
      <TopSearch setTableInfo={setTableInfo} getTable={getTable} type={5} />
      <div className={styles.tableC}>
        <span className="lineT">诈骗预警</span>
        <Table
          columns={columns}
          dataSource={tableObj.data}
          rowKey="id"
          scroll={scroll}
          bordered
          loading={tableObj.loading}
          pagination={{
            current: tableObj.pageNum,
            pageSize: tableObj.pageSize,
            total: tableObj.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: pageChange,
            onShowSizeChange: pageChange,
            pageSizeOptions,
          }}
        />
      </div>
      <TransferModal {...transferData} getTable={getTable} />
      <RejectModal {...rejectData} getTable={getTable} />
    </>
  );
};
