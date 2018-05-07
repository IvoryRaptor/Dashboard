import React from 'react'
import { Card, Layout, Button, Form } from 'antd'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import { Template } from '../../goshawk'
import styles from './index.less'

const { Footer } = Layout
const goshawk = window.goshawk

class FormPage extends Template {
  init ({ ...attr }) {
    Object.assign(this, attr)
    const { location } = attr
    this.page = goshawk.pages[location.pathname]
    this.mod = this.page.resource.key
  }

  getInputFields (config = {}) {
    const { customFields } = config
    const { dataset, page } = this
    const { modalAction } = dataset
    const { fields, resource } = page

    const input = fields[modalAction].map((f) => {
      if (customFields && customFields[modalAction] && customFields[modalAction].fields) {
        return customFields[modalAction].fields.find(i => i.key === f) || { key: f }
      }
      return { key: f }
    })

    const result = []
    for (let field of input) {
      let f = resource.getField(field.key) || {}
      f.mod = 'product'
      if (field.render) {
        f.render = field.render
      }
      if (field.setValue) {
        f.setValue = field.setValue
      }
      result.push(f)
    }
    return result
  }

  onEditForm (config = {}) {
    const { onEdit } = config
    const { mod, dispatch } = this
    if (onEdit) {
      return item => onEdit(item)
    }
    return (item) => {
      let data = JSON.parse(JSON.stringify(item))
      dispatch({
        type: `${mod}/setValue`,
        payload: {
          currentItem: data,
        },
      })
    }
  }

  renderFormItem ({ config = {}, form, formItemLayout, formItemLayoutWithOutLabel }) {
    if (!form) {
      return null
    }
    if (!formItemLayout) {
      formItemLayout = {
        labelCol: {
          xs: 6,
          md: 5,
        },
        wrapperCol: {
          xs: 14,
          md: 15,
        },
      }
    }
    if (!formItemLayoutWithOutLabel) {
      formItemLayoutWithOutLabel = {
        wrapperCol: {
          span: 10,
          offset: 5,
        },
      }
    }

    const { dataset, dispatch } = this
    const { currentItem } = dataset
    const inputFields = this.getInputFields(config)
    const onEditForm = this.onEditForm(config)

    const formItems = inputFields.map((field) => {
      if (field.render) {
        return field.render({
          ...form,
          onEditForm,
          dispatch,
          object: currentItem,
          formItemLayout,
          formItemLayoutWithOutLabel,
        })
      }
      return field.editRender({
        ...form,
        onEditForm,
        dispatch,
        object: currentItem,
        formItemLayout,
        formItemLayoutWithOutLabel,
      })
    })

    return formItems
  }

  render (config) {
    const { submit, submitText, cancel, cancelText, extra } = config
    const { mod, dispatch, dataset, page } = this
    const { currentItem, modalAction } = dataset
    const { fields, backPath } = page
    if (!fields || !fields[modalAction]) {
      return null
    }

    const getCardTitle = () => {
      let action = goshawk.getLocale(`pages/TablePage/${modalAction}`)
      let title = goshawk.getLocale(`${mod}/title`)
      return <span className={styles.title}>{`${action} ${title}`}</span>
    }

    const inputFields = this.getInputFields(config)
    const onEditForm = this.onEditForm(config)

    const formContent = ({ form }) => {
      this.form = form
      return <Form layout="horizontal"> {this.renderFormItem({ form })} </Form>
    }

    const FormWrapper = Form.create({
      onFieldsChange: (props, formFields) => {
        for (let name in formFields) {
          if (!formFields[name].errors) {
            let key = name.split('@')[0]
            let field = inputFields.find(v => v.key === key)
            field && field.setValue(currentItem, { value: formFields[name].value, name }, onEditForm)
          }
        }
      },
    })(formContent)

    let onUpdate = submit ? () => submit : () => {
      dispatch({ type: `${mod}/updateItem`, payload: { ...currentItem } })
      dispatch(routerRedux.push({ pathname: backPath }))
    }

    const onSubmit = () => {
      this.form.validateFields((err, values) => {
        if (!err) {
          onUpdate()
        } else {
          console.log(values)
        }
      })
    }

    let onCancel = cancel ? () => cancel : () => {
      dispatch(routerRedux.push({ pathname: backPath }))
    }

    let CancelBtn = <Button key="cancel" onClick={onCancel} className={styles.extraBtn}>{cancelText || goshawk.getLocale('pages/FormPage/back')}</Button>
    let SubmitBtn = <Button key="submit" type="primary" onClick={onSubmit} className={styles.extraBtn}>{submitText || goshawk.getLocale('pages/FormPage/submit')}</Button>

    const ExtraContent = () => {
      let content = []
      content.push(extra)
      content.push(CancelBtn)
      content.push(SubmitBtn)
      return content
    }

    return (<Page fullscreen>
      <Card title={getCardTitle()} extra={ExtraContent()} bordered={false}>
        <FormWrapper />
        <Footer style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          {CancelBtn}
          {SubmitBtn}
        </Footer>
      </Card>
    </Page>)
  }
}

export default FormPage
