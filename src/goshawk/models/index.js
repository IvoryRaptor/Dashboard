export default class ModelPluses {
  constructor (dva) {
    this.dva = dva
    this.modelPluses = {}
  }
  plus (m) {
    this.modelPluses[m.namespace] = m
  }
  add (m) {
    const plus = this.modelPluses[m.namespace]
    if (plus) {
      m = {
        namespace: m.namespace,
        state: {
          ...m.state,
          ...plus.state,
        },
        subscriptions: {
          ...m.subscriptions,
          ...plus.subscriptions,
        },
        effects: {
          ...m.effects,
          ...plus.effects,
        },
        reducers: {
          ...m.reducers,
          ...plus.reducers,
        },
      }
    }
    if (!this.dva._models.some(val => val.namespace === m.namespace)) {
      this.dva.model(m)
    }
  }
}
