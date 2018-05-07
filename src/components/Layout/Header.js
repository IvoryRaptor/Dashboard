import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu, Icon, Popover, Select, Badge, Dropdown } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'

const SubMenu = Menu.SubMenu
const Option = Select.Option

const Header = ({
  user,
  menu,
  task,
  logout,
  switchSider,
  siderFold,
  isNavbar,
  isMenuInline,
  menuPopoverVisible,
  location,
  switchMenuPopover,
  handleClickNavMenu,
  navOpenKeys,
  changeOpenKeys,
  changeLanguage,
}) => {
  let count = 0
  const { todo } = task
  let handleClickMenu = e => e.key === 'logout' && logout()
  const menusProps = {
    menu,
    isNavbar,
    isMenuInline,
    switchMenuPopover,
    handleClickNavMenu,
    location,
    navOpenKeys,
    changeOpenKeys,
    changeLanguage,
  }

  const userMenu = (
    <Menu onClick={handleClickMenu}>
      <Menu.Item key="setting" className={styles.menuItem}>
        <Icon type="setting" style={{ marginRight: 5 }} /> {window.goshawk.getLocale('pages/header/setting')}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" className={styles.menuItem}>
        <Icon type="logout" style={{ marginRight: 5 }} /> {window.goshawk.getLocale('pages/header/logout')}
      </Menu.Item>
    </Menu>
  )

  return (
    <div className={styles.header}>
      {isNavbar
        ? <Popover placement="bottomLeft"
          onVisibleChange={switchMenuPopover}
          visible={menuPopoverVisible}
          overlayClassName={styles.popovermenu}
          trigger="click"
          content={<Menus {...menusProps} />}
        >
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div
          className={styles.button}
          onClick={switchSider}
        >
          <Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
        </div>}
      <div className={styles.rightWarpper}>
        <Link to={'/task'} style={{ color: 'inherit' }}>
          <div className={styles.button}>
            <Badge count={todo}>
              <Icon type="mail" style={{ fontSize: 18 }} />
            </Badge>
          </div>
        </Link>
        <Dropdown overlay={userMenu}>
          <div className={styles.button}>
            <Icon type="user" />
          </div>
        </Dropdown>

        <div className={styles.dropdown}>
          <Select
            size="small"
            value={window.goshawk.getLocale('locale')}
            style={{ width: 120 }}
            onChange={changeLanguage}
          >
            <Option value="en">English</Option>
            <Option value="cn">简体中文</Option>
          </Select>
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  task: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  isMenuInline: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  changeLanguage: PropTypes.func,
}

export default Header
