import { Form, Input, Select, Switch, Radio, Checkbox, Modal } from 'antd'
import { Template } from '../../goshawk/templates'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const FormItem = Form.Item


class Field extends Template {
  constructor ({ key, type, input, ...attr }) {
    super()
    this.key = key
    this.type = type || 'string'
    this.input = input || 'text'
    Object.assign(this, attr)
  }

  getField (name) {
    return this.fields[name]
  }

  setValue (object, { value }) {
    object[this.key] = value
  }

  showRender (obj) {
    return obj ? obj[this.key] : null
  }

  editRender ({ getFieldDecorator, object }) {
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key
    return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
      {getFieldDecorator(formKey, {
        rules: [
          { required: true },
        ],
        initialValue: object[this.key],
      })(<Input />)
      }
    </FormItem>)
  }
}

export default Field

