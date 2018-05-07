import React from 'react'
import PropTypes from 'prop-types'
import util from 'util'
import { Modal, Table } from 'antd'
import styles from './Modal.less'

const ViewModal = ({
  item = {},
  fileds,
  goshawk,
  dispatch,
  dataset,
  modalType,
  ...props
}) => {
  const displayItems = () => {
    let res = []
    fileds.map((field) => {
      let obj = {
        key: field.key,
        name: field.label,
      }
      if (field.type === 'object') {
        obj.children = []
        Object.values(field.fields).map((subfield) => {
          let subObj = {
            key: subfield.key,
            name: subfield.label,
            value: subfield.render(item[field.key]),
          }
          obj.children.push(subObj)
        })
      } else {
        obj.value = field.render(item)
      }
      res.push(obj)
    })
    return res
  }

  const displayTableProps = modalType === 'view' && {
    showHeader: false,
    defaultExpandAllRows: true,
    indentSize: 0,
    size: 'small',
    pagination: false,
    columns: [{ title: 'Attr', dataIndex: 'name', key: 'name', width: '40%', render: text => <strong>{text}</strong> },
      { title: 'Value', dataIndex: 'value', key: 'value' }],
    dataSource: displayItems(),
  }

  return (
    <Modal
      title={<span className={styles.title}>{modalType} {dataset}</span>}
      {...props}
    >
      <Table {...displayTableProps} />
    </Modal>
  )
}


ViewModal.propTypes = {
  goshawk: PropTypes.object,
  dispatch: PropTypes.func,
  dataset: PropTypes.string.isRequired,
  fileds: PropTypes.array,
  item: PropTypes.object,
  modalType: PropTypes.string.isRequired,
}

export default ViewModal
