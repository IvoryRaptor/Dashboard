import React from 'react'
import { Form, Input, Tag} from 'antd'
import Field from './Field'

const { TextArea } = Input
const FormItem = Form.Item

class StringArrayField extends Field {
  getField (name) {
    return this.fields[name]
  }

  showRender (obj) {
    const array = obj ? obj[this.key] : []
    const result = []
    for (let i = 0; i < array.length; i++) {
      if (this.footColor && i === array.length - 1) {
        result.push(<Tag key={array[i]} color={this.footColor}>{array[i]}</Tag>)
      } else if (this.headColor && i === 0) {
        result.push(<Tag key={array[i]} color={this.headColor}>{array[i]}</Tag>)
      } else {
        result.push(<Tag key={array[i]} color={this.color}>{array[i]}</Tag>)
      }
    }
    return result
  }

  setValue (object, { value }) {
    object[this.key] = value
  }

  editRender ({ getFieldDecorator, object, formItemLayout }) {
    object[this.key] = object[this.key] ? object[this.key] : ''
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key
    return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
      {this.input === 'text' &&
      getFieldDecorator(formKey, {
        rules: [
          { required: this.required },
        ],
        initialValue: object[this.key],
      })(<Input />)
      }
      {this.input === 'textarea' &&
      getFieldDecorator(formKey, {
        rules: [
          { required: this.required },
        ],
        initialValue: object[this.key],
      })(<TextArea autosize />)
      }
    </FormItem>)
  }
}

export default StringArrayField

