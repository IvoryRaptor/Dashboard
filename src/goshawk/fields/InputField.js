import React from 'react'
import { Form, Input } from 'antd'
import Field from './Field'

const { TextArea } = Input
const FormItem = Form.Item

class InputField extends Field {
  getField (name) {
    return this.fields[name]
  }

  showRender (obj) {
    return obj ? obj[this.key] : null
  }

  setValue (object, { value }) {
    object[this.key] = value
  }

  editRender ({ getFieldDecorator, object, formItemLayout }) {
    object[this.key] = object[this.key] ? object[this.key] : ''
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key

    const inputHtml = () => {
      switch (this.input) {
        case 'textarea':
          return (getFieldDecorator(formKey, {
            rules: [
              { required: this.required, message: `请输入${this.resource.getLocale().fields[this.key]}` },
            ],
            initialValue: object[this.key],
          })(<TextArea autosize />))
        default:
          return (getFieldDecorator(formKey, {
            rules: [
              { required: this.required, message: `请输入${this.resource.getLocale().fields[this.key]}` },
            ],
            initialValue: object[this.key],
          })(<Input disabled={this.disable} />))
      }
    }

    return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
      {this.display ? <strong>{object[this.key]}</strong> : inputHtml() }
    </FormItem>)
  }
}

export default InputField

