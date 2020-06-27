import produce from 'immer';

const initState = {
  topActive: '',
};
export default {
  state: initState,
  reducers: {
    updateKey(state, data) {
      return produce(state, draftState => {
        if (typeof data === 'object') {
          for (let keyName in data) {
            draftState[keyName] = data[keyName];
          }
        }
      });
    },
  },
  effects: {
    async incrementAsync(payload, rootState) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.increment(payload);
    },
  },
};
