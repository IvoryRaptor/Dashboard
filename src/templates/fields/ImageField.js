import React from 'react'
import { Form, Avatar, Button, Modal, Card, Tooltip } from 'antd'
import ReactDragList from 'react-drag-list'
import { ImgUploader } from 'components'
import Field from './Field'
import styles from './ImageField.less'

const FormItem = Form.Item
const ImageItemLayout = {
  labelCol: {
    xs: 6,
    md: 5,
  },
  wrapperCol: {
    xs: 18,
  },
}

class ImageField extends Field {
  getField (name) {
    return this.fields[name]
  }

  showRender (obj) {
    if (obj[this.key]) {
      if (this.type === 'thumb') {
        return (
          <Avatar
            shape="square"
            size="large"
            src={obj[this.key]}
            style={{ backgroundColor: '#fff' }}
          />
        )
      } else if (this.type === 'array') {
        return (
          <Avatar
            shape="square"
            size="large"
            src={obj[this.key][0]}
            style={{ backgroundColor: '#fff' }}
          />
        )
      }
      return (
        <img
          src={obj[this.key]}
          alt={this.key}
          style={{ maxWidth: 150, maxHeight: 150 }}
        />
      )
    }
    return null
  }

  setValue (object, { value }) {
    let { file, fileList } = value
    if (file.type === 'array') {
      let list = []
      if (file.status === 'removed') {
        fileList.map(item => list.push(item.url))
        object[this.key] = list
      }
    }
    if (file.type === 'thumb') {
      if (file.status === 'removed') {
        object[this.key] = ''
      }
    }
  }

  editRender ({
    getFieldDecorator,
    onEditForm,
    dispatch,
    object,
    formItemLayout,
  }) {
    const formKey = object.parent ? `${object.parent}@${this.key}` : this.key
    if (!object[this.key]) {
      object[this.key] = this.type === 'array' ? [] : ''
    }

    const dragRow = (record) => {
      return (
        <Card hoverable className={styles.dragcard}>
          <img alt="" src={record} />
        </Card>
      )
    }

    const changeOrder = ({ oldIndex, newIndex }) => {
      const item = object[this.key].splice(oldIndex, 1)[0]
      object[this.key].splice(newIndex, 0, item)
      onEditForm(object)
    }

    const DragList = () => {
      return (
        <div className={styles.draglist}>
          <ReactDragList
            handles={false}
            dataSource={object[this.key]}
            row={dragRow}
            onUpdate={changeOrder}
          />
        </div>
      )
    }

    const editOrder = () => {
      Modal.warning({
        title: `修改${this.resource.getLocale().fields[this.key]}顺序`,
        content: <DragList />,
        className: styles.dragModal,
        iconType: 'swap',
        width: 700,
      })
    }

    const layout = formItemLayout || ImageItemLayout

    const label =
      this.type === 'array' && object[this.key].length > 1 ? (
        <span>
          {this.resource.getLocale().fields[this.key]}
          &nbsp;
          <Tooltip title="排序">
            <Button
              shape="circle"
              icon="swap"
              size="small"
              onClick={editOrder}
            />
          </Tooltip>
        </span>
      ) : (
        this.resource.getLocale().fields[this.key]
      )

    return (
      <FormItem key={this.key} label={label} {...layout}>
        {getFieldDecorator(formKey, {
          getValueFromEvent: this.normFile,
        })(
          <ImgUploader
            dispatch={dispatch}
            type={this.type}
            max={this.maxlength}
            data={object[this.key]}
            onUploaded={(url) => {
              if (this.type === 'array') {
                object[this.key].push(url)
              } else {
                object[this.key] = url
              }
              onEditForm(object)
            }}
          />
        )}
      </FormItem>
    )
  }
}

export default ImageField
