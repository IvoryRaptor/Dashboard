export default {
  namespace: 'ws',
  state: {
    wsState: false,
    wsLoading: {

    },
  },
  effects: {
  },
  reducers: {
    open (state, { payload }) {
      return {
        ...state,
        wsState: payload,
      }
    },
    close (state, { payload }) {
      return {
        ...state,
        wsState: payload,
      }
    },
    loading (state, { payload }) {
      state.wsLoading[payload.resource][payload.action] = payload.loading
      return {
        ...state,
      }
    },
  },
}

