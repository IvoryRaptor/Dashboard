import React from 'react'
import PropTypes from 'prop-types'
import { config } from 'utils'
import { Link } from 'react-router-dom'
import styles from './Layout.less'
import Menus from './Menu'
import Iconfont from '../Iconfont/Iconfont'
import '../../svg/libratone_logo.svg'

const Sider = ({ app, siderFold, isMenuInline, darkTheme, location, handleClickNavMenu, navOpenKeys, changeOpenKeys, menu }) => {
  const menusProps = {
    app,
    menu,
    siderFold,
    isMenuInline,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
    handleClickNavMenu,
  }

  return (
    <div>
      <div className={styles.logo}>
        <Link to={'/dashboard'}>
          {Object.keys(app.project).length > 0 && <svg className="icon" aria-hidden="true">
            <use xlinkHref={app.project.logo_light} />
          </svg> }
          {siderFold ? '' : <span>{app.project.sider_title}</span>}
        </Link>
      </div>
      <Menus {...menusProps} />
    </div>
  )
}

Sider.propTypes = {
  app: PropTypes.object,
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  handleClickNavMenu: PropTypes.func,
}

export default Sider
