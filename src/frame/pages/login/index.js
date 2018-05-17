import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Radio, Select, Icon } from 'antd'
// import { config } from 'utils'
import styles from './index.less'
import goshawk from "../../../index";
import Cookies from "js-cookie";
// import Iconfont from '../../../../components/Iconfont/Iconfont'
// import '../../../../svg/libratone_logo.svg'

const Option = Select.Option
const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const Login = ({
  app,
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  const goshawk = window.goshawk
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      Cookies.remove('token')
      window.goshawk.connect({
        deviceName: values.loginid,
        secret: values.password
      })
      //goshawk.open()
      // dispatch({ type: 'app/$login', payload: values })
    })
  }
  function changeLanguage (e) {
    dispatch({ type: 'locale/setLocale', payload: e.target.value })
  }

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        {Object.keys(app.project).length > 0 && <svg className="icon" aria-hidden="true">
          <use xlinkHref={app.project.logo_dark} />
        </svg> }
        <span>{app.project.login_title}</span>
      </div>
      <form>
        <FormItem>
          <RadioGroup onChange={changeLanguage}
            value={goshawk.getLocale('locale')}
            size="small"
            className={styles.language}
          >
            <RadioButton value="cn">简体中文</RadioButton>
            <RadioButton value="en">English</RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('loginid', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input
            prefix={<Icon type="user" />}
            onPressEnter={handleOk}
            placeholder={goshawk.getLocale('pages/login/loginid')}
          />)}
        </FormItem>

        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input
            prefix={<Icon type="lock" />}
            type="password"
            onPressEnter={handleOk}
            placeholder={goshawk.getLocale('pages/login/password')}
          />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator('hosts', {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: 'china',
          })(<Select placeholder={goshawk.getLocale('pages/login/cluster')}>
            <Option value="usa">美国 - US</Option>
            <Option value="china">中国 - CN</Option>
            <Option value="european">欧洲 - EU</Option>
          </Select>)}
        </FormItem>

        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loading.effects.login}>
            {goshawk.getLocale('pages/login/sign_in')}
          </Button>
        </Row>
      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ app, loading }) => ({ app, loading }))(Form.create()(Login))
