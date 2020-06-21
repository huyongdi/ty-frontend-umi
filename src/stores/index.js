import {init} from '@rematch/core'
import * as models from './models'

const store = init({
    models,
})

if (module.hot) {
    module.hot.accept('./models', () => {
        store.replaceReducer(require('./models/index'))
    })
}

const {dispatch, getState} = store

export default store

// export {
//     store,
//     dispatch,
//     getState
// }
