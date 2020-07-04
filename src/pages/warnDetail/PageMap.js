import React, { useState } from 'react';
import { Table } from 'antd';
// import TYMap, {Popup} from 'tymap'
import styles from './index.less';
import { Config, Icon, Point, Popup, TileLayer, TYMap } from '@tymap/core';
import mapPerson from '@img/mapPerson.png';
import { useImmer } from 'use-immer';

export default props => {
  const [traType, setTra] = useState(1); // 列表模式还是地图模式
  const [popObj, setPop] = useImmer({
    position: null,
    sourceName: null,
    address: null,
    timestamp: null
  }); // 地图弹出层位置和信息

  const traColumns = [
    {
      title: '采集时间',
      dataIndex: 'timestamp',
      width: 300,
      render: text => props.moment(text).format(props.dateFormat)
    },
    {
      title: '采集地点',
      dataIndex: 'address',
      // width: 70,
      render: text => text || '--'
    },
    {
      title: '发现类型',
      dataIndex: 'sourceName',
      width: 300,
      render: text => text || '--'
    },
    {
      title: '上图',
      dataIndex: '_key8',
      width: 200,
      render: (text, record) => {
        return (
          <div className={styles.toMap} onClick={() => listToMap(record)}>
            <i className="iconfont iconshezhi" />
            轨迹上图
          </div>
        );
      }
    }
  ];
  const { traArr } = props;

  // 列表上面的 上图按钮
  const listToMap = item => {
    setTra(2);
    pointClick(item);
  };

  // 点击点
  const pointClick = item => {
    const { lng, lat, sourceName, address, timestamp } = item;
    setPop(draft => {
      draft.position = {
        lng,
        lat
      };
      draft.sourceName = sourceName;
      draft.address = address;
      draft.timestamp = timestamp;
    });
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
          bordered={true}
          columns={traColumns}
          dataSource={traArr || []}
          rowKey="source"
          style={{ marginTop: 20 }}
          scroll={{ y: 'calc(100vh - 28rem)' }}
          pagination={false}
        />
      </div>
      {traType === 2 && (
        <div className={`${styles.mapC}`}>
          {
            <TYMap
              crs={Config.CRS.BMap}
              url="http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518"
              center={{ lng: 106.552901, lat: 29.570045 }}
              zoom={12}
              boundsOptions={{ maxZoom: 17 }}
              bounds={traArr}
            >
              {traArr.map(item => {
                return (
                  <Point
                    key={item._key}
                    position={{ lat: item.lat, lng: item.lng }}
                    onClick={() => pointClick(item)}
                  >
                    <Icon iconUrl={mapPerson} />
                  </Point>
                );
              })}
              {popObj && (
                <Popup position={popObj.position}>
                  <div>数据源：{popObj.sourceName}</div>
                  <div>采集地址：{popObj.address}</div>
                  <div>
                    采集时间：
                    {props.moment(popObj.timestamp).format(props.dateFormat)}
                  </div>
                </Popup>
              )}

              <TileLayer.BMap />
            </TYMap>
          }
          <div className={styles.mapList}>
            <div>轨迹列表</div>
            <div className={styles.listC}>
              {traArr.map(item => {
                return (
                  <div
                    key={item._key}
                    className={styles.one}
                    onClick={() => pointClick(item)}
                  >
                    <div className={styles.addr}>{item.sourceName || '--'}</div>
                    <div className={styles.detail}>{item.address}</div>
                    <div className={styles.time}>
                      {props.moment(item.timestamp).format(props.dateFormat)}
                    </div>
                    <i className={`iconfont iconshezhi ${styles.icon}`} />
                    <span className={styles.leftLine} />
                    <span className={styles.rightMark}>人像抓拍</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
