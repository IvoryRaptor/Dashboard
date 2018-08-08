/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import queryString from 'query-string'
import Cookies from 'js-cookie'
// import MENU_ALL from '../../utils/menu'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    roles: [],
    permissions: {
      visit: [],
    },
    project: {},
    menu: [
      {
        id: '1',
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isMenuInline: document.body.clientWidth > 480,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory({dispatch, history}) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup({dispatch}) {
      const token = Cookies.get('token')
      if (token){
        window.goshawk.connect({
          deviceName: token,
          secret: ''
        })
      }else{
        dispatch({ type: 'toLogin' })
      }
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({type: 'changeNavbar'})
        }, 300)
      }
    },

  },
  effects: {
    * _set_user({payload, error}, {put, select}) {
      yield put({type: 'setUser', payload})
      yield put(routerRedux.push({pathname: '/dashboard'}))
    },
    * _login({payload, error}, {put, select}) {
      Cookies.set('token', payload.token)
      // console.log(payload.token)
    },
    //   const { locationQuery, locationPathname } = yield select(_ => _.app)
    //   // if (!error) {
    //   //   const { from } = locationQuery
    //   // yield put({type: 'menu/$all', payload: {order: {order: 1}}})
    //   // yield put({type: 'setUser', payload})
    //   // yield put({type: 'task/$list', payload: {}})
    //   //   if (from && from !== '/login') {
    //   //     yield put(routerRedux.push({ pathname: from }))
    //   //   } else {
    //   //     yield put(routerRedux.push({ pathname: locationPathname === '/login' ? '/dashboard' : locationPathname }))
    //   //   }
    //   // } else {
    //   //   yield put(routerRedux.push({
    //   //     pathname: '/login',
    //   //     search: locationPathname === '/login' ? null : queryString.stringify({ from: locationPathname }),
    //   //   }))
    //   //   throw error.message
    //   // }
    // },

    * toLogin({
                payload,
              }, {call, put, select}) {
      const {locationPathname} = yield select(_ => _.app)
      yield put(routerRedux.push({
        pathname: '/login',
        search: (locationPathname === '/login' || locationPathname === '/') ? null : queryString.stringify({from: locationPathname}),
      }))
    },

    * logout({
               payload,
             }, {call, put}) {
      Cookies.remove('token')
      yield put({
        type: 'toLogin',
      })
    },

    * changeNavbar(action, {put, select}) {
      const {app} = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      const isMenuInline = document.body.clientWidth > 480
      if (isNavbar !== app.isNavbar) {
        yield put({type: 'handleNavbar', payload: isNavbar})
      }
      if (isMenuInline !== app.isMenuInline) {
        yield put({type: 'handleMenuInline', payload: isMenuInline})
      }
    },

    * handleNavMenuClick({payload}, {put, select}) {
      const {menuKey} = payload
      const {menu} = yield select(_ => _.app)
      const clicked = menu.find(item => item.key === menuKey)
      yield put(routerRedux.push({pathname: clicked.route}))
    },

  },
  reducers: {
    setUser(state, {payload}) {
      let permissions = []
      Cookies.set('token', payload.token)
      payload.group.map((group) => {
        group.permission.map((permission) => {
          if (!permissions.find(i => i === permission)) {
            permissions.push(permission)
          }
        })
      })
      return {
        ...state,
        user: payload,
        permissions,
      }
    },

    setValue(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme(state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar(state, {payload}) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleMenuInline(state, {payload}) {
      return {
        ...state,
        isMenuInline: payload,
      }
    },

    handleNavOpenKeys(state, {payload: navOpenKeys}) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
