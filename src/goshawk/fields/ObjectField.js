import React from 'react'
import { Divider, Collapse } from 'antd'
import util from 'util'
import Field from './Field'

const Panel = Collapse.Panel

class ObjectField extends Field {
  setValue (object, { value, name }) {
    let names = name.split('@')
    names.shift()
    let template = this
    let obj = object[this.key]
    let index
    names.map((item) => {
      if (isNaN(Number(item))) {
        template = template.getField(item)
        if (template && template.fields !== null) {
          obj = obj[item]
        }
      } else {
        index = Number(item)
      }
    })
    if ((typeof (index) !== 'undefined')) {
      obj = obj[index]
    }
    template.setValue(obj, { value })
  }

  editRender ({ object, ...props }) {
    let self = this
    let obj = object[this.key] || {}
    let parent = object.parent ? `${object.parent}@${this.key}` : this.key
    if (this.type === 'array') {
      let list = obj.map((item, index) => {
        let content = []
        item.parent = `${parent}@${index}`
        Object.keys(item).map((key) => {
          let template = self.getField(key)
          if (template) {
            content.push(template.editRender({
              ...props,
              object: item,
            }))
          }
        })
        return (<Panel header={`${this.resource.getLocale().fields[this.key]} ${index + 1}`} key={index} > {content} </Panel>)
      })

      return (<div key={this.key}>
        <Collapse>
          {list}
        </Collapse>
      </div>)
    }
    obj.parent = parent
    let content = Object.keys(obj).map((key) => {
      let template = self.getField(key)
      return template ? template.editRender({
        ...props,
        object: obj,
      }) : null
    })
    return (<div key={this.key}>
      <Divider>{this.resource.getLocale().fields[this.key]}</Divider>
      <div>{content}</div>
      <Divider />
    </div>)
  }
}

export default ObjectField
