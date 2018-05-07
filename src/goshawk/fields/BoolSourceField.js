import React from 'react'
import { Icon, Form, Switch } from 'antd'
import Field from './Field'

const FormItem = Form.Item

class BoolSourceField extends Field {
  showRender (obj) {
    switch (this.showType) {
      case 'icon':
        if (this.iconTrue || this.iconFalse) {
          if (obj[this.key]) {
            return this.iconTrue ? <Icon type={this.iconTrue} style={{ fontSize: 16, color: '#00a854' }} /> : null
          }
          return this.iconFalse ? <Icon type={this.iconFalse} style={{ fontSize: 16, color: '#00a854' }} /> : null
        }
        return obj[this.key] ?
          <Icon type="check-circle" style={{ fontSize: 16, color: '#52c41a' }} />
          :
          <Icon type="close-circle" style={{ fontSize: 16, color: '#f5222d' }} />

      case 'source':
        return obj[this.key] ? <Icon type="caret-up"
          style={{ fontSize: 16, color: '#00a854' }}
        /> : <span />
      case 'value':
        return obj[this.key] ? <Icon type="caret-up"
          style={{ fontSize: 16, color: '#00a854' }}
        /> : <span />
      default:
        if (obj[this.key]) {
          return this.iconTrue ?
            <Icon type={this.iconTrue} style={{ fontSize: 16, color: '#00a854' }} /> :
            <Icon type="check-circle" style={{ fontSize: 16, color: '#52c41a' }} />
        }
        return this.iconFalse ?
          <Icon type={this.iconFalse} style={{ fontSize: 16, color: '#00a854' }} /> :
          <Icon type="close-circle" style={{ fontSize: 16, color: '#f5222d' }} />
    }
  }

  editRender ({ getFieldDecorator, object, formItemLayout }) {
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key
    const checked = (typeof object[this.key] === 'undefined') ? true : object[this.key]
    object[this.key] = checked
    return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
      {
        getFieldDecorator(formKey, {})(<Switch checked={checked}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="cross" />}
        />)
      }
    </FormItem>)
  }
}

export default BoolSourceField

