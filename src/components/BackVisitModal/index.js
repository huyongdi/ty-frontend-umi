import React, { useState } from 'react'
import { DatePicker, Input, message, Modal, Radio } from 'antd'
import { useDebounceFn } from '@umijs/hooks'
import axios from 'axios'
import styles from './index.less'
import { useSelector } from 'react-redux'

const { RangePicker } = DatePicker
export default props => {
  const [effOrInv, setEI] = useState(1) // 是否有效
  const [reason, setReason] = useState(null)
  const [backTime, setTime] = useState(null) // 回访时间
  const { parentOrgName } = useSelector(state => state.backEnd)

  const closeModal = () => {
    setReason(null)
    setEI(1)
    setTime(null)
    props.close()
  }

  const { run: handleOk } = useDebounceFn(() => {
    if (reason.length > 256) {
      message.warn('驳回理由不能超过256个字符！')
      return
    }
    let params = {
      fraudId: props.item.id,
      remark: reason,
      time: backTime ? backTime.valueOf() : '',
      truthful: effOrInv
    }
    axios.post('antifraud/fraud/return/visit/add', params).then(res => {
      if (res) {
        message.success('驳回成功！')
        closeModal()
        props.getTable()
      }
    })
  }, 200)

  return (
    <Modal
      title="回访登记"
      visible={props.showModal}
      className={styles.mainWrap}
      onCancel={closeModal}
      onOk={handleOk}
      centered={true}
    >
      <div className={styles.one}>
        是否有效：
        <Radio.Group
          className={styles.effRadio}
          value={effOrInv}
          onChange={e => setEI(e.target.value)}
        >
          <Radio value={1}>有效</Radio>
          <Radio value={0}>无效</Radio>
        </Radio.Group>
      </div>
      <div className={styles.one} style={{ display: 'block' }}>
        回访时间：
        <DatePicker
          className={styles.seniorSelect}
          showTime
          placeholder="请选择回访时间"
          value={backTime || null}
          onChange={date => {
            setTime(date)
          }}
        />
      </div>
      <div className={styles.reason}>
        备注：
        <Input.TextArea
          type="text"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
      </div>
    </Modal>
  )
}
