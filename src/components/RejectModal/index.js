import React, { useState, useEffect } from 'react';
import { Input, Button, message, Modal, Select, DatePicker } from 'antd';
import { useEventTarget, useDebounceFn } from '@umijs/hooks';
import axios from 'axios';
import styles from './index.less';
import { useSelector } from 'react-redux';
import { useImmer } from 'use-immer';

const { RangePicker } = DatePicker;
export default props => {
  const [reason, setReason] = useState(1);
  const { parentOrgName } = useSelector(state => state.backEnd);

  const closeModal = () => {
    setReason(1);
    props.close();
  };

  const { run: handleOk } = useDebounceFn(() => {
    if (reason.length > 256) {
      message.warn('驳回理由不能超过256个字符！');
      return;
    }
    let params = {
      backType: reason,
      id: props.item.id,
      version: props.item.version,
    };
    axios.post('antifraud/fraud/back', params).then(res => {
      if (res) {
        message.success('驳回成功！');
        closeModal();
        props.getTable();
      }
    });
  }, 200);

  return (
    <Modal
      title="驳回"
      visible={props.showModal}
      className={styles.mainWrap}
      onCancel={closeModal}
      onOk={handleOk}
      centered={true}
    >
      <div className={styles.one}>
        <span style={{ marginBottom: 8, display: 'block' }}>
          移交对象：<span className="bold">{parentOrgName}</span>
        </span>
      </div>
      <div className={styles.reason}>
        提交理由：
        <Select
          className={styles.seniorSelect}
          value={reason}
          onChange={v => setReason(v)}
        >
          <Select.Option value={1}>不属辖区管辖</Select.Option>
          <Select.Option value={2}>预警信息重复</Select.Option>
        </Select>
      </div>
    </Modal>
  );
};
