import React from 'react'
import { Form, InputNumber } from 'antd'
import Field from './Field'

const FormItem = Form.Item

class PriceField extends Field {
  getField (name) {
    return this.fields[name]
  }

  showRender (obj) {
    return obj ? `￥${obj[this.key] / 100}` : null
  }

  setValue (object, { value }) {
    object[this.key] = value * 100
  }

  editRender ({ getFieldDecorator, object, formItemLayout }) {
    object[this.key] = object[this.key] ? object[this.key] : ''
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key
    return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
      { this.display ? <strong>￥{object[this.key] / 100}</strong> :
        getFieldDecorator(formKey, {
          rules: [
            { required: this.required },
          ],
          initialValue: object[this.key] / 100,
        })(<InputNumber
          style={{ width: 120 }}
          formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/￥\s?|(,*)/g, '')}
        />)
      }
    </FormItem>)
  }
}

export default PriceField

