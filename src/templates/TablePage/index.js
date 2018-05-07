import React from 'react'
import util from 'util'
import {
  Modal,
  Divider,
  Popconfirm,
  message,
  Alert,
  Row,
  Col,
  Button,
} from 'antd'
import { routerRedux } from 'dva/router'
import { DropOption } from 'components'
import { Template } from '../../goshawk'

import Filter from './Filter'
import List from './List'
import styles from './index.less'
import TableModal from './TableModal'

const goshawk = window.goshawk

const deleteModal = ({ mod, ...props }) =>
  Modal.confirm({
    title: `${goshawk.getLocale('pages/alert/deleteItem/title')} ${mod}`,
    okText: goshawk.getLocale('pages/alert/deleteItem/ok'),
    cancelText: goshawk.getLocale('pages/alert/deleteItem/cancel'),
    okType: 'danger',
    ...props,
  })

class TablePage extends Template {
  init ({ ...attr }) {
    Object.assign(this, attr)
    this.mod = this.page.resource.key
  }

  getListColumn (columns, operations = [], handleMenuClick = null, tableConf) {
    const result = []
    const self = this
    for (let column of columns) {
      let resource = self.page.resource.getField(column.key)
      let render =
        column.render ||
        ((text, row) => {
          return column.onClick ? (
            <a onClick={() => column.onClick(row)}>
              {resource.showRender(row)}
            </a>
          ) : (
            resource.showRender(row)
          )
        })

      let filters = column.filters ? resource.getFilters() : {}
      let sorter = column.sorter || false
      let defaultSortOrder = column.defaultSortOrder || false
      let onFilter = column.onFilter || null
      result.push({
        title: goshawk.getLocale(`${self.mod}/fields/${column.key}`),
        dataIndex: column.key,
        key: column.key,
        ...column,
        render,
        filters,
        sorter,
        defaultSortOrder,
        onFilter,
      })
    }

    if (operations.length > 0) {
      const optCol = {
        title: goshawk.getLocale('pages/TablePage/operation'),
        key: 'operation',
        render: (text, record) => {
          let tmp = operations.filter(
            item => !(item.visible && !item.visible(record))
          )
          tmp.map((t) => {
            t.key = t.action
          })
          let link = []
          for (let index = 0; index < tmp.length && index < 3; index += 1) {
            let item = tmp[index]
            if (item.popconfirm) {
              link.push(
                <Popconfirm
                  key={item.action}
                  title={item.popconfirm}
                  onConfirm={() => handleMenuClick(record, item.key)}
                  onCancel={() => {
                    message.info('Click on Cancel.')
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <a href="#">{item.title || item.action}</a>
                </Popconfirm>
              )
              link.push(<Divider key={`${item.action}d`} type="vertical" />)
            } else {
              link.push(
                <a
                  key={item.action}
                  onClick={() => handleMenuClick(record, item.action)}
                  className={styles.tableLink}
                >
                  {item.title || item.action}
                </a>
              )
              link.push(<Divider key={`${item.action}d`} type="vertical" />)
            }
          }
          if (tmp.length > 3) {
            link.push(
              <DropOption
                key="other_menu"
                menuOptions={tmp.slice(2, tmp.length)}
                onMenuClick={e => handleMenuClick(record, e.key)}
              />
            )
          } else {
            link = link.slice(0, -1)
          }
          return link
        },
      }
      if (tableConf.fixedOpt) {
        optCol.fixed = tableConf.fixedOpt.position || 'right'
        optCol.width = tableConf.fixedOpt.width || 150
      }
      result.push(optCol)
    }
    return result
  }

  renderFilter (config) {
    const self = this
    const { mod, dispatch, page, dataset } = self
    const { filter, formpage } = page
    const { search, buttons } = filter
    const { selectedRowKeys } = dataset
    const onCreate = formpage
      ? () => {
        dispatch({
          type: `${mod}/setValue`,
          payload: {
            modalAction: 'create',
            currentItem: {},
          },
        })
        dispatch(routerRedux.push({ pathname: formpage }))
      }
      : () => {
        dispatch({
          type: `${mod}/showModal`,
          payload: {
            modalAction: 'create',
            currentItem: {},
          },
        })
      }

    const rightButtons =
      buttons && buttons.length > 0
        ? buttons.map((button) => {
          let btn = button
          if (config && config.buttons) {
            btn =
                config.buttons.find(item => item.action === button.action) ||
                button
          }
          btn.title =
              btn.title || goshawk.getLocale(`pages/TablePage/${btn.action}`)
          return btn
        })
        : null

    const onFilterChange = (value) => {
      const q = value.$text ? value : {}
      dispatch({
        type: `${mod}/$list`,
        payload: {
          query: q,
          sorter: dataset.sorter,
          filter: dataset.filter,
        },
        loading: 'listLoading',
      })
    }

    const filterProps = {
      search,
      rightButtons,
      onCreate,
      selectedRowKeys,
      onFilterChange,
      ...config,
    }
    return <Filter key="filter" {...filterProps} />
  }

  renderTable (tableConf) {
    const self = this
    const { mod, dispatch, dataset, location, page } = self
    const { table, formpage } = page
    const columns = table.columns.map((column) => {
      if (tableConf && tableConf.col) {
        return (
          tableConf.col.find(item => item.key === column) || { key: column }
        )
      }
      return { key: column }
    })
    const operations = table.operations.map((operation) => {
      let opt = operation
      if (tableConf && tableConf.buttons) {
        opt =
          tableConf.buttons.find(item => item.action === operation.action) ||
          operation
      }
      opt.title =
        opt.title || goshawk.getLocale(`pages/TablePage/${opt.action}`)
      return opt
    })
    const openForm = (action, row = {}) => {
      let item = JSON.parse(JSON.stringify(row))
      if (formpage) {
        dispatch({
          type: `${mod}/setValue`,
          payload: {
            modalAction: action,
            currentItem: item,
          },
        })
        dispatch(routerRedux.push({ pathname: formpage }))
      } else {
        dispatch({
          type: `${mod}/showModal`,
          payload: {
            modalAction: action,
            currentItem: item,
          },
        })
      }
    }

    const openDetails = (row = {}) => {
      // dispatch({
      //   type: `${mod}/findOne`,
      //   payload: {
      //     _id: row._id,
      //   },
      // })
      dispatch(routerRedux.push({ pathname: `${mod}/${row._id}` }))
    }

    const onDeleteItem = (row) => {
      deleteModal({
        mod,
        confirmLoading: dataset.modalLoading,
        onOk () {
          dispatch({
            type: `${mod}/$delete`,
            payload: row,
          })
        },
      })
    }
    const handleMenuClick = (record, action) => {
      const operation = operations.find(item => item.action === action)
      if (operation.handle) {
        operation.handle(record)
      } else if (operation.action.toLowerCase() === 'view') {
        openDetails(record)
      } else if (operation.action.toLowerCase() === 'edit') {
        openForm('edit', record)
      } else if (operation.action.toLowerCase() === 'delete') {
        onDeleteItem(record)
      } else if (operation.action.toLowerCase() === 'create') {
        openForm('create')
      } else {
        // let item = JSON.parse(JSON.stringify(record))
        openForm(operation.action.toLowerCase(), record)
      }
    }

    const rowSelection = tableConf.select
      ? {
        selectedRowKeys: dataset.selectedRowKeys,
        onChange: (keys) => {
          dispatch({
            type: `${mod}/setValue`,
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
        getCheckboxProps: tableConf.getCheckboxProps || null,
      }
      : null

    const onChange = (pagination, filters, sorter) => {
      const payload = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        sorter: {},
        query: {},
        filter: dataset.filter,
      }
      if (Object.keys(sorter).length > 0) {
        payload.sorter = {
          sortField: sorter.field,
          sortOrder: sorter.order,
        }
      } else {
        payload.sorter = dataset.sorter
      }
      if (filters) {
        Object.keys(filters).map((key) => {
          if (util.isArray(filters[key]) && filters[key].length > 0) {
            let trueKey = `${key}._id`
            payload.query[trueKey] = {
              $in: filters[key],
            }
          }
        })
      }
      dispatch({
        type: `${mod}/$list`,
        payload,
        loading: 'listLoading',
      })
    }

    let props = {
      loading: dataset.listLoading,
      location,
      size: tableConf.size || 'small',
      rowSelection,
      pagination: dataset.pagination,
      dataSource: dataset.list,
      columns: self.getListColumn(
        columns,
        operations,
        handleMenuClick,
        tableConf,
        dataset.list
      ),
      rowKey: '_id',
      onChange,
    }
    return (
      <div key="table">
        {tableConf.select && (
          <Row style={{ marginBottom: 15 }}>
            <Col span={3}>
              <Alert
                message={`已选： ${dataset.selectedRowKeys.length} 个`}
                type="info"
                showIcon
              />
            </Col>
            <Col span={16}>
              {dataset.selectedRowKeys.length > 0 &&
                tableConf.selectButtons &&
                tableConf.selectButtons.length > 0 &&
                tableConf.selectButtons.map((button) => {
                  return (
                    <Button
                      style={{ marginLeft: 10 }}
                      {...button}
                      onClick={() => button.onClick(dataset.selectedRowKeys)}
                    >
                      {button.label}
                    </Button>
                  )
                })}
            </Col>
          </Row>
        )}
        <List {...props} {...tableConf} />
      </div>
    )
  }

  renderModal (modalConf) {
    const self = this
    const { mod, dispatch, dataset, page } = self
    const { currentItem, modalAction, modalLoading, modalVisible } = dataset
    const { modal, resource } = page

    const getModalTitle = () => {
      let action = goshawk.getLocale(`pages/TablePage/${modalAction}`)
      let title = goshawk.getLocale(`${mod}/title`)
      return (
        modalConf.title || (
          <span className={styles.title}>{`${action} ${title}`}</span>
        )
      )
    }

    const getInputFields = () => {
      const result = []
      if (modal[modalAction]) {
        const input = modal[modalAction].map((f) => {
          if (modalConf[modalAction] && modalConf[modalAction].fields) {
            return (
              modalConf[modalAction].fields.find(i => i.key === f) || { key: f }
            )
          }
          return { key: f }
        })

        for (let field of input) {
          let f = resource.getField(field.key) || {}
          f.mod = mod
          if (field.render) {
            f.render = field.render
          }
          if (field.setValue) {
            f.setValue = field.setValue
          }
          result.push(f)
        }
      }
      return result
    }

    const onCancel = () => {
      dispatch({ type: `${mod}/hideModal` })
    }

    const onUpdate = () => {
      dispatch({
        type: `${mod}/setValue`,
        payload: { listLoading: true },
      })
      if (modalAction !== 'view') {
        dispatch({
          type: `${mod}/updateItem`,
          payload: { ...currentItem, actionEvent: modalAction },
        })
      } else {
        dispatch({ type: `${mod}/hideModal` })
      }
      dispatch({ type: `${mod}/hideModal` })
    }

    const onEditForm = (item) => {
      let data = JSON.parse(JSON.stringify(item))
      dispatch({
        type: `${mod}/setValue`,
        payload: {
          currentItem: data,
        },
      })
    }

    let inputFields = getInputFields()
    const props = {
      mod,
      inputFields,
      dispatch,
      currentItem,
      modalAction,
      confirmLoading: modalLoading,
      visible: modalVisible,
      custom: modalConf,
      title: getModalTitle(),
      destroyOnClose: true,
      onUpdate,
      onCancel,
      onEditForm,
    }
    return modal[modalAction] && <TableModal key="modal" {...props} />
  }

  render ({ tableConf, modalConf, filterConf }) {
    const { page } = this
    const { table, modal, filter } = page
    let html = []
    if (Object.keys(filter).length > 0) {
      html.push(this.renderFilter(filterConf))
    }
    if (table.columns) {
      html.push(this.renderTable(tableConf))
    }
    if (Object.keys(modal).length > 0) {
      html.push(this.renderModal(modalConf))
    }
    return html
  }
}

export default TablePage
