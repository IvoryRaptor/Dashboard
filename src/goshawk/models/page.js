let sysHistory = null
let sysDispatch = null
export default {
  namespace: 'page',

  state: {},

  subscriptions: {
    setup ({ dispatch, history }) {
      sysHistory = history
      sysDispatch = dispatch
    },
  },

  effects: {
    * _all ({ payload }) {
      const goshawk = window.goshawk
      payload.data.map((item) => {
        item.resource = goshawk.resources[item.resource]
        item.template = goshawk.templates.create(item.template, item)
        goshawk.pages[item.path] = item
      })
      yield sysHistory.listen((location) => {
        payload.data.map((item) => {
          if (location.pathname === item.path) {
            item.setup.map((send) => {
              sysDispatch(send)
            })
          }
        })
      })
    },
  },
  reducers: {},
}
