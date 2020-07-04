import styles from './index.less';
import { Button, Checkbox, Input, Select, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import pageSizeOptions from '@utils/pageSizeOptions';

export default props => {
  const [allCheck, setAllCheck] = useState(false); // 全选
  const [backCheck, setBackCheck] = useState(false); // 反选
  const [allOP, setAllOP] = useState(null); // 批量select

  const [tableData, setTable] = useImmer({
    pageNum: 1,
    pageSize: 10,
    loading: false,
    list: [],
    refresh: null
  });

  useEffect(() => {
    getTable();
  }, [tableData.pageNum, tableData.pageSize]);

  const columns = [
    {
      title: '',
      dataIndex: 'check',
      width: 50,
      render: (text, item) => {
        return <Checkbox checked={text} onChange={listCheckboxChange(item)} />;
      }
    },
    // {
    //   title: '网络名称',
    //   dataIndex: 'target',
    //   width: 200,
    //   render: text => text || '--'
    // },
    {
      title: '网址',
      dataIndex: 'target',
      // width: 200,
      render: text => text || '--'
    },
    {
      title: '操作者',
      dataIndex: 'userName',
      // width: 70,
      render: text => text || '--'
    }
  ];

  const getTable = async () => {
    let params = {
      pageNum: tableData.pageNum,
      pageSize: tableData.pageSize,
      target: tableData.num,
      type: 1,
      targetType: 'WEBSITE'
    };
    let res = await axios.post('antifraud/white/page', params);
    setTable(draft => {
      draft.list = res.records;
    });
  };

  const reset = () => {
    setTable(draft => {
      draft.pageSize = 1;
      draft.pageNum = 10;
      draft.num = null;
      draft.refresh = Math.random();
    });
  };

  // 页码改变时
  const pageChange = (pageNum, pageSize) => {
    // 页面改变时，全选什么也要重置
    setTable(draft => {
      draft.pageNum = pageNum;
      draft.pageSize = pageSize;
      draft.allCheck = false;
      draft.backCheck = false;
    });
  };

  // 表格上的checkbox改变时
  const listCheckboxChange = item => e => {
    let checkedLen = 0; // 选中的长度
    setTable(draft => {
      draft.list.forEach(val => {
        console.log(val);
        console.log(item);
        if (val.id === item.id) val.check = e.target.checked;
        if (val.check) checkedLen += 1;
        setAllCheck(checkedLen === tableData.list.length);
      });
      draft.loading = false;
    });
  };
  // 全选check改变时
  const allCheckChange = e => {
    const flag = e.target.checked;
    setTable(draft => {
      draft.list.forEach(val => {
        val.check = flag;
      });
      setAllCheck(e.target.checked);
    });
  };
  // 反选check改变时
  const backCheckChange = e => {
    setTable(draft => {
      draft.list.forEach(val => {
        val.check = !val.check;
      });
      setBackCheck(!backCheck);
    });
  };

  // 批量操作
  const opAll = v => {
    let ids = [];
    tableData.list.forEach(item => {
      if (item.check) ids.push(item.id);
    });
    if (ids.length === 0) {
      message.warn('请勾选内容!');
      return;
    }
    if (v === '删除') {
      axios.post('antifraud/white/del', { ids }).then(res => {
        message.success('删除成功！');
        getTable();
      });
    }
  };

  return (
    <div className={styles.allC}>
      <div className={styles.search}>
        <div className={styles.searchTop}>
          <span className="lineT">电话查询</span>
        </div>
        <div className={styles.searchBot}>
          <div className={styles.one}>
            <label>号码查询：</label>
            <Input
              placeholder="请输入号码"
              value={tableData.num}
              onChange={e => props.immerChange(setTable, 'num', e.target.value)}
            />
          </div>
          <div className={styles.one}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className={styles.searchBtn}
              onClick={() => getTable()}
            >
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => reset()}>
              重置
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.tableC}>
        <span className="lineT">诈骗预警</span>
        <Table
          loading={tableData.loading}
          columns={columns}
          dataSource={tableData.list}
          rowKey="id"
          bordered
          scroll={{ y: 450 }}
          pagination={{
            current: tableData.pageNum,
            pageSize: tableData.pageSize,
            total: tableData.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: pageChange,
            onShowSizeChange: pageChange,
            pageSizeOptions
          }}
        ></Table>
      </div>
      {tableData.list.length > 0 && (
        <div className={styles.opC}>
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
            style={{ width: 150 }}
            placeholder="批量操作"
            onChange={v => opAll(v)}
            value={allOP || undefined}
          >
            <Select.Option value="删除">删除</Select.Option>
          </Select>
        </div>
      )}
    </div>
  );
};
