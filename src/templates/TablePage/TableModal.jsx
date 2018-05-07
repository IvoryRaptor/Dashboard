import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import FormTemplate from '../FormTemplate'

class TableModal extends React.Component {
  render () {
    const {
      form,
      onUpdate,
      currentItem,
      inputFields,
      modalAction,
      mod,
      custom = {},
      onEditForm,
      dispatch,
      ...props
    } = this.props

    let displayItems = null
    let editformProp = {
      form,
      inputFields,
      onEditForm,
      dispatch,
      currentItem,
    }

    switch (modalAction) {
      case 'edit':
        displayItems = <FormTemplate {...editformProp} />
        break
      case 'create':
        displayItems = <FormTemplate {...editformProp} />
        break
      case 'view':
        displayItems = <h5>view modal</h5>
        break
      default:
        displayItems = <FormTemplate {...editformProp} />
        break
    }

    const handleOk = () => {
      form.validateFields((err, values) => {
        if (!err) {
          onUpdate()
        } else {
          console.log(values)
        }
      })
    }

    return (
      <Modal onOk={handleOk} {...props} {...custom[modalAction]}>
        <Form>{displayItems}</Form>
      </Modal>
    )
  }
}

TableModal.propTypes = {
  mod: PropTypes.string.isRequired,
  currentItem: PropTypes.object,
  onEditForm: PropTypes.func,
  custom: PropTypes.object,
  modalAction: PropTypes.string.isRequired,
}

export default Form.create({
  onFieldsChange: (props, fields) => {
    let { currentItem, inputFields, onEditForm } = props
    for (let name in fields) {
      if (!fields[name].errors) {
        let key = name.split('@')[0]
        let field = inputFields.find(v => v.key === key)
        field &&
          field.setValue(
            currentItem,
            { value: fields[name].value, name },
            onEditForm
          )
      }
    }
  },
})(TableModal)
