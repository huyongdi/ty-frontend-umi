import React from 'react';
import { Empty } from '@components';
import styles from './index.less';
import mapP from '@img/personM.png';

export default props => {
  const { peopleArr } = props;

  return (
    <div className={styles.relationWrap}>
      <span className="lineT">为您推送与受害人关联度最紧密的紧急联系人</span>
      <div className={styles.relationC}>
        {peopleArr &&
          peopleArr.map(item => {
            return (
              <div key={item.fid} className={styles.one}>
                <img
                  src={
                    item.photo ? `data:image/jpeg;base64,${item.photo}` : mapP
                  }
                  alt="图片"
                />
                <div className={styles.right}>
                  <div>
                    <span className={styles.name}>{item.xm}</span>
                    <span className={styles.idcard}>{item.sfzh}</span>
                  </div>
                  <div>
                    {/*<i className="iconfont iconwangluoyujing"/>*/}
                    {/*<span className={styles.addr}>--</span>*/}
                  </div>
                  <div className={styles.relationT}>
                    {/*<span>最后关联：--</span>*/}
                    {/*<span>--</span>*/}
                    {/*<span>--</span>*/}
                  </div>
                  <div className={styles.tel} style={{ marginTop: '60px' }}>
                    <i className="iconfont icondianhuahaoma" />
                    <span className={styles.phone}>
                      Tel：{item.lxfs || '--'}
                    </span>
                  </div>
                </div>
                <div className={styles.maybeRelation}>
                  <i
                    className="iconfont iconkenengguanxi"
                    style={{ color: '#1890FF' }}
                  />
                  <span>可能关系：{item.gx}</span>
                </div>
                <div className={styles.degree}>{/*关系度：--*/}</div>
              </div>
            );
          })}
        {peopleArr.length === 0 && <Empty content="暂无关系人" />}
      </div>
    </div>
  );
};
