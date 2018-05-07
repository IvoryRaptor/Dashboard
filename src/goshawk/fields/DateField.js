import React from 'react'
import moment from 'moment'
import { Form, DatePicker } from 'antd'
import Field from './Field'

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item


class DateField extends Field {
  getField (name) {
    return this.fields[name]
  }

  showRender (object) {
    const date = moment(object[this.key])
    return date.format(this.format || 'YYYY-MM-D')
  }

  setValue (object, { value }) {
    return false
  }

  editRender ({ getFieldDecorator, onEditForm, object, formItemLayout }) {
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key
    const dateVal = moment(object[this.key])
    const onDateChange = (date) => {
      object[this.key] = date.valueOf()
      onEditForm(object)
    }

    if (this.type === 'start') {
      const start = dateVal
      const end = moment(object[this.end])
      let range = [start, end]
      const onRangeChange = (dates) => {
        object[this.key] = dates[0].valueOf()
        object[this.end] = dates[1].valueOf()
        onEditForm(object)
      }
      return (<FormItem key={this.key} label={this.resource.getLocale().fields.range} {...formItemLayout}>
        {getFieldDecorator(formKey, {
          rules: [
            { required: this.required },
          ],
          initialValue: range,
        })(<RangePicker
          disabled={this.disable}
          ranges={{ Today: [moment(), moment()] }}
          onChange={onRangeChange}
        />)}
      </FormItem>)
    } else if (this.type === 'end') {
      return null
    }


    return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
      { this.display ? <strong>{dateVal.format('YYYY年MM月D日 HH:mm')}</strong> : getFieldDecorator(formKey, {
        rules: [
          { required: this.required },
        ],
        initialValue: dateVal,
      })(<DatePicker disabled={this.disable} onChange={onDateChange} />)
      }

    </FormItem>)
  }
}

export default DateField

