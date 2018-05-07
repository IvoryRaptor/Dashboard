import React from 'react'
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

class ObjectSourceField extends Field {
  showRender (obj) {
    let value = obj ? obj[this.key] : {}
    return value.name
  }

  getSource () {
    return window.goshawk.getSource(this.source)
  }

  getFilters () {
    let filters = this.getSource() && this.getSource().map((item) => {
      return {
        text: item.name,
        value: item._id,
      }
    })
    return filters
  }

  editRender ({ getFieldDecorator, object, formItemLayout }) {
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key
    if (this.input === 'treeselect') {
      let treeData = mapTreeData(this.getSource(), 'title')
      const tProps = {
        treeData,
        allowClear: true,
        multiple: true,
        treeCheckable: true,
        treeDefaultExpandAll: true,
        // showCheckedStrategy: SHOW_PARENT,
        searchPlaceholder: 'Please select',
      }
      return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
        {getFieldDecorator(formKey, {
          initialValue: object[this.key],
        })(<TreeSelect {...tProps} />)
        }
      </FormItem>)
    }

    const mode = this.multiple ? 'multiple' : ''
    let value = object[this.key] || []
    const selectOpt = this.getSource() && this.getSource().map(item => (<Option
      key={item._id}
    >{item.name}</Option>))

    return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
      {getFieldDecorator(formKey, {
        initialValue: value._id,
      })(<Select mode={mode}>{selectOpt}</Select>)
      }
    </FormItem>)
  }

  setValue (object, { value }) {
    object[this.key] = this.getSource().find(item => item._id === value)
  }
}

export default ObjectSourceField

