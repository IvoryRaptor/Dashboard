export default {
  namespace: 'source',
  state: {},
  effects: {
  },
  reducers: {
    setValue (state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
