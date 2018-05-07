import PropTypes from 'prop-types'

const formItemLayout = {
  labelCol: {
    xs: 6,
    md: 5,
  },
  wrapperCol: {
    xs: 14,
    md: 15,
  },
}

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 10,
    offset: 5,
  },
}

const FormTemplate = ({ form, currentItem, inputFields, onEditForm, dispatch }) => {
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

FormTemplate.propTypes = {
  form: PropTypes.object.isRequired,
  currentItem: PropTypes.object,
  inputFields: PropTypes.array,
  onEditForm: PropTypes.func,
}

export default FormTemplate
