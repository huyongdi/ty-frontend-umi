import React, { useState, useEffect } from 'react';
import {
  Select,
  Button,
  DatePicker,
  Progress,
  Modal,
  Input,
  Pagination,
  Tooltip,
  message,
} from 'antd';
import axios from 'axios';
import { TopSearch, TransferModal, RejectModal } from '@components';
import styles from './index.less';
import pageSizeOptions from '@utils/pageSizeOptions';
import { useConfigParse } from '@utils/useParse';
import { useImmer } from 'use-immer';
import { useSelector } from 'react-redux';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import echarts from 'echarts';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

export default props => {
  const [tableObj, setTable] = useImmer({
    pageNum: 1,
    pageSize: 5,
    listData: [],
  });
  const [addObj, setAdd] = useImmer({
    show: false,
    statusE: 'Y',
  });
  const [editObj, setEdit] = useImmer({
    show: false,
    inEdit: false,
  });
  useEffect(() => {
    getData();
  }, [tableObj.pageNum, tableObj.pageSize]);

  const getData = async () => {
    let params = {
      pageNum: tableObj.pageNum,
      pageSize: tableObj.pageSize,
      words: tableObj.keyword,
      startTime: tableObj.startTime
        ? props.moment(tableObj.startTime).valueOf()
        : '',
      endTime: tableObj.endTime ? props.moment(tableObj.endTime).valueOf() : '',
    };
    let res = await axios.post('antifraud/smsTeamplte/page', params);
    setTable(draft => {
      draft.listData = res.records;
      draft.total = res.total;
    });
  };

  const reset = () => {
    setTable(draft => {
      draft.pageNum = 1;
      draft.pageSize = 5;
      draft.keyword = null;
      draft.startTime = null;
      draft.endTime = null;
    });
  };

  // 页码改变时
  const pageChange = (pageNum, pageSize) => {
    // 页面改变时，全选什么也要重置
    setTable(draft => {
      draft.pageNum = pageNum;
      draft.pageSize = pageSize;
    });
  };

  // 新增模板
  const addModal = () => {
    setAdd(draft => {
      draft.show = true;
    });
  };
  // 关闭新增模板
  const closeAddModal = () => {
    setAdd(draft => {
      draft.show = false;
    });
  };

  // 新增弹框确认请求
  const handleAddOk = () => {
    let params = {
      title: addObj.title,
      content: addObj.content,
      enabled: addObj.statusE,
      level: addObj.level,
      fraudType: addObj.fraudType,
    };
    if (params.content.length > 256) {
      message.warn('短信内容请控制在256个字符！');
      return;
    }
    axios.post('antifraud/smsTeamplte/add', params).then(res => {
      if (res) {
        message.success('新增成功');
        closeAddModal();
        getData();
      }
    });
  };

  /**
   * 编辑、详情弹框
   * */
  // 新增模板
  const editSMS = item => () => {
    setEdit(draft => {
      for (let i in item) {
        draft[i] = item[i];
      }
      draft.show = true;
      draft.level = item.fraudType ? item.fraudType + '' : null;
      draft.fraudType = item.level ? item.level + '' : null;
    });
  };

  // 关闭新增模板
  const closeEditModal = () => {
    setEdit(draft => {
      draft.show = false;
    });
  };

  // 新增弹框确认请求
  const handleEditOk = () => {
    const { id, title, content, enabled, level, fraudType } = editObj;
    let params = {
      id,
      title,
      content,
      enabled,
      fraudType,
      level,
    };

    if (content.length > 256) {
      message.warn('短信内容请控制在256个字符！');
      return;
    }

    axios.post('antifraud/smsTeamplte/updated', params).then(res => {
      message.success('编辑成功');
      getData();
      setEdit(draft => {
        draft.show = false;
      });
    });
  };

  // 删除短信
  const deleteSMS = item => () => {
    confirm({
      title: '是否确定删除模板？',
      content: '删除后该模板将不能被引用',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确定',
      cancelText: '取消',
      bodyStyle: {
        padding: '20px',
      },
      className: styles.confirmModal,
      onOk: () => {
        axios
          .post('antifraud/smsTeamplte/del', { id: item.id, formData: true })
          .then(res => {
            message.success('删除成功');
            getData();
          });
      },
    });
  };
  const { PHONE_TYPE, FRAUD_LEVEL, FRAUD_TYPE, peopleArr, smsArr, id } = props;
  return (
    <>
      <div className={styles.search}>
        <span className="lineT">短信模板查询</span>
        <div className={styles.searchContent}>
          <div>
            <span>关键字查询：</span>
            <Input
              className={styles.searchInput}
              value={tableObj.keyword}
              onChange={e =>
                props.immerChange(setTable, 'keyword', e.target.value)
              }
            />
          </div>
          <div>
            创建时间：
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format={props.dateFormat}
              value={[tableObj.startTime, tableObj.endTime]}
              onChange={value => {
                props.immerChange(setTable, 'startTime', value[0]);
                props.immerChange(setTable, 'endTime', value[1]);
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className={styles.searchBtn}
              onClick={() => getData()}
            >
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => reset()}>
              重置
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.tList}>
        <span className={styles.add} onClick={addModal}>
          <i className="iconfont iconrenyuandangan" />
          <PlusOutlined />
          新建模板
        </span>
        <span className="lineT">模板列表</span>
        <div className={styles.list}>
          {tableObj.listData.map(item => {
            return (
              <div key={item.id} className={styles.one}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.bot}>
                  <Tooltip placement="topLeft" title={item.content}>
                    <span className={styles.content}>{item.content}</span>
                  </Tooltip>
                  <span>
                    创建于：
                    {props.moment(item.created).format(props.dateFormat)}
                  </span>
                  <span>
                    <span className={styles.look} onClick={editSMS(item)}>
                      <i className="iconfont iconxiangqing" />
                      查看
                    </span>
                    <span className={styles.delete} onClick={deleteSMS(item)}>
                      <i className="iconfont iconshanchu" />
                      删除
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Pagination
          total={tableObj.total}
          current={tableObj.pageNum}
          pageSize={tableObj.pageSize}
          showSizeChanger
          showQuickJumper
          defaultPageSize={5}
          pageSizeOptions={['5', '10', '20', '50']}
          onChange={pageChange}
          onShowSizeChange={pageChange}
          className={styles.pageN}
        />
      </div>

      <Modal
        title="新建模板"
        visible={addObj.show}
        className={styles.addModal}
        onCancel={closeAddModal}
        onOk={handleAddOk}
        centered={true}
      >
        <div className={styles.one}>
          <span className="required">模版标题：</span>
          <Input
            className={styles.title}
            value={addObj.title || ''}
            placeholder="请输入模板标题"
            onChange={e => props.immerChange(setAdd, 'title', e.target.value)}
          />
        </div>
        <div className={styles.one}>
          <span className="required">短信内容：</span>
          <Input.TextArea
            type="text"
            value={addObj.content}
            placeholder="请输入短信内容"
            onChange={e => props.immerChange(setAdd, 'content', e.target.value)}
          />
        </div>
        <div className={styles.one}>
          <span>诈骗类型：</span>
          <Select
            className={styles.statusSelect}
            value={addObj.fraudType || undefined}
            style={{ width: 250 }}
            placeholder="请选择诈骗类型"
            onChange={e => props.immerChange(setAdd, 'fraudType', e)}
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
        <div className={styles.one}>
          <span>预警等级：</span>
          <Select
            className={styles.statusSelect}
            style={{ width: 250 }}
            value={addObj.level || undefined}
            placeholder="请选择预警程度"
            onChange={e => props.immerChange(setAdd, 'level', e)}
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
        <div className={styles.one}>
          <span>状态：</span>
          <Select
            className={styles.statusSelect}
            style={{ width: 250 }}
            value={addObj.statusE}
          >
            onChange={e => props.immerChange(setAdd, 'statusE', e)}
            <Select.Option value="Y">可用</Select.Option>
            <Select.Option value="N">禁用</Select.Option>
          </Select>
        </div>
      </Modal>

      <Modal
        title="模板详情"
        visible={editObj.show}
        className={styles.editModal}
        onCancel={closeEditModal}
        onOk={handleEditOk}
        centered={true}
        width="600px"
      >
        <div className={styles.top}>
          <div className={styles.title}>
            {editObj.inEdit ? (
              <>
                <span className="required">模板标题：</span>
                <Input
                  value={editObj.title}
                  style={{ width: 250 }}
                  placeholder="请输入标题"
                  onChange={e =>
                    props.immerChange(setEdit, 'title', e.target.value)
                  }
                />
              </>
            ) : (
              editObj.title
            )}
          </div>
          <div className={styles.search}>
            <i className="iconfont iconrenyuandangan" />
            <span>
              {props.moment(editObj.created).format(props.dateFormat)}
            </span>
            <Button
              icon={<DeleteOutlined />}
              onClick={deleteSMS(editObj)}
              className={styles.deleteM}
            >
              删除
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className={styles.editM}
              onClick={() => props.immerChange(setEdit, 'inEdit', true)}
            >
              编辑
            </Button>
          </div>
        </div>
        <span className={styles.split} />
        <div className={styles.smsInfo}>
          <span>
            <span className={styles.key}>创建人：</span>
            <span className={styles.val}>{editObj.userName}</span>
          </span>
          <span>
            <span className={styles.key}>当前状态：</span>
            <span
              className={`${styles.val} ${
                editObj.enabled === 'Y' ? styles.in : styles.out
              }`}
            >
              {editObj.inEdit ? (
                <Select
                  className={styles.statusSelect}
                  style={{ width: 100 }}
                  onChange={v => props.immerChange(setEdit, 'enabled', v)}
                  value={editObj.enabled || undefined}
                >
                  <Select.Option value="Y">可用</Select.Option>
                  <Select.Option value="N">禁用</Select.Option>
                </Select>
              ) : (
                <>
                  <span className={`${styles.circle}`} />
                  {editObj.enabled === 'Y' ? '可使用' : '禁用'}{' '}
                </>
              )}
            </span>
          </span>
        </div>
        <div className={styles.smsInfo}>
          <span>
            <span className={styles.key}>诈骗类型：</span>
            <span className={`${styles.val}`}>
              {editObj.inEdit ? (
                <Select
                  className={styles.statusSelect}
                  value={editObj.fraudType || undefined}
                  style={{ width: 200 }}
                  placeholder="请选择诈骗类型"
                  onChange={v => props.immerChange(setEdit, 'fraudType', v)}
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
              ) : (
                <>
                  <span className={`${styles.circle}`} />
                  {editObj.fraudTypeDesc}{' '}
                </>
              )}
            </span>
          </span>
          <span>
            <span className={styles.key}>预警等级：</span>
            <span className={`${styles.val}`}>
              {editObj.inEdit ? (
                <Select
                  className={styles.statusSelect}
                  style={{ width: 200 }}
                  value={editObj.level || undefined}
                  placeholder="请选择预警程度"
                  onChange={v => props.immerChange(setEdit, 'level', v)}
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
              ) : (
                <>
                  <span className={`${styles.circle}`} />
                  {editObj.levelDesc}{' '}
                </>
              )}
            </span>
          </span>
        </div>
        <div>
          <span className="lineT">短信内容</span>
          <Input.TextArea
            type="text"
            value={editObj.content}
            disabled={!editObj.inEdit}
            className={styles.textM}
            onChange={e =>
              props.immerChange(setEdit, 'content', e.target.value)
            }
          />
        </div>
      </Modal>
    </>
  );
};
