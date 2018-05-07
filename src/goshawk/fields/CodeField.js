import React from 'react'
import { Form, Input } from 'antd'
import Field from './Field'
const FormItem = Form.Item
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/mode/python';
import 'brace/mode/protobuf';
import 'brace/mode/handlebars';


import 'brace/theme/ambiance';
import 'brace/theme/chaos';
import 'brace/theme/chrome';
import 'brace/theme/clouds';
import 'brace/theme/dawn';
import 'brace/theme/dracula';
import 'brace/theme/kuroir';
import 'brace/theme/xcode';

class CodeField extends Field {
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
    return (<FormItem key={this.key} label={this.resource.getLocale().fields[this.key]} {...formItemLayout}>
      {getFieldDecorator(formKey, {
        rules: [
          { required: this.required },
        ],
        initialValue: object[this.key],
      })(<AceEditor
        mode={this.script}
        theme={this.theme}
        height={this.height}
        width={this.width}
        // onChange={onChange}
        editorProps={{$blockScrolling: true}}
      />)
      }
    </FormItem>)
  }
}

export default CodeField

