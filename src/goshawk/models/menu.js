/* global window */

export default {
  namespace: 'menu',
  state: {
  },
  effects: {
    * _all ({ payload }, { put }) {
      const { data } = payload
      yield put({ type: 'app/updateState',
        payload: {
          menu: data,
        } })
    },
  },

  reducers: {},
}

