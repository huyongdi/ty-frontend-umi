import React, { useState, useEffect } from 'react';
import { message, Table, Checkbox, Tooltip, Select } from 'antd';
import axios from 'axios';
import { TopSearch, TransferModal, RejectModal } from '@components';
import styles from '../phone/index.less';
import pageSizeOptions from '@utils/pageSizeOptions';
import { useConfigParse } from '@utils/useParse';
import { useImmer } from 'use-immer';

const getColumns = (
  props,
  listCheckboxChange,
  showTransModal,
  showRejectModal,
  jumpToDetail
) => {
  return [
    {
      title: '',
      dataIndex: 'check',
      width: 50,
      fixed: props.is1920 ? false : 'left',
      render: (text, item) => {
        return <Checkbox checked={text} onChange={listCheckboxChange(item)} />;
      }
    },
    {
      title: '编号',
      dataIndex: '_key',
      width: 75,
      fixed: props.is1920 ? false : 'left',
      align: 'left',
      render: (text, record) => {
        return (
          <span className={styles.tdKey}>
            {text}
            {record.repeat && record.repeat.length > 0 && (
              <Tooltip
                placement="topLeft"
                title={`与${record.repeat[0].pusher}(${props
                  .moment(record.repeat[0].pushTime)
                  .format(props.dateFormat)})重复`}
              >
                <i className="iconfont iconqizhi1" />
              </Tooltip>
            )}
          </span>
        );
      }
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
      }
    },
    {
      title: '诈骗类型',
      dataIndex: 'fraudTypeDesc',
      ellipsis: {
        showTitle: false
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 120,
      render: text => {
        return useConfigParse(text, 'FRAUD_SOURCE');
      }
    },
    {
      title: '预警时间',
      dataIndex: 'rawTime',
      width: 180,
      render: text =>
        text ? props.moment(text).format(props.dateFormat) : '--'
    },
    {
      title: '受害人号码',
      dataIndex: ['victim', 'phone'],
      width: 130,
      render: text => text || '--'
    },
    {
      title: '嫌疑人号码',
      width: 130,
      dataIndex: ['suspect', 'phone'],
      render: text => text || '--'
    },
    {
      title: '受害人电话',
      dataIndex: 'victim[phone]',
      width: 131,
      render: text => text || '--'
    },
    {
      title: '受害人姓名',
      dataIndex: 'victim[name]',
      width: 130,
      render: text => text || '--'
    },
    {
      title: '受害人身份证号',
      dataIndex: 'victim[idcard]',
      width: 196,
      render: text => text || '--'
    },
    {
      title: '受害人QQ',
      dataIndex: 'qq',
      width: 130,
      render: text => text || '--'
    },
    {
      title: '受害人微信',
      dataIndex: 'wechat',
      width: 139,
      render: text => text || '--'
    },
    {
      title: '受害人银行卡号',
      dataIndex: 'victim[bankcard]',
      width: 188,
      render: text => text || '--'
    },
    {
      title: '受害人支付宝号',
      dataIndex: 'alipay',
      width: 202,
      render: text => text || '--'
    },
    {
      title: '受害人其他账号',
      dataIndex: 'otherAccount',
      width: 172,
      render: text => text || '--'
    },
    {
      title: '涉案网址',
      dataIndex: 'website',
      width: 228,
      render: text => text || '--'
    },
    {
      title: '推送时间',
      dataIndex: 'pushTime',
      width: 180,
      render: text =>
        text ? props.moment(text).format(props.dateFormat) : '--'
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
      }
    },
    {
      title: '操作',
      dataIndex: 'op',
      width: props.is1920 ? 210 : 180,
      fixed: props.is1920 ? false : 'right',
      render: (text, record) => {
        return (
          <div className={styles.opWrap}>
            <a onClick={() => jumpToDetail(record)} className={styles.fkBtn}>
              <i className="iconfont iconfankui opIcon" />
              反馈
            </a>
            {props.identify !== 3 && (
              <a
                onClick={() => showTransModal('', record)}
                className={styles.fkBtn}
              >
                <i className="iconfont iconyijiao opIcon" />
                移交
              </a>
            )}
            {props.identify !== 1 && (
              <a
                onClick={() => showRejectModal(record)}
                className={styles.fkBtn}
              >
                <i className="iconfont iconfanhui opIcon" />
                驳回
              </a>
            )}
          </div>
        );
      }
    }
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
    changeCondition: null // 搜索条件进行了变化：相当于是点了搜索，重置等等
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
    }
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
    }
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
      fraudType: tableObj.fraudType
    };
    setTableInfo(draft => {
      draft.loading = true;
    });
    const result = await axios.post('antifraud/fraud/page/net', params);
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
  // 表格上的checkbox改变时
  const listCheckboxChange = item => e => {
    let checkedLen = 0; // 选中的长度
    setTableInfo(draft => {
      draft.data.forEach(val => {
        if (val._key === item._key) val.check = e.target.checked;
        if (val.check) checkedLen += 1;
        setAllCheck(checkedLen === tableObj.data.length);
      });
      draft.loading = false;
    });
  };
  // 全选check改变时
  const allCheckChange = e => {
    const flag = e.target.checked;
    setTableInfo(draft => {
      draft.data.forEach(val => {
        val.check = flag;
      });
      setAllCheck(e.target.checked);
    });
  };
  // 反选check改变时
  const backCheckChange = e => {
    setTableInfo(draft => {
      draft.data.forEach(val => {
        val.check = !val.check;
      });
      setBackCheck(!backCheck);
    });
  };
  // 移交弹框
  const showTransModal = (val, isTdObj) => {
    let ids = [];
    if (isTdObj) {
      // 点击的表格上单个移交
      ids = [{ id: isTdObj.id, version: isTdObj.version }];
    } else {
      // 批量
      tableObj.data.forEach(item => {
        if (item.check) ids.push({ id: item.id, version: item.version });
      });
    }

    if (ids.length > 0) {
      setTransfer(draft => {
        draft.transIds = ids;
        draft.showModal = true;
      });
    } else {
      val && message.warn('请勾选预警！');
    }
  };
  // 驳回弹框
  // 单个驳回操作
  const showRejectModal = item => {
    setReject(draft => {
      draft.showModal = true;
      draft.item = item;
    });
  };

  const jumpToDetail = record => {
    props.history.push({
      pathname: '/warnDetail',
      state: {
        jumpInfo: { ...record, axiosType: 'net', pageType: 1 }
      }
    });
  };

  // 根据分辨率改变scroll
  let scroll = {};
  if (props.is1920) {
    if (tableObj.pageSize > 10) {
      scroll = { y: 'calc(100vh - 32rem)', x: 3000 };
    } else {
      scroll = { x: 3000 };
    }
  } else if (props.is1600) {
    scroll = { y: 'calc(100vh - 32rem)', x: 3000 };
  } else {
    scroll = { y: 'calc(100vh - 27rem)', x: 3000 };
  }
  const columns = getColumns(
    props,
    listCheckboxChange,
    showTransModal,
    showRejectModal,
    jumpToDetail
  );

  return (
    <>
      <TopSearch setTableInfo={setTableInfo} getTable={getTable} type={2} />
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
            pageSizeOptions
          }}
        />
        {tableObj.data.length > 0 && props.identify !== 3 && (
          <div className={styles.botOP}>
            <Checkbox checked={allCheck} onChange={allCheckChange}>
              全选
            </Checkbox>
            <span
              className={`${styles.bCheck} ${backCheck ? styles.in : ''}`}
              onClick={backCheckChange}
            >
              反选
            </span>
            <Select
              className={styles.opSelect}
              placeholder="批量操作"
              onChange={v => showTransModal(v)}
              value={allOP}
            >
              <Select.Option value="移交">移交</Select.Option>
            </Select>
          </div>
        )}
      </div>
      <TransferModal {...transferData} getTable={getTable} />
      <RejectModal {...rejectData} getTable={getTable} />
    </>
  );
};
