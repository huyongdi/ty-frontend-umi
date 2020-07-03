import React, { useEffect } from 'react';
import { message, Table, Tooltip, Select } from 'antd';
import axios from 'axios';
import { TopSearch, BackVisitModal } from '@components';
import styles from '../phone/index.less';
import pageSizeOptions from '@utils/pageSizeOptions';
import { useConfigParse } from '@utils/useParse';
import { useImmer } from 'use-immer';

const getColumns = (props, jumpToDetail, showBackModal) => {
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
      title: '反馈方',
      dataIndex: 'organName',
      width: 160,
      render: text => {
        return text || '--';
      },
    },
    {
      title: '预警时间',
      dataIndex: 'rawTime',
      width: 180,
      render: text =>
        text ? props.moment(text).format(props.dateFormat) : '--',
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
      title: '受害人电话',
      dataIndex: 'victim[phone]',
      width: 131,
      render: text => text || '--',
    },
    {
      title: '受害人姓名',
      dataIndex: 'victim[name]',
      width: 130,
      render: text => text || '--',
    },
    {
      title: '受害人身份证号',
      dataIndex: 'victim[idcard]',
      width: 196,
      render: text => text || '--',
    },
    {
      title: '受害人QQ',
      dataIndex: 'qq',
      width: 130,
      render: text => text || '--',
    },
    {
      title: '受害人微信',
      dataIndex: 'wechat',
      width: 139,
      render: text => text || '--',
    },
    {
      title: '受害人银行卡号',
      dataIndex: 'victim[bankcard]',
      width: 188,
      render: text => text || '--',
    },
    {
      title: '受害人支付宝号',
      dataIndex: 'alipay',
      width: 202,
      render: text => text || '--',
    },
    {
      title: '受害人其他账号',
      dataIndex: 'otherAccount',
      width: 172,
      render: text => text || '--',
    },
    {
      title: '涉案网址',
      dataIndex: 'website',
      width: 228,
      render: text => text || '--',
    },
    {
      title: '推送时间',
      dataIndex: 'pushTime',
      width: 180,
      render: text =>
        text ? props.moment(text).format(props.dateFormat) : '--',
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      // width: 150,
      render: (text, record) => {
        if (text && text.includes('驳回')) {
          return (
            <Tooltip
              placement="topLeft"
              title={record.backOrganReason}
              arrowPointAtCenter
            >
              <span className={styles.red}>{text}</span>
            </Tooltip>
          );
        } else {
          return <span>{text}</span>;
        }
      },
    },

    {
      title: '处置方式',
      dataIndex: 'resultPhone',
      // width: 150,
      render: (text, record) => {
        let arr = [
          record.resultPhone,
          record.resultSms,
          record.resultVisit,
        ].filter(item => {
          return item;
        });
        return arr.join(',');
      },
    },
    {
      title: '处置内容',
      dataIndex: 'handleContentDesc',
      width: 150,
      render: text => text || '--',
    },
    {
      title: '被骗金额(元)',
      dataIndex: 'moneyDefraud',
      width: 129,
      render: text => text || '--',
    },
    {
      title: '劝阻金额(元)',
      dataIndex: 'moneyDissuade',
      width: 129,
      render: text => text || '--',
    },
    {
      title: '反馈次数',
      dataIndex: 'feedbackTimes',
      width: 120,
      render: text => text || '--',
    },

    {
      title: '操作',
      dataIndex: 'op',
      width: 150,
      fixed: props.is1920 ? false : 'right',
      render: (text, record) => {
        return (
          <div className={styles.opWrap}>
            <a onClick={() => jumpToDetail(record)} className={styles.fkBtn}>
              <i className="iconfont iconxiangqing opIcon" />
              详情
            </a>
            {record.status !== 4 && props.identify === 1 && (
              <a onClick={() => showBackModal(record)} className={styles.fkBtn}>
                <i className="iconfont iconyujingxinxi opIcon" />
                回访
              </a>
            )}
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

  const [backData, setBack] = useImmer({
    // 回访弹框所需数据
    showModal: false,
    item: {},
    close: () => {
      setBack(draft => {
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
      processType: tableObj.processType, // 状态
      account: tableObj.account, //QQ
      bankcard: tableObj.bankcard, //银行卡号
      idcard: tableObj.idcard, //身份证号
      website: tableObj.website, // 涉案网址

      duration: tableObj.callDuration,
      times: tableObj.callTimes,
      organCode: tableObj.fkOrg,
      singleFeedback: tableObj.moreFK,
      expired: tableObj.fkZT,
      handleType: tableObj.czFS || null,
      moneyDefraud: tableObj.bpMoney,
      moneyDissuade: tableObj.qzMoney,
      fraudType: tableObj.fraudType,
    };
    setTableInfo(draft => {
      draft.loading = true;
    });
    const result = await axios.post(
      'antifraud/fraud/feedback/page/net',
      params,
    );
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

  const jumpToDetail = record => {
    props.history.push({
      pathname: '/warnDetail',
      state: {
        jumpInfo: { ...record, axiosType: 'net', pageType: 4 },
      },
    });
  };

  // 回访弹框
  const showBackModal = item => {
    setBack(draft => {
      draft.showModal = true;
      draft.item = item;
    });
  };

  // 根据分辨率改变scroll
  let scroll = {};
  if (props.is1920) {
    if (tableObj.pageSize > 10) {
      scroll = { y: 'calc(100vh - 32rem)', x: 3900 };
    } else {
      scroll = { x: 3900 };
    }
  } else if (props.is1600) {
    scroll = { y: 'calc(100vh - 32rem)', x: 3900 };
  } else {
    scroll = { y: 'calc(100vh - 27rem)', x: 3900 };
  }
  const columns = getColumns(props, jumpToDetail, showBackModal);

  return (
    <>
      <TopSearch setTableInfo={setTableInfo} getTable={getTable} type={8} />
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
      <BackVisitModal {...backData} getTable={getTable} />
    </>
  );
};
