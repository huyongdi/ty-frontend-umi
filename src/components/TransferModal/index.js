import React, { useState, useEffect } from 'react';
import { Input, Button, message, Modal, Select, DatePicker } from 'antd';
import { useEventTarget, useDebounceFn } from '@umijs/hooks';
import axios from 'axios';
import styles from './index.less';
import { useSelector } from 'react-redux';
import { useImmer } from 'use-immer';

const { RangePicker } = DatePicker;
export default props => {
  const [org, setOrg] = useState(null);
  const [reason, setReason] = useState('');
  const { nextOrg } = useSelector(state => state.backEnd);

  const closeTransModal = () => {
    setOrg(null);
    setReason('');
    props.close();
  };

  const { run: handleOk } = useDebounceFn(() => {
    if (!org) {
      message.info('请选择部门！');
    }
    let orgArr = org.split('-');
    let params = {
      code: orgArr[0],
      name: orgArr[1],
      frauds: props.transIds,
      remark: reason,
    };
    axios.post('antifraud/fraud/assign/do', params).then(res => {
      message.success('移交成功！');
      closeTransModal();
      props.getTable();
    });
  }, 200);

  return (
    <Modal
      title="手工移交"
      visible={props.showModal}
      className={styles.mainWrap}
      onCancel={closeTransModal}
      onOk={handleOk}
      centered={true}
    >
      <div className={styles.one}>
        <span
          style={{ marginBottom: 8, display: 'block' }}
          className="required"
        >
          移交对象：
        </span>
        <Select
          className={styles.seniorSelect}
          onChange={v => setOrg(v)}
          value={org}
          showSearch
          optionFilterProp="children"
          placeholder="请选择移交部门"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {nextOrg &&
            nextOrg.map(item => {
              return (
                <Select.Option
                  key={item.code}
                  value={`${item.code}-${item.name}`}
                >
                  {item.name}
                </Select.Option>
              );
            })}
        </Select>
      </div>
      <div className={styles.reason}>
        提交理由：
        <Input.TextArea
          type="text"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
      </div>
    </Modal>
  );
};
