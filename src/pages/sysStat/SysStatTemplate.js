import React, { useState, useEffect } from 'react';
import { Select, Button, DatePicker, Progress } from 'antd';
import axios from 'axios';
import { TopSearch, TransferModal, RejectModal } from '@components';
import styles from './index.less';
import pageSizeOptions from '@utils/pageSizeOptions';
import { useConfigParse } from '@utils/useParse';
import { useImmer } from 'use-immer';
import { useSelector } from 'react-redux';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import echarts from 'echarts';

const { RangePicker } = DatePicker;

import tj1 from '@img/tj1.png';
import tj2 from '@img/tj2.png';
import tj3 from '@img/tj3.png';
import tj4 from '@img/tj4.png';
import tj5 from '@img/tj5.png';
import tj6 from '@img/tj6.png';
import tj7 from '@img/tj7.png';

export default props => {
  const { nextOrg } = useSelector(state => state.backEnd);

  const [condition, setCondition] = useImmer({
    business: '',
    startTime: null,
    endTime: null,
  });
  const [topData, setTop] = useState({}); // 成果统计
  const [effData, setEff] = useState({}); // 效率统计

  const changeCondition = (key, val) => {
    setCondition(draft => {
      draft[key] = val;
    });
  };
  useEffect(() => {
    getAllData();
  }, []);

  // 获取所有数据
  const getAllData = () => {
    const params = {
      organCode: condition.business,
      st: condition.startTime
        ? props.moment(condition.startTime).valueOf()
        : '',
      et: condition.endTime ? props.moment(condition.endTime).valueOf() : '',
      dataType: props.type,
    };
    getTop(params);
    getEff(params);
    getTypePie(params);
    getOrgType(params);
    getHours(params);
  };

  // 成果统计
  const getTop = params => {
    axios.post('antifraud/fraud/stat/total', params).then(res => {
      setTop(res);
    });
  };

  // 效率统计
  const getEff = params => {
    axios.post('antifraud/fraud/stat/effective', params).then(res => {
      setEff(res);
    });
  };

  const getTypePie = params => {
    axios.post('antifraud/fraud/stat/pie/type', params).then(res => {
      let typePie = res;
      let nameArr = [];
      typePie.forEach(item => {
        nameArr.push(item.name);
      });
      let myChart = echarts.init(document.getElementById('dealChart'));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          type: 'scroll',
          // orient: 'horizontal',
          orient: 'vertical',
          data: nameArr,
          align: 'right',
          right: 50,
          top: 50,
          width: '200px',
          height: '200px',
          itemGap: 10,
        },
        series: [
          {
            name: '',
            type: 'pie',
            avoidLabelOverlap: false,
            radius: ['40%', '60%'],
            center: ['30%', '50%'], // 圆心坐标
            // right: 10,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                position: 'center',
                fontSize: 20,
                // formatter: function () {
                //   return 12345
                // }
              },
            },
            labelLine: {
              show: false,
            },
            data: typePie,
          },
        ],
        color: [
          '#2244D8',
          '#33A6FF',
          '#6AB8FA',
          '#29C2FD',
          '#33D7FF',
          '#40CEC7',
          '#63D5B2',
          '#5BC49F',
          '#00BB99',
          '#77DD55',
        ],
      };
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    });
  };

  const getOrgType = params => {
    axios.post('antifraud/fraud/stat/pie/junior', params).then(res => {
      let orgPie = res;
      let nameArr = [];
      orgPie.forEach(item => {
        nameArr.push(item.name);
      });
      let myChart = echarts.init(document.getElementById('areaChart'));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          type: 'scroll',
          // orient: 'horizontal',
          orient: 'vertical',
          data: nameArr,
          align: 'right',
          right: 50,
          top: 50,
          width: '200px',
          height: '200px',
          itemGap: 10,
        },
        series: [
          {
            name: '',
            type: 'pie',
            avoidLabelOverlap: false,
            radius: ['40%', '60%'],
            center: ['30%', '50%'],
            // right: 10,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                position: 'center',
                fontSize: 20,
                // formatter: function () {
                //   return 12345
                // }
              },
            },
            labelLine: {
              show: false,
            },
            data: orgPie,
          },
        ],
        color: [
          '#397FFF',
          '#33D7FF',
          '#00BB99',
          '#77DD55',
          '#A3F42D',
          '#FFDD44',
          '#FFB811',
          '#FF6677',
          '#CC99FF',
        ],
      };
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    });
  };

  const getHours = params => {
    axios.post('antifraud/fraud/stat/bar/24h', params).then(res => {
      let timeObj = res;
      let myChart = echarts.init(document.getElementById('timeChart'));
      let option = {
        grid: {
          left: '50px',
          top: '30px',
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            params.value = params.value || 0;
            return params.name + '：' + params.value;
          },
        },
        xAxis: {
          type: 'category',
          data: [
            '00:00-01:00',
            '00:10-02:00.',
            '02:00-03:00',
            '03:00-04:00',
            '04:00-05:00',
            '05:00-06:00',
            '06:00-07:00',
            '07:00-08:00',
            '08:00-09:00',
            '09:00-10:00',
            '10:00-11:00',
            '11:00-12:00',
            '12:00-13:00',
            '13:00-14:00',
            '14:00-15:00',
            '15:00-16:00',
            '16:00-17:00',
            '17:00-18:00',
            '18:00-19:00',
            '19:00-20:00',
            '20:00-21:00',
            '21:00-22:00',
            '22:00-23:00',
            '23:00-24:00',
          ],
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#25233A', //坐标值得具体的颜色
            },
            interval: 0, //横轴信息全部显示
            rotate: -30, //-15度角倾斜显示
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#666', //坐标值得具体的颜色
            },
          },
        },
        series: [
          {
            data: timeObj,
            type: 'line',
            symbolSize: 8,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#01048A',
                },
              },
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(1,5,138,0.28)' },
                { offset: 1, color: 'rgba(255,255,255,0.14)' },
              ]),
            },
          },
        ],
      };
      myChart.setOption(option);
    });
  };

  const resetC = () => {
    setCondition(draft => {
      draft.business = '';
      draft.startTime = null;
      draft.endTime = null;
    });
    getAllData();
  };

  return (
    <div className={styles.statContent}>
      <div className={styles.search}>
        <span className="lineT">统计查询</span>
        <div className={styles.searchTop}>
          <div>
            业务中心：
            <Select
              className={styles.businessSelect}
              value={condition.business}
              onChange={v => changeCondition('business', v)}
            >
              <Select.Option value="">全部</Select.Option>
              {nextOrg.map(item => {
                return (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </div>
          <div>
            统计时间：
            <RangePicker
              style={{ width: 300 }}
              showTime={{ format: 'HH:mm' }}
              format={props.dateFormat}
              value={[condition.startTime, condition.endTime]}
              onChange={value => {
                changeCondition('startTime', value[0]);
                changeCondition('endTime', value[1]);
              }}
            />
          </div>
          <div>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className={styles.searchBtn}
              onClick={() => getAllData()}
            >
              查询
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => resetC()}>
              重置
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.newMd}>
        <div className={styles.top1}>
          <span className="lineT">成果统计</span>
          <div className={styles.resultTotal}>
            <div className={`${styles.one} ${styles.one1}`}>
              <span className={styles.title}>被骗金额(元)</span>
              <i className="iconfont iconyujingquanzu" />
              <span className={styles.money}>{topData.moneyDefraud || 0}</span>
            </div>
            <div className={`${styles.one} ${styles.one2}`}>
              <span className={styles.title}>劝阻金额(元)</span>
              <i className="iconfont iconyujingquanzu" />
              <span className={styles.money}>{topData.moneyDissuade || 0}</span>
            </div>
            <div className={`${styles.one} ${styles.one3}`}>
              <span className={styles.title}>及时止损(元)</span>
              <i className="iconfont iconyujingquanzu" />
              <span className={styles.money}>{topData.moneyOff || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.md}>
        <div className={styles.one}>
          <img src={tj1} alt="图片" />
          <span className={styles.name}>预警信息</span>
          <span className={styles.count}>{topData.total}</span>
        </div>
        <div className={styles.one}>
          <img src={tj2} alt="图片" />
          <span className={styles.name}>处理反馈</span>
          <span className={styles.count}>{topData.fb}</span>
        </div>
        <div className={styles.one}>
          <img src={tj3} alt="图片" />
          <span className={styles.name}>二次反馈</span>
          <span className={styles.count}>{topData.fbsec}</span>
        </div>
        <div className={`${styles.one} ${styles.noRight}`}>
          <img src={tj4} alt="图片" />
          <span className={styles.name}>预警超时</span>
          <span className={styles.count}>{topData.expired}</span>
        </div>
        <div className={styles.one}>
          <img src={tj5} alt="图片" />
          <span className={styles.name}>电话预警</span>
          <span className={styles.count}>{topData.phone}</span>
        </div>
        <div className={styles.one}>
          <img src={tj6} alt="图片" />
          <span className={styles.name}>短信预警</span>
          <span className={styles.count}>{topData.sms}</span>
        </div>
        <div className={styles.one}>
          <img src={tj7} alt="图片" />
          <span className={styles.name}>上门预警</span>
          <span className={styles.count}>{topData.visit}</span>
        </div>
      </div>

      <div className={styles.circleType}>
        <div className={styles.left}>
          <span className="lineT">效率统计</span>
          <div className={styles.circleContent}>
            <div className={styles.line}>
              <div className={styles.one}>
                <Progress
                  width={60}
                  type="circle"
                  strokeColor={{ '0%': '#61FFFA', '100%': '#328BFF' }}
                  percent={parseFloat(effData.normal)}
                  format={percent => (
                    <i
                      className={`iconfont iconyujingzhengchang ${styles.mdImg}`}
                    />
                  )}
                />
                <span className={styles.percent}>{effData.normal}%</span>
                <span className={styles.name}>预警正常处置率</span>
              </div>
              <div className={styles.one}>
                <Progress
                  width={60}
                  type="circle"
                  strokeColor={{ '0%': '#61FFFA', '100%': '#328BFF' }}
                  percent={parseFloat(effData.effectiveVisit)}
                  format={percent => (
                    <i
                      className={`iconfont iconshangmenchuzhi ${styles.mdImg}`}
                    />
                  )}
                />
                <span className={styles.percent}>
                  {effData.effectiveVisit}%
                </span>
                <span className={styles.name}>有效上门劝阻率</span>
              </div>
              <div className={styles.one}>
                <Progress
                  width={60}
                  type="circle"
                  strokeColor={{ '0%': '#61FFFA', '100%': '#328BFF' }}
                  percent={parseFloat(effData.fbsec)}
                  format={percent => (
                    <i
                      className={`iconfont iconercizhengchang ${styles.mdImg}`}
                    />
                  )}
                />
                <span className={styles.percent}>{effData.fbsec}%</span>
                <span className={styles.name}>二次反馈率</span>
              </div>
              <div className={styles.one}>
                <Progress
                  width={60}
                  type="circle"
                  strokeColor={{ '0%': '#61FFFA', '100%': '#328BFF' }}
                  percent={parseFloat(effData.truth)}
                  format={percent => (
                    <i
                      className={`iconfont iconchuzhizhengchang ${styles.mdImg}`}
                    />
                  )}
                />
                <span className={styles.percent}>{effData.truth}%</span>
                <span className={styles.name}>处置真实率</span>
              </div>
              <div className={styles.one}>
                <Progress
                  width={60}
                  type="circle"
                  strokeColor={{ '0%': '#61FFFA', '100%': '#328BFF' }}
                  percent={parseFloat(effData.emerg)}
                  format={percent => (
                    <i
                      className={`iconfont iconjinjiyouxiao ${styles.mdImg}`}
                    />
                  )}
                />
                <span className={styles.percent}>{effData.emerg}%</span>
                <span className={styles.name}>紧急有效处置率</span>
              </div>
              <div className={styles.one}>
                <Progress
                  width={60}
                  type="circle"
                  strokeColor={{ '0%': '#61FFFA', '100%': '#328BFF' }}
                  percent={parseFloat(effData.effectivePhone)}
                  format={percent => (
                    <i className={`iconfont icondianhua ${styles.mdImg}`} />
                  )}
                />
                <span className={styles.percent}>
                  {effData.effectivePhone}%
                </span>
                <span className={styles.name}>有效电话预警</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.pieChart}>
        <div className={styles.dealChart}>
          <span className="lineT">预警类型</span>
          <div className={styles.yjType}>预警类型</div>
          <div className={styles.echartConetnt} id="dealChart"></div>
        </div>
        <div className={styles.areaChart}>
          <span className="lineT">下属机构所属</span>
          <div className={styles.yjType}>下属机构所属</div>
          <div className={styles.echartConetnt} id="areaChart" />
        </div>
      </div>
      <div className={styles.brokenLine}>
        <span className="lineT">反馈处置时段</span>
        <div className={styles.timeChart} id="timeChart" />
      </div>
    </div>
  );
};
