export default {
  namespace: 'resource',
  state: {},
  subscriptions: {
    setup ({ dispatch }) {
      dispatch({ type: 'resource/$all' })
    },
  },
  effects: {
    * _all ({ payload }, { put }) {
      const goshawk = window.goshawk
      payload.data.map((item) => {
        goshawk.templates.create('Resource', item)
        let model = {}
        if (item.model) {
          model = window.goshawk.templates.create(item.model.template, item)
          window.goshawk.model.add(model)
        }
        goshawk.resources[item.key] = window.goshawk.templates.create(item.template, item)
      })
      yield put({ type: 'locale/$get' })
    },
  },
  reducers: {},
}
