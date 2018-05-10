/* global window */

export default {
  namespace: 'task',
  state: {
    list: 'current',
    currentList: {},
    historyList: {},
    todo: 0,
    modalAction: 'create',
    modalVisible: false,
    modalLoading: false,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      // setInterval(() => {
      //   dispatch({ type: 'task/$list', payload: {} })
      //   dispatch({ type: 'task/$list', payload: { type: 'history' } })
      // }, 150000)
      history.listen((location) => {
        if (location.pathname === '/task') {
          dispatch({ type: 'task/$list', payload: {} })
        }
      })
    },
  },

  effects: {
    * _list ({ payload }, { put }) {
      if (payload.type === 'current') {
        yield put({ type: 'updateState', payload: { todo: payload.total, currentList: payload } })
      } else {
        yield put({ type: 'updateState', payload: { historyList: payload } })
      }
    },
  },

  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

