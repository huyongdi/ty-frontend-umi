// 用来维护后端的全局接口。比如预警等级，诈骗类型
import produce from 'immer';
import axios from 'axios';

const initState = {
  identify: null, // 当前用户的级别 1-市局 2-分局 3-派出所
  parentOrgName: null, // 当前用户上一级的组织名称
  nextOrg: [], // 下一级的部门
};
export default {
  state: initState,
  reducers: {
    updateKey(state, data) {
      let nextState = produce(state, draftState => {
        if (Array.isArray(data)) {
          // 不是第一层的传数组 比如['activeMenu',{}]
          const len = data.length;
          const obj = data[len - 1];
          for (let key in obj) {
            len === 2 && (draftState[data[0]][key] = obj[key]);
          }
        } else {
          // 最外层约定传对象
          for (let key in data) {
            draftState[key] = data[key];
          }
        }
      });
      return nextState;
    },
  },
  effects: {
    // 获取后端config信息
    async getBackEndConfig(payload, rootState) {
      let typeArr = [
        'FRAUD_LEVEL',
        'FRAUD_SOURCE',
        'PROCESS_TYPE',
        'FRAUD_LEVEL',
      ];
      typeArr.forEach(type => {
        axios
          .post('antifraud/fraudConfig/getKeyValue', { type, formData: true })
          .then(res => {
            this.updateKey({
              [type]: res,
            });
          });
      });
    },
    // 获取当前用户组织信息
    async getIdentify(payload, rootState) {
      axios.get('antifraud/organization/identify').then(res => {
        this.updateKey({
          identify: res.identify,
          parentOrgName: res.parent.name,
        });
      });
    },
    // 获取当前用户的组织信息下一级  antifraud/organization/juniors
    async getNextOrg(payload, rootState) {
      axios.get('antifraud/organization/juniors').then(res => {
        this.updateKey({
          nextOrg: res,
        });
      });
    },
  },
};
