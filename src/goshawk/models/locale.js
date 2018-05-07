export default {
  namespace: 'locale',

  state: {},

  subscriptions: {
    setup ({ dispatch }) {
    },
  },

  effects: {
    * _get ({ payload }, { put }) {
      yield put({ type: 'setValue',
        payload: {
          all: payload,
        } })
      yield put({ type: 'page/$all' })
    },
  },
  reducers: {
    setValue (state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
