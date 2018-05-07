import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import Loader from '../../components/Loader'
import queryString from 'query-string'
// import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const List = ({ location,
  ...tableProps }) => {
  location.query = queryString.parse(location.search)
  tableProps.pagination.showTotal = total => `${window.goshawk.getLocale('pages/TablePage/total')} ${total}`
  const rowClassName = tableProps.striped ? (record, index) => {
    if (index % 2 === 0) {
      return styles.even
    }
    return styles.odd
  } : () => {}

  const getBodyWrapper = (body) => {
    return body
  }

  return (
    <div>
      {
        tableProps.dataSource ? <Table
          bordered
          rowClassName={rowClassName}
          components={getBodyWrapper}
          {...tableProps}
        /> : <Loader spinning />
      }
    </div>
  )
}

List.propTypes = {
  location: PropTypes.object,
}

export default List
