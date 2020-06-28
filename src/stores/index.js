import { init } from '@rematch/core';
import * as models from './models';
import createRematchPersist from '@rematch/persist';

const persistPlugin = createRematchPersist({
  key: 'af',
  keyPrefix: 'ty-',
  whitelist: ['system'],
  serialize: true,
  // blacklist: ['abc'],
  throttle: 1,
});
const store = init({
  models,
  plugins: [persistPlugin],
});

// if (module.hot) {
//   module.hot.accept('./models', () => {
//     store.replaceReducer(require('./models/index'))
//   })
// }

export default store;
