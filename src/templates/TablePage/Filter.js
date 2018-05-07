import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input, Divider } from 'antd'

const Search = Input.Search
const goshawk = window.goshawk

const Filter = ({
  onCreate,
  onFilterChange,
  search,
  rightButtons,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
  ...props
}) => {
  const handleFields = (fields) => {
    // const { createTime } = fields
    // if (createTime.length) {
    //   fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    // }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const ColProps = {
    xs: 24,
    sm: 8,
    style: {
      display: 'flex',
      marginBottom: 16,
    },
  }

  const RightColProps = {
    xs: 24,
    sm: 16,
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
  }

  const content = rightButtons ? rightButtons.map((button) => {
    if (button.action === 'create') {
      return (
        <Button key={button.action} size="large" type="primary" icon="plus" onClick={onCreate}>{button.title || goshawk.getLocale('pages/TablePage/create')}</Button>
      )
    }
    return (<Button size={button.size || 'large'} type={button.type} key={button.action} style={{ marginLeft: 8 }} icon={button.icon || ''} onClick={button.onClick}>{button.title || button.action}</Button>)
  }) : null

  return (<div>
    <Row gutter={24}>

      <Col {...ColProps} >
        {search &&
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          {getFieldDecorator('$text')(<Search placeholder={'Search'} size="large" onSearch={handleSubmit} style={{ marginRight: 10 }} />)}
          <Button size="large" type="primary" onClick={handleSubmit} style={{ marginRight: 8 }}>{goshawk.getLocale('pages/TablePage/search')}</Button>
          <Button size="large" onClick={handleReset}>{goshawk.getLocale('pages/TablePage/reset')}</Button>
        </div>
        }
      </Col>
      <Col {...RightColProps}>
        {content}
        {props.rightExtra && content && Object.keys(props.rightExtra).length > 0 && Object.keys(content).length > 0 && <Divider type="vertical" />}
        {props.rightExtra}
      </Col>
    </Row>
  </div>)
}

Filter.propTypes = {
  onCreate: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  search: PropTypes.bool,
  rightButtons: PropTypes.array,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
