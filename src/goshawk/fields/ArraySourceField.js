import React from 'react'
import util from 'util'
import { Form, Select, TreeSelect } from 'antd'
import Field from './Field'

const FormItem = Form.Item
const Option = Select.Option

const mapTreeData = (treedata, label) => {
  let result = []
  treedata.map((node) => {
    let data = {
      label: node[label],
      value: node._id,
      key: node._id,
    }
    if (node.children && node.children.length > 0) {
      data.children = mapTreeData(node.children, 'title')
    }
    result.push(data)
  })
  return result
}

const findTreeNode = (obj, id) => {
  if (obj._id === id) {
    return obj
  }
  if (obj.children && obj.children.length > 0) {
    obj.children.map((item) => {
      return findTreeNode(item, id)
    })
  }
  return false
}

class ArraySourceField extends Field {
  showRender (obj) {
    let value = obj ? obj[this.key] : []
    let result = ''
    let title = this.sourceTitle || 'name'
    if (value) {
      value.map((item) => {
        result += `${item[title]} `
      })
    }
    return result.trim()
  }

  getSource () {
    return window.goshawk.getSource(this.source)
  }

  getFilters () {
    let _key = this.sourceKey || '_id'
    let title = this.sourceTitle || 'name'
    let filters =
      this.getSource() &&
      this.getSource().map((item) => {
        return {
          text: item[title],
          value: item[_key],
        }
      })
    return filters
  }

  getSelectOpt () {
    let selection = []
    let _key = this.sourceKey || '_id'
    let title = this.sourceTitle || 'name'
    this.getSource().map((item) => {
      selection.push(<Option key={item[_key]}>{item[title]}</Option>)
    })
    return selection
  }

  editRender ({ getFieldDecorator, object, formItemLayout }) {
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key
    const selectHtml = () => {
      switch (this.input) {
        case 'treeselect': {
          let treeData = mapTreeData(this.getSource(), 'title')
          const tProps = {
            treeData,
            allowClear: true,
            multiple: true,
            treeCheckable: true,
            treeDefaultExpandAll: true,
            searchPlaceholder: 'Please select',
          }
          return (getFieldDecorator(formKey, {
            initialValue: object[this.key],
            rules: [
              {
                required: this.required,
                message: `请选择${this.resource.getLocale().fields[this.key]}`,
              },
            ],
          })(<TreeSelect {...tProps} />))
        }
        default: {
          const mode = this.multiple ? 'multiple' : ''
          let value = object[this.key] || []
          return getFieldDecorator(formKey, {
            initialValue: value.map(item => item._id),
            rules: [
              {
                required: this.required,
                message: `请选择${
                  this.resource.getLocale().fields[this.key]
                }`,
              },
            ],
          })(<Select mode={mode} placeholder={this.resource.getLocale().fields[this.key]}>
            {this.getSelectOpt()}
          </Select>) }
      }
    }

    return (
      this.getSource() && (
        <FormItem
          key={this.key}
          label={this.resource.getLocale().fields[this.key]}
          {...formItemLayout}
        >
          {selectHtml()}
        </FormItem>
      )
    )
  }

  setValue (object, { value }) {
    let val = []
    let _key = this.sourceKey || '_id'
    if (!value || util.isString(value)) {
      val.push(value)
    } else {
      val = value
    }
    object[this.key] = val.map(v =>
      this.getSource().find(item => item[_key] === v)
    )
  }
}

export default ArraySourceField
