import React, { useState, useEffect } from 'react';
import {
  Table,
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
// import TYMap, {Popup} from 'tymap'
import styles from './index.less';

export default props => {
  const [traType, setTra] = useState(1); // 列表模式还是地图模式
  const traColumns = [
    {
      title: '采集时间',
      dataIndex: 'timestamp',
      width: 300,
      render: text => props.moment(text).format(props.dateFormat),
    },
    {
      title: '采集地点',
      dataIndex: 'address',
      // width: 70,
      render: text => text || '--',
    },
    {
      title: '发现类型',
      dataIndex: 'sourceName',
      width: 300,
      render: text => text || '--',
    },
    {
      title: '上图',
      dataIndex: '_key8',
      width: 200,
      render: (text, record) => {
        return (
          <div className={styles.toMap} onClick={listToMap(record)}>
            <i className="iconfont iconshezhi" />
            轨迹上图
          </div>
        );
      },
    },
  ];
  const { traArr } = props;

  // 列表上面的 上图按钮
  const listToMap = item => () => {
    let { allDetail } = this.props.yjfk.toJS();
    const { id } = this.props.location.state;
    allDetail[id].traType = 2;
    this.props.updateKey({
      allDetail,
    });
    setTimeout(() => {
      document.getElementById(item._key).click();
    }, 0);
  };

  return (
    <div className={styles.mapWrap}>
      <div className={styles.btnC}>
        <span
          onClick={() => setTra(1)}
          className={`${traType === 1 ? styles.in : ''}`}
        >
          列表模式
        </span>
        <span
          onClick={() => setTra(2)}
          className={`${traType === 2 ? styles.in : ''}`}
        >
          地图模式
        </span>
      </div>
      <div className={`${styles.list} ${traType === 1 ? '' : 'hide'}`}>
        <Table
          columns={traColumns}
          dataSource={traArr || []}
          rowKey="source"
          style={{ marginTop: 20 }}
          scroll={{ y: 'calc(100vh - 28rem)' }}
          pagination={false}
        ></Table>
      </div>
      <div className={`${styles.map} ${traType === 2 ? '' : 'hide'}`}>
        <div className={styles.mapC}>
          {
            // traType === 2 &&
            // <TYMap className={`${style.echart1} ${style.tyM}`} url={url}
            //        center={mapCenter} zoom={12} boundsOptions={{maxZoom: 17}}
            //        bounds={popups.position ? [] : traResult || []}>
            //   <DivPoint points={traResult || []} pointdetal={this.pointdetal}/>
            //   <Popup position={popups.position} content={popups.popup}/>
            // </TYMap>
          }
          <div className={styles.mapList}>
            <div>轨迹列表</div>
            <div className={styles.listC}>
              {
                // traArr.map(item => {
                //   return <div key={item._key} className={styles.one} onClick={this.leftClick(item)}>
                //     <div className={styles.addr}>{item.sourceName || '--'}</div>
                //     <div className={styles.detail}>{item.address}</div>
                //     <div className={styles.time}>{moment(item.timestamp).format(dateFormat)}</div>
                //     <i className={`iconfont iconshezhi ${styles.icon}`}/>
                //     <span className={styles.leftLine}/>
                //     <span className={styles.rightMark}>人像抓拍</span>
                //   </div>
                // })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
