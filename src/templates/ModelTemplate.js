export default (namespace, plus) => {
  if (!plus){
    plus = {}
  }
  const {state,effects,reducers,subscriptions} = plus
  return {
    namespace: namespace,
    state: {
      list: [],
      listLoading: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        hideOnSinglePage: false,
        current: 1,
        total: 0,
        pageSize: 10,
      },
      currentItem: {},
      detailsLoading: true,
      modalAction: 'create',
      modalVisible: false,
      modalLoading: false,
      selectedRowKeys: [],
      sorter: {},
      filter: 'all',
      lastquery: {},
      ...state
    },
    subscriptions:{
      ...subscriptions
    },
    effects: {
      * fetch(payload, {select, put}) {
        const sendpayload = yield select(state => state[namespace].lastquery)
        yield put({
          type: `${namespace}/$list`,
          payload: sendpayload,
          loading: 'listLoading',
        })
      },

      * findOne({payload}, {put}) {
        yield put({
          type: `${namespace}/$get`,
          payload: {
            query: payload,
          },
          loading: 'detailsLoading',
        })
      },

      * _get({payload = {}}, {put}) {
        yield put({
          type: 'setValue',
          payload: {
            currentItem: payload,
          },
        })
      },

      * _list({payload = {}}, {put}) {
        yield put({
          type: 'setValue',
          payload: {lastquery: payload.query},
        })
        yield put({
          type: 'querySuccess',
          payload: {
            list: payload.data,
            pagination: {
              current: Number(payload.current) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: payload.total,
            },
            sorter: payload.sorter,
            selectedRowKeys: [],
          },
        })
      },
      * _delete(payload, {put}) {
        yield yield put({type: 'fetch'})
      },
      * updateItem({payload}, {put}) {
        yield put({
          type: `${namespace}/$save`,
          payload,
          loading: 'modalLoading',
        })
      },

      * _save({error}, {put}) {
        if (!error) {
          yield put({type: 'hideModal'})
          yield put({type: 'fetch'})
        } else {
          throw error.message || '网络错误'
        }
      },
      ...effects
    },
    reducers: {
      setValue(state, {payload}) {
        return {
          ...state,
          ...payload,
        }
      },
      querySuccess(state, {payload}) {
        const {list, pagination, ...settings} = payload
        return {
          ...state,
          list,
          pagination: {
            ...state.pagination,
            ...pagination,
          },
          ...settings,
        }
      },

      showModal(state, {payload}) {
        return {...state, ...payload, modalVisible: true}
      },

      hideModal(state) {
        return {...state, modalVisible: false}
      },
      ...reducers
    },
  }
}

