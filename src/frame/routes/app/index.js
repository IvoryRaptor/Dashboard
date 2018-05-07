/* global window */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { LocaleProvider, BackTop, Modal } from 'antd'
import { Layout, Loader } from 'components'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import '../../../themes/index.less'
import './index.less'
import Error from '../error'

const { prefix, openPages } = config
const { Header, Bread, Footer, Sider, styles } = Layout
let lastHref

const App = ({ children, dispatch, app, task, loading, location, locale, ws: { wsState, wsLoading } }) => {
  const { user, siderFold, darkTheme, isNavbar, isMenuInline, menuPopoverVisible, navOpenKeys, project } = app
  let { menu } = app
  if (menu) {
    menu.map((x) => {
      x.name = window.goshawk.getLocale(`menu/values/${x.key}`)
    })
    // menu = menu.map(x => Object.assign(x, locale.menu.find(y => y === x.key)))
  }

  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo, iconFontUrl } = config
  const href = window.location.href

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  if (wsState) {
    let { socket } = wsState
    if (socket.readyState > 1) {
      Modal.error({
        title: window.goshawk.getLocale('pages/alert/sessionTimeout/title'),
        content: window.goshawk.getLocale('pages/alert/sessionTimeout/msg'),
        onOk () {
          window.location.reload()
        },
        onCancel () {},
      })
    }
  }

  const headerProps = {
    menu,
    task,
    user,
    location,
    siderFold,
    isNavbar,
    isMenuInline,
    menuPopoverVisible,
    navOpenKeys,
    changeLanguage (language) {
      dispatch({ type: 'locale/setLocale', payload: language })
    },
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout () {
      dispatch({ type: 'app/logout' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
    handleClickNavMenu (item) {
      dispatch({ type: 'app/handleNavMenuClick', payload: { menuKey: item.key } })
      dispatch({ type: 'app/switchMenuPopver' })
    },
  }

  const siderProps = {
    app,
    menu,
    location,
    isMenuInline,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys (openKeys) {
      window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
    handleClickNavMenu (item) {
      dispatch({ type: 'app/handleNavMenuClick', payload: { menuKey: item.key } })
    },
  }

  const breadProps = {
    menu,
    location,
  }
  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Helmet>
        <title>{project.title}</title>
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontUrl && <script src={iconFontUrl} />}
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      {children}
    </div>)
  }
  return (
    <div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Helmet>
        <title>{project.title}</title>
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontUrl && <script src={iconFontUrl} />}
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <LocaleProvider locale={locale.antd}>
        <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
          {!isNavbar ? <aside className={classnames(styles.sider)}>
            {siderProps.menu.length === 0 ? null : <Sider {...siderProps} />}
          </aside> : ''}
          <div className={styles.main} id="mainContainer">
            <BackTop target={() => document.getElementById('mainContainer')} visibilityHeight={700} />
            <Header {...headerProps} />
            <Bread {...breadProps} />
            <div className={styles.container}>
              <div className={styles.content}>
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </LocaleProvider>

    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  task: PropTypes.object,
  loading: PropTypes.object,
  locale: PropTypes.object,
  ws: PropTypes.object,
}

export default withRouter(connect(({ app, loading, locale, ws, task }) => ({ app, loading, locale, ws, task }))(App))
